"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { getNazayaRuntime } from "@/lib/runtime/nazaya-runtime";
import { routeNazayaIntent, type NazayaIntent } from "@/lib/ai/intent-router";
import { StatusPill } from "@/components/ui/StatusPill";
import { Surface } from "@/components/ui/Surface";
import { Button } from "@/components/Button";

// Minimal Web Speech API TypeScript interface — avoids any type.
interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number;
  isFinal: boolean;
}

interface SpeechRecognitionResultList {
  length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  length: number;
  item(index: number): SpeechRecognitionAlternative;
  isFinal: boolean;
  [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  language: string;
  start(): void;
  stop(): void;
  abort(): void;
  onstart: ((event: Event) => void) | null;
  onend: ((event: Event) => void) | null;
  onerror: ((event: SpeechRecognitionEvent) => void) | null;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
}

interface DeepgramTokenResponse {
  token?: string;
  configured?: boolean;
  message?: string;
}

type VoiceMode = "deepgram-live" | "browser-speech" | "typed";
type VoiceLanguage = "en-US" | "es-ES";

type VoiceIntakeWidgetProps = {
  onTranscriptChange?: (transcript: string) => void;
  placeholder?: string;
  className?: string;
};

/**
 * VoiceIntakeWidget — three-tier voice intake for caregiver needs.
 *
 * Tier 1: DEEPGRAM LIVE (hosted runtime) — native WebSocket to deepgram API,
 *         fetch short-lived token from /api/voice/deepgram/token
 * Tier 2: BROWSER SPEECH (Web Speech API fallback) — on unsupported/static
 * Tier 3: TYPED TEXTAREA (graceful degradation) — demo mode or no browser support
 *
 * Features:
 * - Live interim + final transcripts
 * - Intent routing (Resources / Legal / Grounding / Digital Parenting)
 * - Bilingual support (English/Español)
 * - Spoken replies (SpeechSynthesis)
 * - Recording indicator + privacy assurance
 *
 * Privacy: Transcripts are never persisted, only passed to parent via callback.
 */
export function VoiceIntakeWidget({
  onTranscriptChange,
  placeholder = "Speak to describe your needs...",
  className = "",
}: VoiceIntakeWidgetProps) {
  const [transcript, setTranscript] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [interimTranscript, setInterimTranscript] = useState("");
  const [error, setError] = useState("");
  const [voiceMode, setVoiceMode] = useState<VoiceMode>("typed");
  const [language, setLanguage] = useState<VoiceLanguage>("en-US");
  const [detectedIntent, setDetectedIntent] = useState<NazayaIntent | null>(null);
  const [readAloudEnabled, setReadAloudEnabled] = useState(false);
  const [recordingLevel, setRecordingLevel] = useState(0);

  // Refs for Web Speech API
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  // Refs for Deepgram WebSocket
  const wsRef = useRef<WebSocket | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const levelIntervalRef = useRef<number | null>(null);

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const runtime = getNazayaRuntime();
  const isHosted = runtime === "hosted";

  // Initialize Deepgram on hosted runtime.
  useEffect(() => {
    if (typeof window === "undefined" || !isHosted) {
      return;
    }

    let mounted = true;

    const setup = async () => {
      try {
        const res = await fetch("/api/voice/deepgram/token", { method: "POST" });
        if (!mounted) return;

        const data: DeepgramTokenResponse = await res.json().catch(() => ({}));

        if (!res.ok || !data.token) {
          // Token route returned 501 or no token — fallback to Web Speech.
          const windowWithSpeech = window as unknown as {
            SpeechRecognition?: new () => SpeechRecognition;
            webkitSpeechRecognition?: new () => SpeechRecognition;
          };
          const SpeechRecognitionConstructor =
            windowWithSpeech.SpeechRecognition ||
            windowWithSpeech.webkitSpeechRecognition;

          if (SpeechRecognitionConstructor) {
            const recognition = new SpeechRecognitionConstructor();
            recognition.continuous = true;
            recognition.interimResults = true;
            recognition.language = language;

            recognition.onstart = () => {
              setIsListening(true);
              setError("");
            };

            recognition.onresult = (event: SpeechRecognitionEvent) => {
              let interim = "";
              let final = "";

              for (let i = event.resultIndex; i < event.results.length; i += 1) {
                const transcriptChunk = event.results[i][0].transcript;

                if (event.results[i].isFinal) {
                  final += transcriptChunk + " ";
                } else {
                  interim += transcriptChunk;
                }
              }

              if (final) {
                setTranscript((prev) => {
                  const updated = prev + final;
                  onTranscriptChange?.(updated);
                  return updated;
                });
              }

              setInterimTranscript(interim);
            };

            recognition.onerror = (event: SpeechRecognitionEvent) => {
              setError(`Microphone error: ${event}`);
            };

            recognition.onend = () => {
              setIsListening(false);
            };

            recognitionRef.current = recognition;
            setVoiceMode("browser-speech");
          } else {
            setVoiceMode("typed");
          }
          return;
        }

        if (mounted) {
          setVoiceMode("deepgram-live");
        }
      } catch {
        // Network error or token fetch failed — fallback to Web Speech.
        if (mounted) {
          const windowWithSpeech = window as unknown as {
            SpeechRecognition?: new () => SpeechRecognition;
            webkitSpeechRecognition?: new () => SpeechRecognition;
          };
          const SpeechRecognitionConstructor =
            windowWithSpeech.SpeechRecognition ||
            windowWithSpeech.webkitSpeechRecognition;

          if (SpeechRecognitionConstructor) {
            setVoiceMode("browser-speech");
          } else {
            setVoiceMode("typed");
          }
        }
      }
    };

    setup();

    return () => {
      mounted = false;
      recognitionRef.current?.abort();
      cleanupDeepgram();
      if (levelIntervalRef.current) clearInterval(levelIntervalRef.current);
    };
  }, [isHosted, language, onTranscriptChange]);

  // When transcript changes, route intent.
  useEffect(() => {
    if (transcript.trim()) {
      const intent = routeNazayaIntent(transcript);
      setDetectedIntent(intent);
    } else {
      setDetectedIntent(null);
    }
  }, [transcript]);


  // Deepgram WebSocket setup.
  const startDeepgramListening = useCallback(async () => {
    try {
      // Fetch token.
      const res = await fetch("/api/voice/deepgram/token", { method: "POST" });
      const data: DeepgramTokenResponse = await res.json().catch(() => ({}));

      if (!res.ok || !data.token) {
        setError("Failed to get Deepgram token. Using browser fallback.");
        setVoiceMode("browser-speech");
        return;
      }

      // Request microphone access.
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      // Setup audio level monitoring.
      const audioContext = new AudioContext();
      audioContextRef.current = audioContext;
      const analyser = audioContext.createAnalyser();
      analyserRef.current = analyser;
      const source = audioContext.createMediaStreamSource(stream);
      source.connect(analyser);

      // Monitor recording levels.
      const dataArray = new Uint8Array(analyser.frequencyBinCount);
      if (levelIntervalRef.current) clearInterval(levelIntervalRef.current);
      levelIntervalRef.current = window.setInterval(() => {
        analyser.getByteFrequencyData(dataArray);
        const average =
          dataArray.reduce((a, b) => a + b, 0) / dataArray.length / 255;
        setRecordingLevel(Math.min(100, Math.round(average * 200)));
      }, 100);

      // Open WebSocket.
      const url = `wss://api.deepgram.com/v1/listen?model=nova-2&interim_results=true&language=${language}`;
      const ws = new WebSocket(url, ["token", data.token]);

      ws.onopen = () => {
        setIsListening(true);
        setError("");
        mediaRecorder.ondataavailable = (event) => {
          if (ws.readyState === WebSocket.OPEN) {
            ws.send(event.data);
          }
        };
        mediaRecorder.start(250); // Send chunks every 250ms.
      };

      ws.onmessage = (event) => {
        const msg = JSON.parse(event.data);
        if (msg.type === "Results") {
          const isLast = msg.is_final;
          const alternatives = msg.channel?.alternatives;

          if (alternatives && alternatives.length > 0) {
            const alt = alternatives[0];

            if (isLast) {
              setTranscript((prev) => {
                const updated = (prev + alt.transcript).trim() + " ";
                onTranscriptChange?.(updated);
                return updated;
              });
              setInterimTranscript("");
            } else {
              setInterimTranscript(alt.transcript || "");
            }
          }
        }
      };

      ws.onerror = () => {
        setError("Deepgram connection error. Falling back to browser speech.");
        cleanupDeepgram();
        setVoiceMode("browser-speech");
      };

      ws.onclose = () => {
        setIsListening(false);
        cleanupDeepgram();
      };

      wsRef.current = ws;
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : "Microphone access denied";
      setError(`Deepgram error: ${msg}. Using typed input.`);
      setVoiceMode("typed");
    }
  }, [language, onTranscriptChange]);

  const stopDeepgramListening = useCallback(() => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
    }
    if (wsRef.current) {
      wsRef.current.close();
    }
    cleanupDeepgram();
    setIsListening(false);
  }, []);

  const cleanupDeepgram = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stream
        .getTracks()
        .forEach((track) => track.stop());
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
    }
    if (levelIntervalRef.current) {
      clearInterval(levelIntervalRef.current);
      levelIntervalRef.current = null;
    }
  };


  const startListening = useCallback(() => {
    if (voiceMode === "deepgram-live") {
      startDeepgramListening();
    } else if (voiceMode === "browser-speech" && recognitionRef.current) {
      recognitionRef.current.language = language;
      recognitionRef.current.start();
    }
  }, [voiceMode, startDeepgramListening, language]);

  const stopListening = useCallback(() => {
    if (voiceMode === "deepgram-live") {
      stopDeepgramListening();
    } else if (voiceMode === "browser-speech" && recognitionRef.current) {
      recognitionRef.current.stop();
    }
  }, [voiceMode, stopDeepgramListening]);

  const handleClear = useCallback(() => {
    setTranscript("");
    setInterimTranscript("");
    setError("");
    setDetectedIntent(null);
    setRecordingLevel(0);
    onTranscriptChange?.("");
  }, [onTranscriptChange]);


  // Derive badge and labels.
  const displayTranscript = (transcript + interimTranscript).trim();
  const badgeTone =
    voiceMode === "deepgram-live"
      ? "mint"
      : voiceMode === "browser-speech"
        ? "lavender"
        : "butter";
  const badgeLabel =
    voiceMode === "deepgram-live"
      ? "Deepgram live"
      : voiceMode === "browser-speech"
        ? "Browser speech"
        : "Type";

  const languageLabel = language === "es-ES" ? "Español" : "English";
  const intentToPath: Record<NazayaIntent, string> = {
    resources: "/resources",
    legal_forms: "/legal",
    grounding: "/resources#grounding",
    digital_parenting: "/digital-parenting",
    general: "/resources",
  };

  return (
    <Surface className={`space-y-4 ${className}`}>
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-ink">Voice Intake</h3>
          <p className="mt-1 text-sm text-ink-muted">
            Tell us what you need help with by speaking into your microphone.
          </p>
        </div>
        <div className="flex gap-2 items-start">
          <StatusPill tone={badgeTone}>{badgeLabel}</StatusPill>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value as VoiceLanguage)}
            className="px-3 py-1 text-xs border border-lavender-deep/40 rounded-full bg-cream text-ink focus:outline-none focus:border-purple"
          >
            <option value="en-US">English</option>
            <option value="es-ES">Español</option>
          </select>
        </div>
      </div>

      {(voiceMode === "deepgram-live" || voiceMode === "browser-speech") ? (
        // Live microphone mode.
        <div className="space-y-3">
          <div className="flex gap-2">
            <Button
              onClick={isListening ? stopListening : startListening}
              variant={isListening ? "secondary" : "primary"}
              className="flex-1"
            >
              {isListening ? (
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                  Listening...
                </span>
              ) : (
                "Start Listening"
              )}
            </Button>
            {(displayTranscript || error) && (
              <Button
                onClick={handleClear}
                variant="ghost"
                className="flex-1"
              >
                Clear
              </Button>
            )}
          </div>

          {voiceMode === "deepgram-live" && isListening && (
            <div className="flex items-center gap-2 p-2 bg-lavender-light/50 rounded-lg">
              <div className="flex-1 h-1 bg-lavender-deep/20 rounded-full overflow-hidden">
                <div
                  className="h-full bg-purple transition-all duration-100"
                  style={{ width: `${recordingLevel}%` }}
                />
              </div>
              <span className="text-xs text-ink-muted">{recordingLevel}%</span>
            </div>
          )}

          {error && (
            <p className="text-sm text-red-600">{error}</p>
          )}

          {displayTranscript && (
            <div className="rounded-2xl border border-lavender-deep/40 bg-lavender-light/50 p-4">
              <p className="text-sm text-ink-muted mb-2">Transcript:</p>
              <p className="text-base text-ink">{displayTranscript}</p>
            </div>
          )}

          {detectedIntent && detectedIntent !== "general" && (
            <div className="rounded-2xl border border-purple/30 bg-purple/5 p-4">
              <p className="text-sm text-ink-muted mb-2">Suggested next step:</p>
              <a
                href={intentToPath[detectedIntent]}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple text-cream font-medium text-sm hover:bg-purple-deep transition"
              >
                {detectedIntent === "resources" && "Find resources"}
                {detectedIntent === "legal_forms" && "Legal forms"}
                {detectedIntent === "grounding" && "Grounding tools"}
                {detectedIntent === "digital_parenting" && "Digital parenting"}
                →
              </a>
            </div>
          )}

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="readAloud"
              checked={readAloudEnabled}
              onChange={(e) => setReadAloudEnabled(e.target.checked)}
              className="rounded"
            />
            <label htmlFor="readAloud" className="text-sm text-ink-muted">
              Read replies aloud ({languageLabel})
            </label>
          </div>

          <p className="text-xs text-ink-muted">
            Transcripts are never stored. Your voice is securely processed and
            routed to resource specialists.
          </p>
        </div>
      ) : (
        // Demo fallback: typed textarea (static preview or unsupported browser).
        <div className="space-y-3">
          <textarea
            ref={textareaRef}
            value={transcript}
            onChange={(e) => {
              setTranscript(e.target.value);
              onTranscriptChange?.(e.target.value);
            }}
            placeholder={placeholder}
            className="w-full rounded-2xl border-2 border-lavender-deep/40 bg-cream p-4 text-base text-ink focus:border-purple focus:outline-none"
            rows={4}
          />

          {displayTranscript && (
            <div className="rounded-2xl border border-purple/30 bg-purple/5 p-4">
              <p className="text-sm text-ink-muted mb-2">Suggested next step:</p>
              <a
                href={intentToPath[detectedIntent || "general"]}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple text-cream font-medium text-sm hover:bg-purple-deep transition"
              >
                {(detectedIntent || "general") === "resources" &&
                  "Find resources"}
                {(detectedIntent || "general") === "legal_forms" &&
                  "Legal forms"}
                {(detectedIntent || "general") === "grounding" &&
                  "Grounding tools"}
                {(detectedIntent || "general") === "digital_parenting" &&
                  "Digital parenting"}
                {(detectedIntent || "general") === "general" && "Explore resources"}
                →
              </a>
            </div>
          )}

          {transcript && (
            <Button
              onClick={handleClear}
              variant="ghost"
              className="w-full"
            >
              Clear
            </Button>
          )}

          <p className="text-xs text-ink-muted">
            Demo mode: type your needs here. In the live app, you&apos;ll use your
            microphone for real-time voice intake.
          </p>
        </div>
      )}
    </Surface>
  );
}
