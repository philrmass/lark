export function exec(cmds, queue) {
  const start = [...queue];
  const end = cmds.reduce((queue, cmd) => {
    if (cmd.type === 'add') {
      const before = queue.slice(0, cmd.index);
      const after = queue.slice(cmd.index);

      return [...before, cmd.song, ...after];
    } else if (cmd.type === 'remove') {
      if (cmd.all) {
        return [];
      }

      const before = queue.slice(0, cmd.index);
      const after = queue.slice(cmd.index + 1);

      return [...before, ...after];
    }

    return queue;
  }, start);

  return { queue: end };
}

export function areQueuesInSync(sonosQueue, queue) {
  console.log('areQueuesInSync', sonosQueue, queue);
  //??? compare result queue[x].path to local queue[y].path
  return true;
}
