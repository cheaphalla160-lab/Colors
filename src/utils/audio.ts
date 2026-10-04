/**
 * Audio Engine for English Color Fun Lab
 * - Procedural Cheerful BGM using Web Audio API (Zero external network dependencies, lightweight, lovely)
 * - Kid-friendly sound effects (Click, Success, Wrong, Bingo Fanfare)
 * - High-clarity Web Speech API for authentic pronunciation
 */

class SoundEngine {
  private ctx: AudioContext | null = null;
  private bgmInterval: number | null = null;
  private bgmGain: GainNode | null = null;
  private isBgmPlaying = false;
  private bgmVolume = 0.18;
  private sfxVolume = 0.3;
  private sfxEnabled = true;

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  // --- Sound Effects ---
  public playClick() {
    if (!this.sfxEnabled) return;
    try {
      const ctx = this.initContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.08);

      gain.gain.setValueAtTime(this.sfxVolume * 0.5, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.08);
    } catch {
      // Audio context might not be allowed before user interaction
    }
  }

  public playSuccess() {
    if (!this.sfxEnabled) return;
    try {
      const ctx = this.initContext();
      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.value = freq;

        const startTime = ctx.currentTime + idx * 0.07;
        const duration = 0.22;

        gain.gain.setValueAtTime(0.001, startTime);
        gain.gain.linearRampToValueAtTime(this.sfxVolume * 0.6, startTime + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(startTime);
        osc.stop(startTime + duration);
      });
    } catch {
      // Ignore audio error
    }
  }

  public playWrong() {
    if (!this.sfxEnabled) return;
    try {
      const ctx = this.initContext();
      const notes = [330, 277]; // E4, C#4 (gentle descending boop)
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.value = freq;

        const startTime = ctx.currentTime + idx * 0.12;
        const duration = 0.18;

        gain.gain.setValueAtTime(0.001, startTime);
        gain.gain.linearRampToValueAtTime(this.sfxVolume * 0.4, startTime + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(startTime);
        osc.stop(startTime + duration);
      });
    } catch {
      // Ignore
    }
  }

  public playBingoFanfare() {
    if (!this.sfxEnabled) return;
    try {
      const ctx = this.initContext();
      const fanfare = [
        { f: 523.25, d: 0.12, t: 0 },
        { f: 523.25, d: 0.12, t: 0.12 },
        { f: 523.25, d: 0.12, t: 0.24 },
        { f: 659.25, d: 0.25, t: 0.38 },
        { f: 783.99, d: 0.25, t: 0.65 },
        { f: 1046.5, d: 0.6,  t: 0.92 }
      ];

      fanfare.forEach(item => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.value = item.f;

        const start = ctx.currentTime + item.t;
        gain.gain.setValueAtTime(0.001, start);
        gain.gain.linearRampToValueAtTime(this.sfxVolume * 0.7, start + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, start + item.d);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(start);
        osc.stop(start + item.d);
      });
    } catch {
      // Ignore
    }
  }

  // --- Procedural Cheerful BGM Engine ---
  public toggleBgm(): boolean {
    if (this.isBgmPlaying) {
      this.stopBgm();
      return false;
    } else {
      this.startBgm();
      return true;
    }
  }

  public getIsBgmPlaying(): boolean {
    return this.isBgmPlaying;
  }

  public setBgmVolume(vol: number) {
    this.bgmVolume = Math.max(0, Math.min(1, vol));
    if (this.bgmGain && this.ctx) {
      this.bgmGain.gain.setValueAtTime(this.bgmVolume * 0.15, this.ctx.currentTime);
    }
  }

  public startBgm() {
    if (this.isBgmPlaying) return;
    try {
      const ctx = this.initContext();
      this.isBgmPlaying = true;

      this.bgmGain = ctx.createGain();
      this.bgmGain.gain.setValueAtTime(this.bgmVolume * 0.15, ctx.currentTime);
      this.bgmGain.connect(ctx.destination);

      // Playful upbeat acoustic chords & melody progression (C - G - Am - F)
      const chordNotes = [
        [261.63, 329.63, 392.00], // C major (C4, E4, G4)
        [196.00, 246.94, 293.66], // G major (G3, B3, D4)
        [220.00, 261.63, 329.63], // A minor (A3, C4, E4)
        [174.61, 220.00, 261.63]  // F major (F3, A3, C4)
      ];

      const melodySequence = [
        523.25, 659.25, 783.99, 659.25, // C5, E5, G5, E5
        587.33, 493.88, 392.00, 493.88, // D5, B4, G4, B4
        440.00, 523.25, 659.25, 523.25, // A4, C5, E5, C5
        698.46, 659.25, 587.33, 523.25  // F5, E5, D5, C5
      ];

      let step = 0;
      const bpm = 112;
      const beatInterval = (60 / bpm) * 500; // 8th note interval in ms

      this.bgmInterval = window.setInterval(() => {
        if (!this.isBgmPlaying || !this.ctx || !this.bgmGain) return;

        const now = this.ctx.currentTime;
        const currentChordIdx = Math.floor((step % 16) / 4);
        const chord = chordNotes[currentChordIdx];

        // Pluck chord arpeggio
        const noteFreq = chord[step % chord.length];
        const oscChord = this.ctx.createOscillator();
        const gainChord = this.ctx.createGain();

        oscChord.type = 'sine';
        oscChord.frequency.setValueAtTime(noteFreq, now);

        gainChord.gain.setValueAtTime(0.04, now);
        gainChord.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

        oscChord.connect(gainChord);
        gainChord.connect(this.bgmGain);

        oscChord.start(now);
        oscChord.stop(now + 0.35);

        // Cheerful Kalimba / Marimba high melody note every 2 steps
        if (step % 2 === 0) {
          const melodyNote = melodySequence[step % melodySequence.length];
          const oscMelody = this.ctx.createOscillator();
          const gainMelody = this.ctx.createGain();

          oscMelody.type = 'triangle';
          oscMelody.frequency.setValueAtTime(melodyNote, now);

          gainMelody.gain.setValueAtTime(0.06, now);
          gainMelody.gain.exponentialRampToValueAtTime(0.001, now + 0.28);

          oscMelody.connect(gainMelody);
          gainMelody.connect(this.bgmGain);

          oscMelody.start(now);
          oscMelody.stop(now + 0.28);
        }

        step = (step + 1) % 16;
      }, beatInterval);
    } catch {
      this.isBgmPlaying = false;
    }
  }

  public stopBgm() {
    this.isBgmPlaying = false;
    if (this.bgmInterval !== null) {
      clearInterval(this.bgmInterval);
      this.bgmInterval = null;
    }
  }

  public setSfxEnabled(enabled: boolean) {
    this.sfxEnabled = enabled;
  }

  public isSfxEnabled(): boolean {
    return this.sfxEnabled;
  }
}

export const sound = new SoundEngine();

// --- Speech Synthesis Engine ---
export function speakWord(text: string, rate: number = 0.9) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    return;
  }

  try {
    window.speechSynthesis.cancel(); // cancel previous utterance

    const cleanText = text.replace(/[\/·]/g, '').trim();
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = rate;
    utterance.pitch = 1.1; // slightly higher, friendlier kid-friendly pitch

    const voices = window.speechSynthesis.getVoices();
    // Prioritize natural English voices
    const enVoice = voices.find(v => 
      (v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Samantha') || v.name.includes('Google') || v.name.includes('Karen') || v.name.includes('Victoria')))
    ) || voices.find(v => v.lang.startsWith('en'));

    if (enVoice) {
      utterance.voice = enVoice;
    } else {
      utterance.lang = 'en-US';
    }

    window.speechSynthesis.speak(utterance);
  } catch (err) {
    console.warn('Speech synthesis error:', err);
  }
}

export function speakSentence(question: string, answer: string, rate: number = 0.9) {
  const combined = `${question} ... ${answer}`;
  speakWord(combined, rate);
}
