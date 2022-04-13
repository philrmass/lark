export async function get(host, path, callback) {
  try {
    const url = `${host}${path}`;

    const response = await fetch(url);
    const data = await response.json() ?? [];

    if (data) {
      callback(data);
    }
  } catch (err) {
    console.error(`Error getting ${path}`, err);
  }
}
