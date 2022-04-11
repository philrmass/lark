import { Link } from 'preact-router/match';

export default function NotFound({ data }) {
  return (
    <div>
      <Link href="/">Back to home</Link>
      <div>That entry was not found</div>
      <div className='json'>{JSON.stringify(data, null, 2)}</div>
    </div>
  );
}
