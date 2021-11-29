import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { getArtists } from '../redux/artistsActions';
import styles from './App.module.css';

import Library from './Library';

export default function App() {
  const dis = useDispatch();

  useEffect(() => {
    dis(getArtists());
  }, []);

  return (
    <div className={styles.app}>
      <Library />
    </div>
  );
}
