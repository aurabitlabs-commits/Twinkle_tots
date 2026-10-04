// Ambient storybook music and sound effects generator using Web Audio API

class StorybookAudioEngine {
  private ctx: AudioContext | null = null;
  private isBgmPlaying = false;
  private bgmTimeoutIds: number[] = [];
  private bgmGain: GainNode | null = null;
  private sfxGain: GainNode | null = null;

  private init() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
        this.bgmGain = this.ctx.createGain();
        this.bgmGain.gain.setValueAtTime(0.06, this.ctx.currentTime); // Soft soothing background
        this.bgmGain.connect(this.ctx.destination);

        this.sfxGain = this.ctx.createGain();
        this.sfxGain.gain.setValueAtTime(0.2, this.ctx.currentTime);
        this.sfxGain.connect(this.ctx.destination);
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Soft storybook lullaby arpeggios (C - Am - F - G)
  startStoryBgm() {
    this.stopStoryBgm();
    this.init();
    if (!this.ctx || !this.bgmGain) return;

    this.isBgmPlaying = true;
    const chords = [
      [261.63, 329.63, 392.0, 523.25], // C major
      [220.0, 261.63, 329.63, 440.0],  // A minor
      [174.61, 220.0, 261.63, 349.23], // F major
      [196.0, 246.94, 293.66, 392.0],  // G major
    ];

    let chordIdx = 0;
    const stepTime = 0.6; // seconds per note

    const playChordArpeggio = () => {
      if (!this.isBgmPlaying || !this.ctx || !this.bgmGain) return;

      const chord = chords[chordIdx % chords.length];
      chordIdx++;

      chord.forEach((freq, noteIdx) => {
        const tid = window.setTimeout(() => {
          if (!this.isBgmPlaying || !this.ctx || !this.bgmGain) return;
          this.playWarmChime(freq, 1.4);
        }, noteIdx * stepTime * 1000);
        this.bgmTimeoutIds.push(tid);
      });

      const nextLoopTid = window.setTimeout(() => {
        if (this.isBgmPlaying) {
          playChordArpeggio();
        }
      }, chord.length * stepTime * 1000);

      this.bgmTimeoutIds.push(nextLoopTid);
    };

    playChordArpeggio();
  }

  private playWarmChime(freq: number, duration: number) {
    if (!this.ctx || !this.bgmGain) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

    const now = this.ctx.currentTime;
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.2, now + 0.1);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    osc.connect(gain);
    gain.connect(this.bgmGain);

    osc.start(now);
    osc.stop(now + duration + 0.05);
  }

  stopStoryBgm() {
    this.isBgmPlaying = false;
    this.bgmTimeoutIds.forEach((id) => clearTimeout(id));
    this.bgmTimeoutIds = [];
  }

  // Page turn whoosh + chime
  playPageTurn() {
    this.init();
    if (!this.ctx || !this.sfxGain) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(320, now);
    osc.frequency.exponentialRampToValueAtTime(640, now + 0.18);

    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(now);
    osc.stop(now + 0.25);
  }

  // Sparkle chime on hotspot / character interaction
  playSparkle() {
    this.init();
    if (!this.ctx || !this.sfxGain) return;

    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
    notes.forEach((freq, idx) => {
      setTimeout(() => {
        if (!this.ctx || !this.sfxGain) return;
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);

        gain.gain.setValueAtTime(0.18, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

        osc.connect(gain);
        gain.connect(this.sfxGain);

        osc.start(now);
        osc.stop(now + 0.45);
      }, idx * 70);
    });
  }

  // Water splash drop sound
  playWaterDrop() {
    this.init();
    if (!this.ctx || !this.sfxGain) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(600, now);
    osc.frequency.exponentialRampToValueAtTime(1400, now + 0.12);

    gain.gain.setValueAtTime(0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(now);
    osc.stop(now + 0.2);
  }

  // Happy animal bounce boing
  playBoing() {
    this.init();
    if (!this.ctx || !this.sfxGain) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(220, now);
    osc.frequency.exponentialRampToValueAtTime(440, now + 0.15);

    gain.gain.setValueAtTime(0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(now);
    osc.stop(now + 0.28);
  }
}

export const storybookAudio = new StorybookAudioEngine();
