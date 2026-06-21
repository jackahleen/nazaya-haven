/**
 * Deepgram WebSocket client — handles real-time voice streaming to Deepgram API.
 * Uses native WebSocket (no SDK dependency) for minimal bundle size.
 */

export interface DeepgramMessage {
  type: string;
  is_final?: boolean;
  channel?: {
    alternatives?: Array<{
      transcript: string;
      confidence?: number;
    }>;
  };
}

export class DeepgramVoiceClient {
  private ws: WebSocket | null = null;
  private mediaRecorder: MediaRecorder | null = null;
  private audioContext: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private stream: MediaStream | null = null;

  constructor(
    private token: string,
    private language: string,
    private onMessage: (msg: DeepgramMessage) => void,
    private onError: (error: string) => void,
    private onClose: () => void,
  ) {}

  async connect(): Promise<void> {
    try {
      // Request microphone access.
      this.stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      // Setup audio context and analyser for level monitoring.
      this.audioContext = new AudioContext();
      this.analyser = this.audioContext.createAnalyser();
      const source = this.audioContext.createMediaStreamSource(this.stream);
      source.connect(this.analyser);

      // Setup MediaRecorder.
      this.mediaRecorder = new MediaRecorder(this.stream);

      // Open WebSocket to Deepgram.
      const url = `wss://api.deepgram.com/v1/listen?model=nova-2&interim_results=true&language=${this.language}`;
      this.ws = new WebSocket(url, ["token", this.token]);

      this.ws.onopen = () => {
        this.mediaRecorder?.start(250); // Send chunks every 250ms.
      };

      this.ws.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data) as DeepgramMessage;
          this.onMessage(msg);
        } catch {
          this.onError("Failed to parse Deepgram message");
        }
      };

      this.ws.onerror = () => {
        this.onError("WebSocket connection error");
      };

      this.ws.onclose = () => {
        this.onClose();
        this.cleanup();
      };

      // Setup media recorder to send audio data to WebSocket.
      this.mediaRecorder.ondataavailable = (event) => {
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
          this.ws.send(event.data);
        }
      };
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Unknown error";
      this.onError(`Failed to initialize Deepgram client: ${msg}`);
    }
  }

  getAudioLevel(): number {
    if (!this.analyser) return 0;

    const dataArray = new Uint8Array(this.analyser.frequencyBinCount);
    this.analyser.getByteFrequencyData(dataArray);
    const average =
      dataArray.reduce((a, b) => a + b, 0) / dataArray.length / 255;
    return Math.min(100, Math.round(average * 200));
  }

  disconnect(): void {
    if (this.mediaRecorder && this.mediaRecorder.state !== "inactive") {
      this.mediaRecorder.stop();
    }
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.close();
    }
    this.cleanup();
  }

  private cleanup(): void {
    if (this.stream) {
      this.stream.getTracks().forEach((track) => track.stop());
    }
    if (this.audioContext && this.audioContext.state !== "closed") {
      this.audioContext.close();
    }
  }
}
