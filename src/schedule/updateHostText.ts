import { Fiber } from '@/types';
import { createDom } from './reconcileDom';

export function updateHostText(currentFiber: Fiber) {
  if (!currentFiber.stateNode) {
    //如果此fiber没有创建DOM节点
    currentFiber.stateNode = createDom(currentFiber);
  }
}

export default updateHostText;
