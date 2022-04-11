import Album from './Album';
import Artist from './Artist';
import Song from './Song';
import NotFound from './NotFound';

export default function Entry({ guid, entries, execute }) {
  const entry = entries[guid];

  if (entry?.type === 'artist') {
    return <Artist entry={entry} entries={entries} />;
  } else if (entry?.type === 'album') {
    return <Album entry={entry} entries={entries} />;
  } else if (entry?.type === 'song') {
    return <Song entry={entry} execute={execute} />;
  }

  return <NotFound data={entry} />;
}
