/**
 * SpeechSynthesis utilities — read text aloud with language support.
 * Uses native browser Web Speech API for accessibility.
 */

export function speakText(text: string, language: "en-US" | "es-ES"): void {
  if (!("speechSynthesis" in window)) return;

  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = language === "es-ES" ? "es-ES" : "en-US";
  utterance.rate = 1;
  window.speechSynthesis.speak(utterance);
}

export function stopSpeaking(): void {
  if ("speechSynthesis" in window) {
    window.speechSynthesis.cancel();
  }
}

export function isSpeechSynthesisSupported(): boolean {
  return "speechSynthesis" in window;
}
