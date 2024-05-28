export class TTS {
  static async speak(text: string) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'zh-CN';
    return window.speechSynthesis.speak(utterance);
  }
}