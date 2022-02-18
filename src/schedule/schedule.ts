import {
  ELEMENT_TEXT,
  PLACEMENT,
  TAG_HOST,
  TAG_ROOT,
  TAG_TEXT,
} from '../constants';
import { Fiber } from '../types';

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
  }
  // else if (currentFiber.tag === TAG_TEXT) {
  //   updateHostText(currentFiber);
  // } else if (currentFiber.tag === TAG_HOST) {
  //   updateHost(currentFiber);
  // }
}

function updateHostRoot(currentFiber: Fiber) {
  // 先处理自己如果是一个原生节点:
  // 1.创建真实DOM
  // 2.创建子fiber
  const newChildren = currentFiber.props!.children; //[element]
  reconcileChildren(currentFiber, newChildren); //reconcile协调
}

function reconcileChildren(currentFiber: Fiber, newChildren: Fiber[]) {
  // 新子节点的索引
  let newChildIndex = 0;
  // 上一个新的子fiber
  let prevSibling: Fiber | null = null;
  // 遍历我们子虚拟DOM元素数组，为每一个虚拟DOM创建子Fiber
  while (newChildIndex < newChildren.length) {
    const newChild = newChildren[newChildIndex]; // 取出虚拟DOM节点
    let tag;
    if (newChild.type == ELEMENT_TEXT) {
      tag = TAG_TEXT;
    } else if (typeof newChild.type === 'string') {
      tag = TAG_HOST; // 如果type是字符串，那么这是一个原生DOM节点div
    }
    const newFiber: Fiber = {
      tag,
      type: newChild.type,
      props: newChild.props,
      stateNode: null, // div还没有创建DOM元素
      return: currentFiber, // 父Fiber returnFiber
      effectTag: PLACEMENT, // 副作用标示，render会收集副作用 增加 删除 更新
      nextEffect: null, // effect list也是一个单链表 顺序和完成顺序一样 节点可能会少
    };

    if (newFiber) {
      if (newChildIndex == 0) {
        // 如果索引是0，就是大儿子
        currentFiber.child = newFiber;
      } else {
        prevSibling!.sibling = newFiber; // 大儿子指向弟弟
      }
      prevSibling = newFiber;
    }
    newChildIndex++;
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
