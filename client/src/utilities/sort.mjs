export function byName(a, b) {
  if (a.name) {
    return a.name.localeCompare(b.name);
  } else if (b.name) {
    return -b.name.localeCompare(a.name);
  }
  return 0;
}

export function byDateTitle(a, b) {
  if (a.date) {
    return a.date.localeCompare(b.date);
  } else if (b.date) {
    return -b.date.localeCompare(a.date);
  } else if(a.title) {
    return a.title.localeCompare(b.title);
  } else if(b.title) {
    return -b.title.localeCompare(a.title);
  }
  return 0;
}
