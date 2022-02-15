// react 中每个虚拟 Dom 节点内部表示一个 Fiber，使用链表连接每个虚拟 Dom

export interface vDOM {
  type: string;
  key: string;
  child?: vDOM;
  sibling?: vDOM;
  return?: vDOM;
}

// 下面表示这个数据结构
// const root = {
//   key: 'A1',
//   children: [
//     {
//       key: 'B1',
//       children: [
//         { key: 'C1', children: [] },
//         { key: 'C2', children: [] },
//       ],
//     },
//     {
//       key: 'B2',
//       children: [],
//     },
//   ],
// };

const A1: vDOM = { type: 'div', key: 'A1' };
const B1: vDOM = { type: 'div', key: 'B1', return: A1 };
const B2: vDOM = { type: 'div', key: 'B2', return: A1 };
const C1: vDOM = { type: 'div', key: 'C1', return: B1 };
const C2: vDOM = { type: 'div', key: 'C2', return: B1 };
A1.child = B1;
B1.sibling = B2;
B1.child = C1;
C1.sibling = C2;

export default A1;
