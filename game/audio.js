// audio.js — every sound in the game is synthesized with WebAudio.
// No audio files, no network: a few oscillators and a gain envelope each.

export class SoundFX {
  constructor() {
    this.context = null;
    this.muted = false;
  }

  ensure() {
    if (!this.context) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      this.context = new AC();
    }
    if (this.context.state === 'suspended') {
      this.context.resume();
    }
    return this.context;
  }

  tone(freq, at, dur, type, vol) {
    const ac = this.ensure();
    if (!ac || this.muted) return;
    const osc = ac.createOscillator();
    const gain = ac.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0, ac.currentTime + at);
    gain.gain.linearRampToValueAtTime(vol, ac.currentTime + at + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + at + dur);
    osc.connect(gain);
    gain.connect(ac.destination);
    osc.start(ac.currentTime + at);
    osc.stop(ac.currentTime + at + dur + 0.05);
  }

  // A satisfying two-note chime when a difference is found.
  find() {
    this.tone(660, 0, 0.16, 'sine', 0.22);
    this.tone(990, 0.09, 0.24, 'sine', 0.2);
  }

  // A soft low thud for a wrong click.
  miss() {
    this.tone(140, 0, 0.18, 'triangle', 0.18);
  }

  // A bright arpeggio when the last difference is found.
  win() {
    [523, 659, 784, 1047].forEach((f, i) => {
      this.tone(f, i * 0.11, 0.3, 'sine', 0.2);
    });
  }

  // A gentle ping when a hint is used.
  hint() {
    this.tone(880, 0, 0.2, 'sine', 0.14);
    this.tone(1175, 0.07, 0.22, 'sine', 0.12);
  }

  // A quiet tick for buttons.
  click() {
    this.tone(520, 0, 0.07, 'square', 0.06);
  }
}
