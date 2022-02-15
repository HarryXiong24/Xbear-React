/**
 * fiber 遍历规则
 * 开始：先儿子，再弟弟，之后叔叔
 * 结束：自己没有儿子节点后视为结束
 */

import root, { vDOM } from './vDom';

function beginWork(fiber: vDOM) {
  console.log(`fiber ${fiber.key} 已开始.`);
}

function completeUnitOfWork(fiber: vDOM) {
  console.log(`fiber ${fiber.key} 已完成.`);
}

function performUnitOfWork(fiber: vDOM) {
  // 先处理此fiber
  beginWork(fiber);
  // 然后再遍历
  if (fiber.child) {
    // 如果有儿子，返回大儿子
    return fiber.child;
  }
  // 如果没有儿子，说明此 fiber 已经完成了
  // 循环是用来控制，以防重复遍历同一个节点下的儿子和弟弟
  while (fiber) {
    completeUnitOfWork(fiber);
    // 如果说有弟弟返回弟弟
    if (fiber.sibling) {
      return fiber.sibling;
    }
    fiber = fiber.return as vDOM;
  }
}

function workLoop(nextUnitOfWork: vDOM | undefined) {
  while (nextUnitOfWork) {
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
  }
  if (!nextUnitOfWork) {
    console.log('render 阶段执行完毕');
  }
}

export default function start() {
  // 下一个执行单元
  const nextUnitOfWork: vDOM | undefined = root;
  workLoop(nextUnitOfWork);
}
