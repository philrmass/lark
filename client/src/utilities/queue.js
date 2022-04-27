export function exec(cmds, queue) {
  const used = ['add', 'remove'];
  const filtered = cmds.filter(cmd => used.includes(cmd.type));

  if (filtered.length > 0) {
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

  return {};
}

export function areQueuesInSync(sonosQueue, queue) {
  console.log('areQueuesInSync(', sonosQueue, ',', queue, ')');
  //??? compare result queue[x].path to local queue[y].path
  return true;
}
