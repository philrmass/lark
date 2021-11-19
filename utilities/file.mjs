import { promises as fs } from 'fs';

export async function saveData(path, data) {
  let json;

  try {
    json = JSON.stringify(data);
  } catch (err) {
    console.error(`JSON.stringify [${err}]`);
    return;
  }

  try {
    await fs.writeFile(path, json);
  } catch (err) {
    console.error(`writeFile [${err}]`);
  }
}

export async function loadData(path) {
  let json;

  try {
    json = await fs.readFile(path);
  } catch (err) {
    if (err.code !== 'ENOENT') {
      console.error(`readFile [${err}]`);
    }
    return;
  }

  if (!json) {
    return;
  }

  try {
    return JSON.parse(json);
  } catch (err) {
    console.error(`JSON.parse [${err}]`);
  }
}
