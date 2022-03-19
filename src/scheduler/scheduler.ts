import { updateClassComponent } from '@/classComponent';
import { updateFunctionComponent } from '@/hooks/useReducer';
import {
  DELETION,
  ELEMENT_TEXT,
  PLACEMENT,
  TAG_CLASS,
  TAG_FUNCTION_COMPONENT,
  TAG_HOST,
  TAG_ROOT,
  TAG_TEXT,
  UPDATE,
} from '../constants';
import { Fiber, Props } from '../types';
import { commitDeletion, updateDOM } from './reconciler';
import { updateHost, updateHostRoot, updateHostText } from './updater';

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
export let nextUnitOfWork: Fiber | null = null;
// 根 Fiber，方便我们随时找到根
export let workInProgressRoot: Fiber | null = null;
// 渲染成功后的当前根 rootFiber
export let currentRoot: Fiber | null = null;
// 删除的节点不放在 effect list 要单独记录并执行
export const deletions: Fiber[] = [];

export function scheduleRoot(rootFiber?: Fiber) {
  if (currentRoot && currentRoot.alternate) {
    // 这就是第二次之后渲染，不能每次都创建树，如起始时可以把第一个树赋给第三个
    workInProgressRoot = currentRoot.alternate;
    // 他的替身指向当前树
    workInProgressRoot.alternate = currentRoot;
    // 类组件创建的时候，可以没有 rootFiber
    if (rootFiber) {
      // 让他的 props 更新成新的 props
      workInProgressRoot.props = rootFiber.props;
    }
  } else if (currentRoot) {
    // 说明已经渲染过一次了，此时就要拷贝一份为以后渲染做准备
    if (rootFiber) {
      rootFiber.alternate = currentRoot;
      workInProgressRoot = rootFiber;
    } else {
      workInProgressRoot = {
        ...currentRoot,
        alternate: currentRoot,
      };
    }
  } else {
    // 第一次渲染
    workInProgressRoot = rootFiber!;
  }
  // 清空指针
  workInProgressRoot.firstEffect =
    workInProgressRoot.lastEffect =
    workInProgressRoot.nextEffect =
      null;
  nextUnitOfWork = workInProgressRoot;
}

function performUnitOfWork(currentFiber: Fiber): Fiber | undefined {
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
    // 如果是根 Fiber
    updateHostRoot(currentFiber);
  } else if (currentFiber.tag === TAG_TEXT) {
    // 如果是文本 Fiber
    updateHostText(currentFiber);
  } else if (currentFiber.tag === TAG_HOST) {
    // 如果是原生非文本 Fiber
    updateHost(currentFiber);
  } else if (currentFiber.tag === TAG_CLASS) {
    updateClassComponent(currentFiber);
  } else if (currentFiber.tag === TAG_FUNCTION_COMPONENT) {
    updateFunctionComponent(currentFiber);
  }
}

/**
 * 在完成时收集副作用组成 effect list
 * 每个 fiber 有两个属性 firstEffect 指向第一个有副作用的子 fiber
 * lastEffect 指向最后一个有副作用的子 fiber，中间用 nextEffect 做成单链表
 * @param {*} currentFiber
 */
function completeUnitOfWork(currentFiber: Fiber) {
  const returnFiber = currentFiber.return;
  if (returnFiber) {
    // 把自己儿子的 effect 链挂到父亲身上
    if (!returnFiber.firstEffect) {
      returnFiber.firstEffect = currentFiber.firstEffect;
    }
    if (currentFiber.lastEffect) {
      if (returnFiber.lastEffect) {
        returnFiber.lastEffect.nextEffect = currentFiber.firstEffect;
      }
      returnFiber.lastEffect = currentFiber.lastEffect;
    }
    // 把自己的 effect 链挂到父亲身上
    const effectTag = currentFiber.effectTag;
    if (effectTag) {
      // 如果有副作用，（第一次时肯定有，新增默认PLACEMENT）
      if (returnFiber.lastEffect) {
        // 让儿子的 nextEffect 的元素指向自己
        returnFiber.lastEffect.nextEffect = currentFiber;
      } else {
        // 第一次的时候，父亲的 firstEffect 和 lastEffect 都指向第一个完成的儿子
        returnFiber.firstEffect = currentFiber;
      }
      returnFiber.lastEffect = currentFiber;
    }
  }
}

function workLoop(IdleDeadline: any) {
  // 是否要让出时间片控制权
  let shouldYield = false;
  while (!shouldYield && nextUnitOfWork) {
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork)!;
    // IdleDeadline.timeRemaining() < 1 则让出时间片控制权
    shouldYield = IdleDeadline.timeRemaining() < 1;
  }
  if (!nextUnitOfWork && workInProgressRoot) {
    commitRoot();
    console.log('render 阶段结束');
  }
  // 每一帧都要执行这个代码
  window.requestIdleCallback(workLoop, { timeout: 500 });
}

function commitRoot() {
  // 执行 effect list 之前先把该删除的元素删除
  deletions.forEach(commitWork);
  // 取出第一个结束的结点
  let currentFiber = workInProgressRoot!.firstEffect;
  while (currentFiber) {
    // 依次提交, 通过循环把每一个字节点挂到父节点上并渲染
    commitWork(currentFiber);
    currentFiber = currentFiber.nextEffect;
  }
  // 提交后清空deletions数组
  deletions.length = 0;
  // 把当前渲染成功的根 fiber 赋给 currentRoot
  currentRoot = workInProgressRoot;
  workInProgressRoot = null;
}

function commitWork(currentFiber: Fiber) {
  if (!currentFiber) {
    return;
  }
  let returnFiber = currentFiber.return;
  while (
    returnFiber!.tag !== TAG_HOST &&
    returnFiber!.tag !== TAG_ROOT &&
    returnFiber!.tag !== TAG_TEXT
  ) {
    returnFiber = returnFiber!.return;
  }
  const returnDom = returnFiber!.stateNode;
  console.log(currentFiber);
  if (currentFiber.effectTag === PLACEMENT) {
    let nextFiber = currentFiber;
    if (nextFiber.tag === TAG_CLASS) {
      return;
    }
    // 如果要挂载的节点不是 dom 节点，比如说是类组件 fiber，一直找第一个儿子，直到找到真实DOM
    while (nextFiber.tag !== TAG_HOST && nextFiber.tag !== TAG_TEXT) {
      nextFiber = currentFiber.child as Fiber;
    }
    (returnDom as HTMLElement | Text).appendChild(nextFiber.stateNode as Node);
  } else if (currentFiber.effectTag === DELETION) {
    // 删除节点
    return commitDeletion(currentFiber, returnDom! as HTMLElement | Text);
  } else if (currentFiber.effectTag === UPDATE) {
    // 更新节点
    if (currentFiber.type === ELEMENT_TEXT) {
      // 拿老节点的文本节点和新节点的文本节点做比较，如有不同则更新
      if (currentFiber.alternate?.props?.text !== currentFiber.props?.text) {
        (currentFiber.stateNode! as Text).textContent =
          currentFiber.props!.text!;
      }
    } else {
      updateDOM(
        currentFiber.stateNode as HTMLElement,
        currentFiber.alternate!.props as Props,
        currentFiber.props!
      );
    }
  }
  currentFiber.effectTag = null;
}

window.requestIdleCallback(workLoop, { timeout: 500 });
