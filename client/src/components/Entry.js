import { Link } from 'preact-router/match';

export default function Entry({ guid, entries }) {
  return (
    <div>
      <Link href="/">Back to home</Link>
      <div>ENTRY:</div>
      <div>{guid}</div>
      <div>ENTRIES:</div>
      <div>{JSON.stringify(entries, null, 2)}</div>
    </div>
  );
}
