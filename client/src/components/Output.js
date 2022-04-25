import { useRef } from 'react';
import styles from './Output.module.css';

export default function Output({ devices, output, setOutput }) {
  const dialogRef = useRef(null);
  const sorted = Object.values(devices).sort((a, b) => a.name < b.name ? -1 : 1);
  const local = { name: 'Local', id: undefined };
  const devicesList = [local, ...sorted];

  function handleDeviceChange(e) {
    //??? change setOutput to an action
    //??? sync queue after device is set
    if (e.target.value === local.id) {
      setOutput(null);
    } else {
      setOutput(devices[e.target.value]);
    }
    dialogRef.current.close();
  }

  function buildDialog() {
    return (
      <dialog ref={dialogRef} className={styles.dialog}>
        <div onChange={handleDeviceChange}>
          {devicesList.map((device) => (
            <label key={device.id} className={styles.label}>
              <input
                type="radio"
                name="device"
                clssName={styles.radio}
                value={device.id}
                checked={output?.id === device.id}
              />
              <span className={styles.name}>{device.name}</span>
            </label>
          ))}
        </div>
      </dialog>
    );
  }

  return (
    <div className={styles.output}>
      <button className='button' onClick={() => dialogRef.current.showModal()}>
        {output ? output?.name : 'Local'}
      </button>
      {buildDialog()}
    </div>
  );
}
