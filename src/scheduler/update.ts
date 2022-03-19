import { Fiber } from '@/types';
import { UpdateQueue } from '@/utils/updateQueue';
import { createDom, reconcileChildren } from './reconcile';
import { Component } from '@/react';

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

export function updateClassComponent(currentFiber: Fiber) {
  // 类组件 stateNode 是组件的实例
  if (!currentFiber.stateNode) {
    // 组件 fiber 双向指向, new ClassCounter(); 类
    currentFiber.stateNode = new (currentFiber.type as any)(
      currentFiber.props
    ) as Component;
    console.log(currentFiber.stateNode);
    currentFiber.stateNode.internalFiber = currentFiber;
    // 初始化更新队列
    currentFiber.updateQueue = new UpdateQueue();
  }

  // 给组件的实例 state 赋值
  (currentFiber.stateNode as Component).state =
    currentFiber.updateQueue.forceUpdate(
      (currentFiber.stateNode as Component).state
    );
  const newElement = (currentFiber.stateNode as Component).render();
  const newChildren = [newElement as unknown as Fiber];
  reconcileChildren(currentFiber, newChildren);
}

export function updateFunctionComponent(currentFiber: Fiber) {
  workInProgressFiber = currentFiber;
  hookIndex = 0;
  workInProgressFiber.hooks = [];
  const newChildren = [(currentFiber.type as any)(currentFiber.props)];
  reconcileChildren(currentFiber, newChildren);
}
