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

function eval_pro(str: string, props: string): Component {
  const template = `new ${str}(${props})`;
  const Fn = Function;
  return new Fn('return ' + template)();
}

export function updateClassComponent(currentFiber: Fiber) {
  // 类组件 stateNode 是组件的实例
  if (!currentFiber.stateNode) {
    // new ClassCounter(); 类组件 fiber 双向指向
    const className = currentFiber.type as string;
    currentFiber.stateNode = eval_pro(className, 'currentFiber.props');
    console.log(currentFiber.stateNode);
    currentFiber.stateNode.internalFiber = currentFiber;
    currentFiber.updateQueue = new UpdateQueue(); // 更新队列
  }

  // 给组件的实例state赋值
  (currentFiber.stateNode as Component).state =
    currentFiber.updateQueue.forceUpdate(currentFiber.stateNode.state);
  const newElement = currentFiber.stateNode.render();
  const newChildren = [newElement];
  reconcileChildren(currentFiber, newChildren);
}
