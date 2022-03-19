import { Fiber } from '@/types';
import { createDom, reconcileChildren } from './reconciler';

// 将根 fiber 里的 children 创建出子 fiber
export function updateHostRoot(currentFiber: Fiber) {
  const newChildren = currentFiber.props!.children; //[element]
  reconcileChildren(currentFiber, newChildren!); //reconcile协调
}

export function updateHostText(currentFiber: Fiber) {
  if (!currentFiber.stateNode) {
    // 如果此 fiber 没有创建 DOM 节点，创建出 DOM 节点
    currentFiber.stateNode = createDom(currentFiber);
  }
}

export function updateHost(currentFiber: Fiber) {
  if (!currentFiber.stateNode) {
    // 如果此 fiber 没有创建 DOM 节点，创建出 DOM 节点
    currentFiber.stateNode = createDom(currentFiber)!;
  }
  const newChildren = currentFiber.props!.children;
  reconcileChildren(currentFiber, newChildren!);
}
