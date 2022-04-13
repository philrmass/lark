//import styles from './Output.module.css';

export default function Output({ devices, output, setOutput }) {
  return (
    <button onClick={() => setOutput(v => v ? null : {})}>
      {output ? `Sonos (${Object.keys(devices).length})` : 'Local'}
    </button>
  );
}
