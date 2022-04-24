import { Link } from 'preact-router/match';

import styles from './Breadcrumbs.module.css';

export default function Breadcrumbs({ entry }) {
  const links = generateLinks(entry);

  if (!entry) {
    return null;
  }

  function buildLink(link) {
    const key = `${link.label}::${link.path}`;

    if (link.path) {
      return (
        <>
          <Link href={link.path}>{link.label}</Link>
          <span className={styles.separator}>/</span>
        </>
      );
    }

    return <span key={key} className={styles.text}>{link.label}</span>;
  }

  return (
    <>
      <div className={styles.main}>
        {links.map(link => buildLink(link))}
      </div>
      <div className={styles.bottom} />
    </>
  );
}

function generateLinks(entry) {
  const home = { label: 'Home', path: '/' };

  if (entry?.type === 'song') {
    const artist = { label: entry?.artist, path: `/artists/${entry.artistGuid}` };
    const album = { label: entry?.album, path: `/albums/${entry.albumGuid}` };
    const song = { label: entry?.title };

    return [home, artist, album, song];
  }

  if (entry?.type === 'album') {
    const artist = { label: entry?.artist, path: `/artists/${entry.artistGuid}` };
    const album = { label: entry?.title };

    return [home, artist, album];
  }

  if (entry?.type === 'artist') {
    const artist = { label: entry?.name };

    return [home, artist];
  }

  if (entry?.type === 'artists') {
    return [home];
  }

  return null;
}
