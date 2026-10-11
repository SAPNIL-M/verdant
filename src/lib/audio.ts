/**
 * Web Audio API Synthesizer for Verdant
 * Produces organic Tibetan singing bowl & meditation bell harmonics
 * without external audio file dependencies.
 */

class ChimeEngine {
  private ctx: AudioContext | null = null;
  public enabled: boolean = true;

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  /**
   * Plays a resonant harmonic meditation bell chime (528 Hz + overtones)
   */
  public playZenChime(type: 'start' | 'tick' | 'complete' = 'start') {
    if (!this.enabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;

    const baseFreq = type === 'complete' ? 660 : type === 'tick' ? 440 : 528;
    const duration = type === 'tick' ? 0.8 : type === 'complete' ? 4.5 : 3.5;

    // Harmonic ratios for singing bowl acoustics
    const harmonics = [1, 2.76, 5.4, 8.9];
    const gains = [0.25, 0.12, 0.06, 0.02];

    harmonics.forEach((ratio, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(baseFreq * ratio, now);

      // Subtle pitch bend for physical bowl feel
      osc.frequency.exponentialRampToValueAtTime(baseFreq * ratio * 0.995, now + duration);

      // Smooth attack and long organic exponential decay
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.exponentialRampToValueAtTime(gains[i], now + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + duration);
    });
  }
}

export const chime = new ChimeEngine();
