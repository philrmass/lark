import { combineReducers } from 'redux';

import artistsReducer from './artistsReducer';

const rootReducer = combineReducers({
  artists: artistsReducer,
});

export default rootReducer;
