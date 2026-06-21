"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { getNazayaRuntime } from "@/lib/runtime/nazaya-runtime";
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

type VoiceIntakeWidgetProps = {
  onTranscriptChange?: (transcript: string) => void;
  placeholder?: string;
  className?: string;
};

/**
 * VoiceIntakeWidget — a mic toggle for caregiver voice intake using Web Speech API.
 *
 * Supports both static preview (demo textarea fallback) and hosted runtime (live Web Speech API).
 * Displays a badge indicating the active mode and transcribes speech to text in real-time.
 *
 * Privacy: Transcripts are never persisted, only passed to parent via callback.
 *
 * Future: Wire to /api/voice/deepgram/token for live Deepgram streaming integration.
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
  const [isSupported, setIsSupported] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const runtime = getNazayaRuntime();
  const isHosted = runtime === "hosted";

  // Initialize Web Speech API on mount.
  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    interface WindowWithSpeech extends Window {
      SpeechRecognition?: new () => SpeechRecognition;
      webkitSpeechRecognition?: new () => SpeechRecognition;
    }

    const windowWithSpeech = window as WindowWithSpeech;
    const SpeechRecognitionConstructor =
      windowWithSpeech.SpeechRecognition ||
      windowWithSpeech.webkitSpeechRecognition;

    if (SpeechRecognitionConstructor) {
      setIsSupported(true);
      const recognition = new SpeechRecognitionConstructor();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.language = "en-US";

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
    } else {
      setIsSupported(false);
    }

    return () => {
      recognitionRef.current?.abort();
    };
  }, [onTranscriptChange]);

  const startListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.start();
    }
  }, []);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  }, []);

  const handleClear = useCallback(() => {
    setTranscript("");
    setInterimTranscript("");
    setError("");
    onTranscriptChange?.("");
  }, [onTranscriptChange]);

  // Derive the combined display transcript (final + interim).
  const displayTranscript = (transcript + interimTranscript).trim();

  // Badge tone: hosted gets "mint" (active), static gets "butter" (demo fallback).
  const badgeTone = isHosted && isSupported ? "mint" : "butter";
  const badgeLabel = isHosted
    ? isSupported
      ? "Deepgram-ready (live)"
      : "Microphone unavailable"
    : "Demo mic (browser speech)";

  return (
    <Surface className={`space-y-4 ${className}`}>
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-ink">Voice Intake</h3>
          <p className="mt-1 text-sm text-ink-muted">
            Tell us what you need help with by speaking into your microphone.
          </p>
        </div>
        <StatusPill tone={badgeTone}>{badgeLabel}</StatusPill>
      </div>

      {isSupported && isHosted ? (
        // Live microphone mode (hosted).
        <div className="space-y-3">
          <div className="flex gap-2">
            <Button
              onClick={isListening ? stopListening : startListening}
              variant={isListening ? "secondary" : "primary"}
              className="flex-1"
            >
              {isListening ? "Stop Listening" : "Start Listening"}
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

          {error && (
            <p className="text-sm text-red-600">{error}</p>
          )}

          {displayTranscript && (
            <div className="rounded-2xl border border-lavender-deep/40 bg-lavender-light/50 p-4">
              <p className="text-sm text-ink-muted mb-2">Transcript:</p>
              <p className="text-base text-ink">{displayTranscript}</p>
            </div>
          )}

          <p className="text-xs text-ink-muted">
            Transcript is never persisted. Speak naturally — the system captures
            your needs and routes them to resource specialists.
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
            microphone. Deepgram integration is{" "}
            <a
              href="/dashboard/#deepgram-integration"
              className="font-medium text-purple hover:text-purple-deep"
            >
              next-step
            </a>
            .
          </p>
        </div>
      )}
    </Surface>
  );
}
