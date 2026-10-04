// Nursery Rhyme Melodies using Web Audio API

interface Note {
  pitch: string; // e.g. "C4", "G4", "A4"
  duration: number; // in seconds
}

const FREQUENCIES: Record<string, number> = {
  C3: 130.81,
  D3: 146.83,
  E3: 164.81,
  F3: 174.61,
  G3: 196.0,
  A3: 220.0,
  B3: 246.94,
  C4: 261.63,
  D4: 293.66,
  E4: 329.63,
  F4: 349.23,
  G4: 392.0,
  A4: 440.0,
  B4: 493.88,
  C5: 523.25,
  D5: 587.33,
  E5: 659.25,
  F5: 698.46,
  G5: 783.99,
  A5: 880.0,
  REST: 0,
};

// Melodies for the 6 nursery rhymes
const RHYME_MELODIES: Record<string, Note[]> = {
  twinkle: [
    { pitch: 'C4', duration: 0.5 },
    { pitch: 'C4', duration: 0.5 },
    { pitch: 'G4', duration: 0.5 },
    { pitch: 'G4', duration: 0.5 },
    { pitch: 'A4', duration: 0.5 },
    { pitch: 'A4', duration: 0.5 },
    { pitch: 'G4', duration: 1.0 },

    { pitch: 'F4', duration: 0.5 },
    { pitch: 'F4', duration: 0.5 },
    { pitch: 'E4', duration: 0.5 },
    { pitch: 'E4', duration: 0.5 },
    { pitch: 'D4', duration: 0.5 },
    { pitch: 'D4', duration: 0.5 },
    { pitch: 'C4', duration: 1.0 },

    { pitch: 'G4', duration: 0.5 },
    { pitch: 'G4', duration: 0.5 },
    { pitch: 'F4', duration: 0.5 },
    { pitch: 'F4', duration: 0.5 },
    { pitch: 'E4', duration: 0.5 },
    { pitch: 'E4', duration: 0.5 },
    { pitch: 'D4', duration: 1.0 },

    { pitch: 'G4', duration: 0.5 },
    { pitch: 'G4', duration: 0.5 },
    { pitch: 'F4', duration: 0.5 },
    { pitch: 'F4', duration: 0.5 },
    { pitch: 'E4', duration: 0.5 },
    { pitch: 'E4', duration: 0.5 },
    { pitch: 'D4', duration: 1.0 },

    { pitch: 'C4', duration: 0.5 },
    { pitch: 'C4', duration: 0.5 },
    { pitch: 'G4', duration: 0.5 },
    { pitch: 'G4', duration: 0.5 },
    { pitch: 'A4', duration: 0.5 },
    { pitch: 'A4', duration: 0.5 },
    { pitch: 'G4', duration: 1.0 },

    { pitch: 'F4', duration: 0.5 },
    { pitch: 'F4', duration: 0.5 },
    { pitch: 'E4', duration: 0.5 },
    { pitch: 'E4', duration: 0.5 },
    { pitch: 'D4', duration: 0.5 },
    { pitch: 'D4', duration: 0.5 },
    { pitch: 'C4', duration: 1.0 },
  ],

  baa_baa: [
    { pitch: 'C4', duration: 0.5 },
    { pitch: 'C4', duration: 0.5 },
    { pitch: 'G4', duration: 0.5 },
    { pitch: 'G4', duration: 0.5 },
    { pitch: 'A4', duration: 0.35 },
    { pitch: 'B4', duration: 0.35 },
    { pitch: 'C5', duration: 0.4 },
    { pitch: 'A4', duration: 0.4 },
    { pitch: 'G4', duration: 1.0 },

    { pitch: 'F4', duration: 0.5 },
    { pitch: 'F4', duration: 0.5 },
    { pitch: 'E4', duration: 0.5 },
    { pitch: 'E4', duration: 0.5 },
    { pitch: 'D4', duration: 0.5 },
    { pitch: 'D4', duration: 0.5 },
    { pitch: 'C4', duration: 1.0 },

    { pitch: 'G4', duration: 0.5 },
    { pitch: 'G4', duration: 0.5 },
    { pitch: 'F4', duration: 0.5 },
    { pitch: 'F4', duration: 0.5 },
    { pitch: 'E4', duration: 0.5 },
    { pitch: 'E4', duration: 0.5 },
    { pitch: 'D4', duration: 1.0 },

    { pitch: 'G4', duration: 0.4 },
    { pitch: 'G4', duration: 0.4 },
    { pitch: 'F4', duration: 0.4 },
    { pitch: 'E4', duration: 0.4 },
    { pitch: 'D4', duration: 0.5 },
    { pitch: 'D4', duration: 0.5 },
    { pitch: 'C4', duration: 1.2 },
  ],

  rain_rain: [
    { pitch: 'G4', duration: 0.6 },
    { pitch: 'E4', duration: 0.6 },
    { pitch: 'G4', duration: 0.5 },
    { pitch: 'G4', duration: 0.5 },
    { pitch: 'E4', duration: 1.0 },

    { pitch: 'A4', duration: 0.5 },
    { pitch: 'G4', duration: 0.5 },
    { pitch: 'E4', duration: 0.5 },
    { pitch: 'G4', duration: 0.5 },
    { pitch: 'A4', duration: 0.5 },
    { pitch: 'G4', duration: 0.5 },
    { pitch: 'E4', duration: 1.0 },

    { pitch: 'G4', duration: 0.5 },
    { pitch: 'G4', duration: 0.5 },
    { pitch: 'E4', duration: 0.5 },
    { pitch: 'A4', duration: 0.5 },
    { pitch: 'G4', duration: 0.5 },
    { pitch: 'E4', duration: 1.0 },

    { pitch: 'G4', duration: 0.6 },
    { pitch: 'E4', duration: 0.6 },
    { pitch: 'G4', duration: 0.5 },
    { pitch: 'G4', duration: 0.5 },
    { pitch: 'E4', duration: 1.2 },
  ],

  titli_udi: [
    { pitch: 'C4', duration: 0.45 },
    { pitch: 'E4', duration: 0.45 },
    { pitch: 'G4', duration: 0.5 },
    { pitch: 'C5', duration: 0.5 },
    { pitch: 'G4', duration: 0.45 },
    { pitch: 'E4', duration: 0.8 },

    { pitch: 'D4', duration: 0.45 },
    { pitch: 'F4', duration: 0.45 },
    { pitch: 'A4', duration: 0.5 },
    { pitch: 'D5', duration: 0.5 },
    { pitch: 'A4', duration: 0.45 },
    { pitch: 'F4', duration: 0.8 },

    { pitch: 'G4', duration: 0.45 },
    { pitch: 'B4', duration: 0.45 },
    { pitch: 'D5', duration: 0.5 },
    { pitch: 'G4', duration: 0.45 },
    { pitch: 'B4', duration: 0.45 },
    { pitch: 'D5', duration: 0.8 },

    { pitch: 'C5', duration: 0.5 },
    { pitch: 'G4', duration: 0.5 },
    { pitch: 'E4', duration: 0.5 },
    { pitch: 'C4', duration: 1.2 },
  ],

  machhli_jal: [
    { pitch: 'E4', duration: 0.5 },
    { pitch: 'G4', duration: 0.5 },
    { pitch: 'A4', duration: 0.5 },
    { pitch: 'G4', duration: 0.5 },
    { pitch: 'E4', duration: 0.5 },
    { pitch: 'D4', duration: 0.5 },
    { pitch: 'C4', duration: 1.0 },

    { pitch: 'E4', duration: 0.5 },
    { pitch: 'G4', duration: 0.5 },
    { pitch: 'A4', duration: 0.5 },
    { pitch: 'G4', duration: 0.5 },
    { pitch: 'E4', duration: 0.5 },
    { pitch: 'D4', duration: 0.5 },
    { pitch: 'C4', duration: 1.0 },

    { pitch: 'G4', duration: 0.5 },
    { pitch: 'A4', duration: 0.5 },
    { pitch: 'C5', duration: 0.5 },
    { pitch: 'A4', duration: 0.5 },
    { pitch: 'G4', duration: 0.5 },
    { pitch: 'E4', duration: 0.5 },
    { pitch: 'D4', duration: 1.0 },

    { pitch: 'E4', duration: 0.45 },
    { pitch: 'D4', duration: 0.45 },
    { pitch: 'C4', duration: 0.45 },
    { pitch: 'D4', duration: 0.45 },
    { pitch: 'E4', duration: 0.5 },
    { pitch: 'D4', duration: 0.5 },
    { pitch: 'C4', duration: 1.2 },
  ],

  chanda_mama: [
    { pitch: 'C4', duration: 0.5 },
    { pitch: 'E4', duration: 0.5 },
    { pitch: 'G4', duration: 0.6 },
    { pitch: 'E4', duration: 0.5 },
    { pitch: 'C4', duration: 0.5 },
    { pitch: 'D4', duration: 0.5 },
    { pitch: 'E4', duration: 1.0 },

    { pitch: 'D4', duration: 0.5 },
    { pitch: 'F4', duration: 0.5 },
    { pitch: 'A4', duration: 0.6 },
    { pitch: 'F4', duration: 0.5 },
    { pitch: 'D4', duration: 0.5 },
    { pitch: 'E4', duration: 0.5 },
    { pitch: 'F4', duration: 1.0 },

    { pitch: 'E4', duration: 0.5 },
    { pitch: 'G4', duration: 0.5 },
    { pitch: 'C5', duration: 0.6 },
    { pitch: 'G4', duration: 0.5 },
    { pitch: 'E4', duration: 0.5 },
    { pitch: 'F4', duration: 0.5 },
    { pitch: 'G4', duration: 1.0 },

    { pitch: 'D4', duration: 0.45 },
    { pitch: 'F4', duration: 0.45 },
    { pitch: 'A4', duration: 0.5 },
    { pitch: 'G4', duration: 0.45 },
    { pitch: 'F4', duration: 0.45 },
    { pitch: 'E4', duration: 0.5 },
    { pitch: 'D4', duration: 0.5 },
    { pitch: 'C4', duration: 1.2 },
  ],
};

