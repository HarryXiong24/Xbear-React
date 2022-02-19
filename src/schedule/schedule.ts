import { TAG_HOST, TAG_ROOT, TAG_TEXT } from '../constants';
import { Fiber } from '../types';
import updateHost from './updateHost';
import updateHostRoot from './updateHostRoot';
import updateHostText from './updateHostText';

/**
 * 从根节点开始渲染和调度
 * 两个阶段（diff + render 阶段，commit 阶段）
 * diff + render 阶段：对比新旧虚拟 DOM，进行增量更新或创建
 * 花时间长，可进行任务拆分，此阶段可暂停
 * render 阶段的成果是 effectlist 知道哪些节点更新哪些节点增加删除了
 * render 阶段两个任务：
 * 1.根据虚拟 DOM 生成 fiber 树
 * 2.收集 effectlist
 * commit阶段：进行DOM更新创建阶段，此间断不能暂停
 */

// 下一个工作单元
let nextUnitOfWork: Fiber | null = null;
// 根 Fiber，方便我们随时找到根
let workInProgress: Fiber | null = null;

export function scheduleRoot(rootFiber: Fiber) {
  workInProgress = rootFiber;
  nextUnitOfWork = rootFiber;
}

function performUnitOfWork(currentFiber: Fiber): Fiber {
  beginWork(currentFiber);
  // 然后再遍历
  if (currentFiber.child) {
    // 如果有儿子，返回大儿子
    return currentFiber.child;
  } // 然后再遍历
  // 如果没有儿子，说明此 fiber 已经完成了
  // 循环是用来控制，以防重复遍历同一个节点下的儿子和弟弟
  while (currentFiber) {
    completeUnitOfWork(currentFiber);
    // 如果说有弟弟返回弟弟
    if (currentFiber.sibling) {
      return currentFiber.sibling;
    }
    // 找父亲让父亲完成
    currentFiber = currentFiber.return!;
  }
}

/**
 * beginWork开始遍历每一个节点
 * 1.创建真实DOM元素
 * 2.创建子fiber
 * @param {*} currentFiber
 */
function beginWork(currentFiber: Fiber) {
  if (currentFiber.tag === TAG_ROOT) {
    updateHostRoot(currentFiber);
  } else if (currentFiber.tag === TAG_TEXT) {
    updateHostText(currentFiber);
  } else if (currentFiber.tag === TAG_HOST) {
    updateHost(currentFiber);
  }
}

function workLoop(IdleDeadline: any) {
  // 是否要让出时间片控制权
  let shouldYield = false;
  while (!shouldYield && nextUnitOfWork) {
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
    shouldYield = IdleDeadline.timeRemaining() < 1;
  }
  if (!nextUnitOfWork) {
    console.log('render 阶段结束');
  }
  // 每一帧都要执行这个代码
  window.requestIdleCallback(workLoop, { timeout: 500 });
}

requestIdleCallback(workLoop, { timeout: 500 });
