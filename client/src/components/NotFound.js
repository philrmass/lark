import { Link } from 'preact-router/match';

export default function NotFound() {
  return (
    <div>
      <Link href="/">Back to home</Link>
      <div>That entry was not found</div>
    </div>
  );
}
