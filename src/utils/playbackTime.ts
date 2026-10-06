export function formatPlaybackTime(seconds: number, duration: number) {
  const time = Number.isFinite(seconds) ? Math.max(0, seconds) : 0
  const hundredths = Math.floor(time * 100 + 1e-7)
  const wholeSeconds = Math.floor(hundredths / 100)
  const label = `${Math.floor(wholeSeconds / 60)}:${String(wholeSeconds % 60).padStart(2, '0')}`
  // Sub-second samples need visible fractions; long tracks keep familiar m:ss labels.
  return duration > 0 && duration < 10
    ? `${label}.${String(hundredths % 100).padStart(2, '0')}`
    : label
}