class RhymeMusicPlayer {
  private ctx: AudioContext | null = null;
  private isPlaying = false;
  private timeoutIds: number[] = [];
  private masterGain: GainNode | null = null;

  private initContext() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.setValueAtTime(0.12, this.ctx.currentTime); // Gentle musical background volume
        this.masterGain.connect(this.ctx.destination);
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  playRhyme(rhymeId: string, onLoop?: () => void) {
    this.stop();
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    const notes = RHYME_MELODIES[rhymeId] || RHYME_MELODIES['twinkle'];
    this.isPlaying = true;

    let totalOffset = 0;
    notes.forEach((note) => {
      const freq = FREQUENCIES[note.pitch] || 0;
      const timeoutId = window.setTimeout(() => {
        if (!this.isPlaying || !this.ctx || !this.masterGain) return;
        if (freq > 0) {
          this.playMusicBoxNote(freq, note.duration * 0.9);
        }
      }, totalOffset * 1000);

      this.timeoutIds.push(timeoutId);
      totalOffset += note.duration;
    });

    // Schedule loop
    const loopTimeout = window.setTimeout(() => {
      if (this.isPlaying) {
        if (onLoop) onLoop();
        this.playRhyme(rhymeId, onLoop);
      }
    }, totalOffset * 1000);

    this.timeoutIds.push(loopTimeout);
  }

  private playMusicBoxNote(freq: number, duration: number) {
    if (!this.ctx || !this.masterGain) return;

    const osc = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const noteGain = this.ctx.createGain();

    // Glockenspiel / music-box sound (sine + soft triangle harmonics)
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(freq * 2, this.ctx.currentTime); // Higher overtone bell

    const now = this.ctx.currentTime;
    // Pleasant pluck attack and chime decay
    noteGain.gain.setValueAtTime(0, now);
    noteGain.gain.linearRampToValueAtTime(0.35, now + 0.02);
    noteGain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    osc.connect(noteGain);
    osc2.connect(noteGain);
    noteGain.connect(this.masterGain);

    osc.start(now);
    osc2.start(now);
    osc.stop(now + duration + 0.05);
    osc2.stop(now + duration + 0.05);
  }

  stop() {
    this.isPlaying = false;
    this.timeoutIds.forEach((id) => clearTimeout(id));
    this.timeoutIds = [];
  }
}

export const rhymeMusicPlayer = new RhymeMusicPlayer();
