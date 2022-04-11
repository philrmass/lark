export function toKbps(bps) {
  const bytesPerKb = 1024;
  return Math.round(bps / bytesPerKb);
}

export function toMb(bytes) {
  const bytesPerMb = 1024 * 1024;
  return (bytes / bytesPerMb).toFixed(3);
}

export function toTime(totalSec) {
  const secPerMin = 60;
  const min = Math.floor(totalSec / secPerMin);
  const sec = totalSec - (min * secPerMin);
  const secStr = sec.toFixed(0).padStart(2, '0');
  return `${min}:${secStr}`;
}
