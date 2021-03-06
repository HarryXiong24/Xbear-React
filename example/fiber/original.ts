/**
 * fiber之前是什么样的？为什么需要fiber?
 * 之前完成任务之后，是如何遍历子节点，这种遍历是递归调用，执行栈会越来越深
 * 而且不能中断，因为中断后再想恢复就非常难了
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const root = {
  key: 'A1',
  children: [
    {
      key: 'B1',
      children: [
        { key: 'C1', children: [] },
        { key: 'C2', children: [] },
      ],
    },
    {
      key: 'B2',
      children: [],
    },
  ],
};

function doWork(vdom: any) {
  console.log(vdom.key);
}

export function walk(vdom: any) {
  doWork(vdom);
  vdom.children.forEach((child: any) => {
    walk(child);
  });
}

// walk(root);
