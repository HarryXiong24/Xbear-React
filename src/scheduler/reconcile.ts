import {
  DELETION,
  ELEMENT_TEXT,
  PLACEMENT,
  TAG_CLASS,
  TAG_FUNCTION_COMPONENT,
  TAG_HOST,
  TAG_TEXT,
  UPDATE,
} from '@/constants';
import {
  TAG_TEXT_TYPE,
  TAG_HOST_TYPE,
  Fiber,
  Props,
  TAG_FUNCTION_COMPONENT_TYPE,
  TAG_CLASS_TYPE,
  TAG_ROOT_TYPE,
} from '@/types';
import { UpdateQueue } from '@/utils/updateQueue';
import { setProps } from '@/utils/setProps';
import { deletions } from './schedule';

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
  // 如果说当前的 currentFiber 有 alternate 属性，并且 alternate 有 child 属性
  let oldFiber: Fiber | null =
    currentFiber.alternate! && currentFiber.alternate.child!;
  if (oldFiber) {
    oldFiber.firstEffect = oldFiber.lastEffect = oldFiber.nextEffect = null;
  }
  // 遍历我们子虚拟 DOM 元素数组，为每一个虚拟 DOM 创建子 Fiber
  while (newChildIndex < newChildren.length || oldFiber) {
    // 取出虚拟 DOM 节点
    const newChild = newChildren[newChildIndex];
    // 新的 Fiber
    let newFiber: Fiber | null = null;
    const sameType = oldFiber && newChild && oldFiber.type === newChild.type;

    let tag:
      | TAG_ROOT_TYPE
      | TAG_TEXT_TYPE
      | TAG_HOST_TYPE
      | TAG_FUNCTION_COMPONENT_TYPE
      | TAG_CLASS_TYPE = TAG_HOST;
    if (
      newChild &&
      typeof newChild.type == 'function' &&
      (newChild.type as any).prototype.isReactComponent
    ) {
      tag = TAG_CLASS;
    } else if (newChild && typeof newChild.type == 'function') {
      tag = TAG_FUNCTION_COMPONENT;
    } else if (newChild && newChild.type == ELEMENT_TEXT) {
      tag = TAG_TEXT;
    } else if (newChild && typeof newChild.type === 'string') {
      tag = TAG_HOST; // 如果type是字符串，那么这是一个原生DOM节点div
    }

    if (sameType) {
      // 说明老 fiber 和新虚拟 DOM 类型一样，可以复用，更新即可
      if (oldFiber.alternate) {
        // 至少已经更新一次了
        newFiber = oldFiber.alternate;
        newFiber.props = newChild.props;
        newFiber.alternate = oldFiber;
        newFiber.effectTag = UPDATE;
        newFiber.updateQueue = oldFiber.updateQueue || new UpdateQueue();
        newFiber.nextEffect = null;
      } else {
        newFiber = {
          tag: oldFiber.tag,
          type: oldFiber.type,
          props: newChild.props, //一定要新的
          stateNode: oldFiber.stateNode, // div还没有创建DOM元素
          updateQueue: oldFiber.updateQueue || new UpdateQueue(),
          return: currentFiber, // 父Fiber returnFiber
          alternate: oldFiber, // 让新的fiber的alternate指向老的fiber
          effectTag: UPDATE, // 副作用标示，render会收集副作用 增加 删除 更新
          nextEffect: null, // effect list也是一个单链表 顺序和完成顺序一样 节点可能会少
        };
      }
    } else {
      // 看看新的 DOM 节点可有 child（有可能是null）
      if (newChild) {
        newFiber = {
          tag,
          type: newChild.type,
          props: newChild.props,
          stateNode: null, // div还没有创建DOM元素
          return: currentFiber, // 父Fiber returnFiber
          updateQueue: new UpdateQueue(),
          effectTag: PLACEMENT, // 副作用标示，render 会收集副作用 增加 删除 更新
          nextEffect: null, // effect list也是一个单链表 顺序和完成顺序一样 节点可能会少
        };
      }

      // 类型不一样，把老的删掉
      if (oldFiber) {
        oldFiber.effectTag = DELETION;
        deletions.push(oldFiber);
      }
    }

    if (oldFiber) {
      oldFiber = oldFiber.sibling!; // oldFiber 指针也向后移动一次,为了保持与下次对比
    }

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

export function commitDeletion(
  currentFiber: Fiber,
  returnDom: HTMLElement | Text
) {
  if (currentFiber.tag == TAG_HOST || currentFiber.tag == TAG_TEXT) {
    returnDom.removeChild(currentFiber.stateNode as Node);
  } else {
    commitDeletion(currentFiber.child!, returnDom);
  }
}
