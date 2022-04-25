export function exec(cmds, queue) {

  const start = [...queue];
  const end = cmds.reduce((queue, cmd) => {
    if (cmd.type === 'add') {
      const before = queue.slice(0, cmd.index);
      const after = queue.slice(cmd.index);

      return [...before, cmd.song, ...after];
    } else if (cmd.type === 'remove') {
      const before = queue.slice(0, cmd.index);
      const after = queue.slice(cmd.index + 1);

      return [...before, ...after];
    }

    return queue;
  }, start);

  return { queue: end };
}
