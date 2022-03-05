import { GET_ARTISTS, SET_ARTISTS } from './constants';

export function getArtists() {
  return { type: GET_ARTISTS };
}

export function setArtists(all) {
  return { type: SET_ARTISTS, all };
}
