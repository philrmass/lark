import { useEffect, useState } from 'react';

const mock = { getItem: () => {}, setItem: () => {} };
const localStorage = typeof window !== 'undefined' ? window.localStorage : mock; 

export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    const stored = localStorage?.getItem(key);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (err) {
        console.error('localStorage error:', key, stored, err); //eslint-disable-line no-console
      }
    }
    localStorage?.setItem(key, JSON.stringify(initialValue));
    return initialValue;
  });

  useEffect(() => {
    localStorage?.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
}

export function setObject(key, value) {
  localStorage[key] = JSON.stringify(value);
}

export function getObject(key, defaultValue) {
  const value = localStorage[key];

  if (!value) {
    return defaultValue;
  }

  try {
    return JSON.parse(value);
  } catch (error) {
    return defaultValue;
  }
}
