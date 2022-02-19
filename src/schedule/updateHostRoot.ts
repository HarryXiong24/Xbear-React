import { Fiber } from '@/types';
import { reconcileChildren } from './reconcileDom';

export function updateHostRoot(currentFiber: Fiber) {
  // 先处理自己如果是一个原生节点:
  // 1.创建真实DOM
  // 2.创建子fiber
  const newChildren = currentFiber.props!.children; //[element]
  reconcileChildren(currentFiber, newChildren); //reconcile协调
}

export default updateHostRoot;
