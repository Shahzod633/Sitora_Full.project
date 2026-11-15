/** One pending story action. Pauses while the page is hidden so nothing advances unseen,
 * and does not depend on requestAnimationFrame, so progression never stalls on a stuck tween. */
export class StoryTimer {
  private id?: number;
  private due = 0;
  private remaining = 0;
  private fn?: () => void;
  private held = false;

  constructor() {
    document.addEventListener('visibilitychange', this.onVisibility);
  }

  set(fn: () => void, ms: number) {
    this.clear();
    this.fn = fn;
    this.remaining = Math.max(0, ms);
    if (!document.hidden && !this.held) this.arm();
  }

  /** Reader pause: freezes the pending action with its remaining time. */
  pause() {
    if (this.held) return;
    this.held = true;
    this.suspend();
  }

  resume() {
    if (!this.held) return;
    this.held = false;
    if (this.fn && !document.hidden && this.id === undefined) this.arm();
  }

  private suspend() {
    if (this.id === undefined) return;
    window.clearTimeout(this.id);
    this.id = undefined;
    this.remaining = Math.max(0, this.due - performance.now());
  }

  /** Run the pending action now (used when the reader fast-forwards). */
  flush() {
    const fn = this.fn;
    this.clear();
    fn?.();
  }

  get pending() {
    return !!this.fn;
  }

  clear() {
    window.clearTimeout(this.id);
    this.id = undefined;
    this.fn = undefined;
  }

  dispose() {
    this.clear();
    document.removeEventListener('visibilitychange', this.onVisibility);
  }

  private arm() {
    this.due = performance.now() + this.remaining;
    this.id = window.setTimeout(() => {
      const fn = this.fn;
      this.id = undefined;
      this.fn = undefined;
      fn?.();
    }, this.remaining);
  }

  private onVisibility = () => {
    if (!this.fn) return;
    if (document.hidden) this.suspend();
    else if (this.id === undefined && !this.held) this.arm();
  };
}
