import { put, takeEvery } from 'redux-saga/effects';

import { GET_ARTISTS } from './constants';
import { setArtists } from './artistsActions';

function* getArtistsSaga() {
  try {
    yield console.warn('getArtists');
    /*
    const url = 'https://api.weather.gov/points/43.615,-84.247';
    const response = yield fetch(url);
    const json = yield response.json();

    const forecastUrl = json?.properties?.forecast;
    const forecastResponse = yield fetch(forecastUrl);
    const forecastJson = yield forecastResponse.json();

    const period = forecastJson?.properties?.periods[0];
    const forecast = period?.detailedForecast;
    */
    const artists = [];

    yield put(setArtists(artists));
  } catch (err) {
    console.error('Error getting artists', err);
  }
}

const sagas = [
  takeEvery(GET_ARTISTS, getArtistsSaga),
];

export default sagas;
