import { useEffect, useRef } from 'react';

import { syncQueue } from '../utilities/actions';
import styles from './Output.module.css';

export default function Output({ devices, output, inSync, exec, setOutput }) {
  const dialogRef = useRef(null);
  const sorted = Object.values(devices).sort((a, b) => a.name < b.name ? -1 : 1);
  const local = { name: 'Local', id: undefined };
  const devicesList = [local, ...sorted];

  useEffect(() => {
    if (!inSync) {
      exec(syncQueue());
    }
  }, [inSync, exec]);

  function handleDeviceChange(e) {
    //??? change setOutput to an action
    if (e.target.value === local.id) {
      setOutput(null);
    } else {
      setOutput(devices[e.target.value]);
      exec(syncQueue());
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
