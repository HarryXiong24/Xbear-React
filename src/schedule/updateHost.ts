import { Fiber } from '@/types';
import { createDom, reconcileChildren } from './reconcileDom';

export function updateHost(currentFiber: Fiber) {
  if (!currentFiber.stateNode) {
    //如果此fiber没有创建DOM节点
    currentFiber.stateNode = createDom(currentFiber)!;
  }
  const newChildren = currentFiber.props!.children;
  reconcileChildren(currentFiber, newChildren);
}

export default updateHost;
