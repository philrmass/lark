import { all } from 'redux-saga/effects';

import artistsSagas from './artistsSagas';

export default function* rootSaga() {
  yield all([
    ...artistsSagas,
  ]);
}
