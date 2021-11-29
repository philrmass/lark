const keptLabels = [
  'APIC',
  'TALB',
  'TCOM',
  'TDAT',
  'TDRC',
  'TDRL',
  'TIME',
  'TIT2',
  'TLEN',
  'TORY',
  'TPE1',
  'TPE2',
  'TPE3',
  'TPOS',
  'TRCK',
  'TRDA',
  'TSOP',
  'TYER',
];
const ignoredLabels = [
  'COMM',
  'IPLS',
  'MCDI',
  'POPM',
  'PRIV',
  'TCMP',
  'TCON',
  'TCOP',
  'TDEN',
  'TENC',
  'TEXT',
  'TLAN',
  'TMED',
  'TPUB',
  'TSO2',
  'TSRC',
  'TSSE',
  'TSST',
  'TXXX',
  'UFID',
  'USLT',
  'WOAS',
  'WXXX',
];

export function parseMetadata(buffer) {
  const header = readHeader(new DataView(buffer, 0));
  if (!header) {
    return {};
  }

  const data = { header };
  let index = header.size;
  const end = index + header.totalSize;
  let isDone = false;

  while (!isDone) {
    let frame;
    try {
      frame = readFrame(new DataView(buffer, index));
    } catch (error) {
      frame = { size: 0 };
    }

    if (keptLabels.includes(frame.label)) {
      data[frame.label] = frame.value;
    } else if (!ignoredLabels.includes(frame.label) && (frame.size > 0)) {
      console.error(`Unknown label: [${frame.label}] = [${frame.value.slice(0, 50)}] at ${index}, size=${frame.size} end=${end}`);
    }

    index += ((frame && frame.size) ? frame.size : 0);
    if ((frame.size === 0) || ((index + frame.size) >= end)) {
      isDone = true;
    }
  }

  return data;
}

function readHeader(dv) {
  let i = 0;
  let iHead = 0;
  const size = 10;
  const header = { size, totalSize: 0 };

  while (i < dv.byteLength) {
    const val = dv.getUint8(i);
    if (iHead === 0) {
      iHead = (val === 73) ? iHead + 1 : 0;
    } else if (iHead === 1) {
      iHead = (val === 68) ? iHead + 1 : 0;
    } else if (iHead === 2) {
      iHead = (val === 51) ? iHead + 1 : 0;
    } else if (iHead === 3) {
      header.version = val;
      iHead++;
    } else if (iHead === 4) {
      header.revision = val;
      iHead++;
    } else if (iHead === 5) {
      header.flags = val;
      iHead++;
    } else if ((iHead >= 6) && (iHead <= 9)) {
      header.totalSize = (header.totalSize << 7) | (val & 0x7f);
      iHead++;
    }

    if (iHead >= size) {
      return header;
    }
    i++;
  }
  return null;
}

function readFrame(dv) {
  const headerSize = 10;
  const [label, size] = readFrameHeader(dv);

  let value = '';
  if (label === 'APIC') {
    //??? parse image
  } else {
    for (let i = 0; i < size; i++) {
      const byte = dv.getUint8(headerSize + i);
      if (isPrintable(byte)) {
        value += String.fromCharCode(byte);
      }
    }
  }

  return {
    label,
    size: (size > 0) ? headerSize + size : 0,
    value,
  };
}

function readFrameHeader(dv) {
  const headerSize = 10;
  let label = '';
  let size = 0;
  let flags = 0;
  for (let i = 0; i < headerSize; i++) {
    const value = dv.getUint8(i);
    if (i < 4) {
      label += String.fromCharCode(value);
    } else if (i < 8) {
      size = (size << 8) | value;
    } else {
      flags = (flags << 8) | value;
    }
  }
  return [label, size];
}

function isPrintable(byte) {
  return (byte >= 32) && (byte <= 126);
}
