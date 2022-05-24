import { Link } from 'preact-router/match';

export default function NotFound({ url }) {
  return (
    <>
      <Link href="/">BREADCRUMBS</Link>
      <h1>The path was not found</h1>
      <div>{url}</div>
    </>
  );
}
