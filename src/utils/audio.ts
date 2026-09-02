/**
 * Procedural Web Audio API sound designer for Drip Cosmos:
 * - Subtle ambient cosmic background drone
 * - Smooth unboxing whoosh / resonance
 * - Interactive tactile haptic clicks
 */
class SoundEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = true;
  private ambientGain: GainNode | null = null;
  private ambientOsc: OscillatorNode | null = null;
  private ambientOsc2: OscillatorNode | null = null;

  private initContext() {
    if (!this.ctx) {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioContextClass();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public toggleMute(): boolean {
    this.initContext();
    this.isMuted = !this.isMuted;
    if (!this.isMuted) {
      this.startAmbient();
    } else {
      this.stopAmbient();
    }
    return this.isMuted;
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  public startAmbient() {
    if (this.isMuted || !this.ctx) return;
    try {
      if (this.ambientOsc) return;

      const now = this.ctx.currentTime;
      this.ambientGain = this.ctx.createGain();
      this.ambientGain.gain.setValueAtTime(0.001, now);
      this.ambientGain.gain.exponentialRampToValueAtTime(0.04, now + 3);
      this.ambientGain.connect(this.ctx.destination);

      // Deep cosmic sub-drone (55Hz A1)
      this.ambientOsc = this.ctx.createOscillator();
      this.ambientOsc.type = 'sine';
      this.ambientOsc.frequency.setValueAtTime(55, now);
      this.ambientOsc.connect(this.ambientGain);
      this.ambientOsc.start();

      // Atmospheric harmonic shimmer (110Hz A2)
      this.ambientOsc2 = this.ctx.createOscillator();
      this.ambientOsc2.type = 'triangle';
      this.ambientOsc2.frequency.setValueAtTime(110.5, now);
      this.ambientOsc2.connect(this.ambientGain);
      this.ambientOsc2.start();
    } catch {
      // Audio autoplay policy fallback
    }
  }

  public stopAmbient() {
    if (!this.ambientGain || !this.ctx) return;
    const now = this.ctx.currentTime;
    this.ambientGain.gain.exponentialRampToValueAtTime(0.0001, now + 1);
    setTimeout(() => {
      this.ambientOsc?.stop();
      this.ambientOsc?.disconnect();
      this.ambientOsc = null;
      this.ambientOsc2?.stop();
      this.ambientOsc2?.disconnect();
      this.ambientOsc2 = null;
    }, 1100);
  }

  // Play subtle haptic tactile click
  public playClick() {
    if (this.isMuted || !this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, now);
      osc.frequency.exponentialRampToValueAtTime(220, now + 0.05);

      gain.gain.setValueAtTime(0.03, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.05);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.06);
    } catch {
      // ignore
    }
  }

  // Play cosmic resonance sweep for unboxing milestones
  public playUnboxMilestone() {
    if (this.isMuted || !this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(146.83, now); // D3
      osc.frequency.exponentialRampToValueAtTime(293.66, now + 0.8); // D4

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.04, now + 0.3);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.2);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 1.3);
    } catch {
      // ignore
    }
  }
}

export const sound = new SoundEngine();
