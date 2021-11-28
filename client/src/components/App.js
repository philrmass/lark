import { useDispatch, useSelector } from 'react-redux';

import { getArtists } from '../redux/artistsActions';
import styles from './App.module.css';

export default function App() {
  const dis = useDispatch();
  const artists = useSelector(state => state.artists.all);

  return (
    <div className={styles.app}>
      <button onClick={() => dis(getArtists())}>
        Get Artists
      </button>
      <div className={styles.data}>
        {JSON.stringify(artists, null, 2)}
      </div>
    </div>
  );
}
