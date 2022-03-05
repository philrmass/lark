import { useSelector } from 'react-redux';

import styles from './Library.module.css';

export default function Library() {
  const artists = useSelector(state => state.artists.all);

  return (
    <div className={styles.data}>
      {JSON.stringify(artists, null, 2)}
    </div>
  );
}
