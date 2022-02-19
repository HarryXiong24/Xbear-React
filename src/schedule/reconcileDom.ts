import { ELEMENT_TEXT, PLACEMENT, TAG_HOST, TAG_TEXT } from '@/constants';
import { Fiber } from '@/types';
import { setProps } from '@/utils/utils';

export function reconcileChildren(currentFiber: Fiber, newChildren: Fiber[]) {
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
      if (newChildIndex === 0) {
        // 如果索引是 0，就是大儿子
        currentFiber.child = newFiber;
      } else {
        prevSibling!.sibling = newFiber; // 大儿子指向弟弟
      }
      prevSibling = newFiber;
    }
    newChildIndex++;
  }
}

export function createDom(currentFiber: Fiber) {
  if (currentFiber.tag === TAG_TEXT) {
    return document.createTextNode(currentFiber.props!.text);
  } else if (currentFiber.tag === TAG_HOST) {
    const stateNode = document.createElement(
      currentFiber.type as keyof HTMLElementTagNameMap
    );
    updateDOM(stateNode, {}, currentFiber.props);
    return stateNode;
  }
}

export function updateDOM(stateNode, oldProps, newProps) {
  setProps(stateNode, oldProps, newProps);
}
