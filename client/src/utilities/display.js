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
  const minPerHr = 60;

  const totalMin = Math.floor(totalSec / secPerMin);
  const hr = Math.floor(totalMin / minPerHr);
  const min = totalMin - (hr * minPerHr);
  const sec = totalSec - (totalMin * secPerMin);

  const minStr = min.toFixed(0).padStart(2, '0');
  const secStr = sec.toFixed(0).padStart(2, '0');

  if (hr > 0) {
    return `${hr}:${minStr}:${secStr}`;
  }
  return `${minStr}:${secStr}`;
}
