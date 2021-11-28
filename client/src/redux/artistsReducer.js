import { SET_ARTISTS } from './constants';

const defaultState = {
  all: [],
};

export default function reducer(state = defaultState, action) {
  switch (action.type) {
    case SET_ARTISTS: 
      return {
        ...state,
        all: action.all,
      };
    default:
      return state;
  }
}
