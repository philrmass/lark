import styles from './Output.module.css';

export default function Output({ devices, output, setOutput }) {
  function pickOutput() {
    const name = 'Kitchen';
    //const name = 'Living Room';
    //const name = 'Desk';
    const device = output ? null : Object.values(devices).find(d => d.name === name);
    console.log('DEV', device?.ipAddress);
    setOutput(device);
  }

  return (
    <div className={styles.output}>
      <button onClick={() => pickOutput()}>
        {output ? output?.name : 'Local'}
      </button>
    </div>
  );
}
