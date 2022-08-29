/** Drift runtime environment. This namespace is only available when running Chrome via the Drift command line */
declare var Drift: {
  /** Command line arguments */
  args: string[]
  /** Add style to current page */
  css(path: string): void
  /** Send mousedown event current page */
  click(x: number, y: number): void
  /** Close drift with optional exit code */
  close(exitcode?: number): never
  /** Set desktop window position */
  position(x: number, y: number): void
  /** Reload the current page */
  reload(): void
  /** Run script on current page */
  run(path: string): void
  /** Set desktop window size */
  size(w: number, h: number): void
  /** Save current page as png, jpeg or pdf format */
  save(path: string): void
  /** Navigate page to url endpoint */
  url(url: string): void
  /** Wait for milliseconds to elapse */
  wait(ms: number): Promise<void>
}
