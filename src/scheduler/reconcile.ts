import { ELEMENT_TEXT, PLACEMENT, TAG_HOST, TAG_TEXT } from '@/constants';
import { TAG_TEXT_TYPE, TAG_HOST_TYPE, Fiber, Props } from '@/types';
import { setProps } from '@/utils/utils';

/**
 * 将 children 初始化成 Fiber
 * @param currentFiber 当前的 Fiber
 * @param newChildren 需要初始化成 Fiber 的 children
 */
export function reconcileChildren(currentFiber: Fiber, newChildren: Fiber[]) {
  // 新子节点的索引
  let newChildIndex = 0;
  // 上一个新的子 fiber
  let prevSibling: Fiber | null = null;
  // 遍历我们子虚拟 DOM 元素数组，为每一个虚拟 DOM 创建子 Fiber
  while (newChildIndex < newChildren.length) {
    // 取出虚拟 DOM 节点
    const newChild = newChildren[newChildIndex];
    let tag: TAG_TEXT_TYPE | TAG_HOST_TYPE = TAG_HOST;
    if (newChild.type == ELEMENT_TEXT) {
      tag = TAG_TEXT;
    } else if (typeof newChild.type === 'string') {
      // 如果 type 是字符串，那么这是一个原生 DOM 节点
      tag = TAG_HOST;
    }
    const newFiber: Fiber = {
      tag,
      type: newChild.type,
      props: newChild.props,
      stateNode: null, // 此时新节点还没有挂载的 DOM 元素
      return: currentFiber, // 父 Fiber, returnFiber
      effectTag: PLACEMENT, // 副作用标示，render 会收集副作用 增加 删除 更新
      nextEffect: null, // effect list 是一个单链表，顺序和完成顺序一样，节点可能会少，因为只保存有 effectTag 的 Fiber
    };
    // 每一个 fiber 与 currentFiber 建立联系
    if (newFiber) {
      if (newChildIndex === 0) {
        // 如果索引是 0，就是大儿子
        currentFiber.child = newFiber;
      } else {
        (prevSibling as Fiber).sibling = newFiber; // 大儿子指向弟弟
      }
      // 保存上一个 fiber，用来确保之后建立弟弟关系
      prevSibling = newFiber;
    }
    newChildIndex++;
  }
}

// 根据 Fiber 创建真实的 DOM 节点
export function createDom(currentFiber: Fiber) {
  if (currentFiber.tag === TAG_TEXT) {
    // 如果是文本节点，直接创建真实的文本节点 DOM，该真实节点即为绑定的真实节点
    return document.createTextNode(currentFiber.props!.text!);
  } else if (currentFiber.tag === TAG_HOST) {
    // 如果是原生非文本节点，创建该真实节点，该真实节点即为绑定的真实节点
    const stateNode = document.createElement(
      currentFiber.type as keyof HTMLElementTagNameMap
    );
    // 把该 currentFiber 虚拟 DOM 的参数赋给创建的真实节点
    updateDOM(stateNode, {}, currentFiber.props!);
    // 返回绑定的真实节点
    return stateNode;
  }
}

export function updateDOM(
  stateNode: HTMLElement,
  oldProps: Props,
  newProps: Props
) {
  setProps(stateNode, oldProps, newProps);
}
