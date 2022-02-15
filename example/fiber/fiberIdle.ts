/**
 * fiber 遍历规则
 * 开始：先儿子，再弟弟，之后叔叔
 * 结束：自己没有儿子节点后视为结束
 */

// 此为加入了 requestIdleCallback 的 fiber 遍历
import root, { vDOM } from './vDom';
import sleep from './sleep';

function beginWork(fiber: vDOM) {
  sleep(20);
  console.log(`fiber ${fiber.key} 已开始.`);
}

function completeUnitOfWork(fiber: vDOM) {
  console.log(`fiber ${fiber.key} 已完成.`);
}

function performUnitOfWork(fiber: vDOM) {
  // 先处理此fiberS
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

export default function start() {
  // 标志下一个执行单元
  let nextUnitOfWork: vDOM | undefined = root;
  // 记录时间
  const startTime = Date.now();

  function workLoop(IdleDeadline: any) {
    console.log(`本帧的剩余时间为${parseInt(IdleDeadline.timeRemaining())}`);
    while (
      (IdleDeadline.timeRemaining() > 0 || IdleDeadline.didTimeout) &&
      nextUnitOfWork
    ) {
      nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
    }
    if (!nextUnitOfWork) {
      console.log('render 阶段执行完毕');
      console.log(`耗时 ${Date.now() - startTime}`);
    } else {
      // 请求下次浏览器空闲的时候调用
      requestIdleCallback(workLoop, { timeout: 1000 });
    }
  }

  requestIdleCallback(workLoop, {
    timeout: 1000,
  });
}
