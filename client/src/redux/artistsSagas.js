import { put, takeEvery } from 'redux-saga/effects';

import { GET_ARTISTS } from './constants';
import { setArtists } from './artistsActions';

function* getArtistsSaga() {
  try {
    const isDev = true;
    const address = isDev ? 'http://192.168.1.29:4445' : '';

    const url = `${address}/artists`;
    const response = yield fetch(url);
    const artists = yield response.json() ?? [];

    yield put(setArtists(artists));
  } catch (err) {
    console.error('Error getting artists', err);
  }
}

const sagas = [
  takeEvery(GET_ARTISTS, getArtistsSaga),
];

export default sagas;
