import { reconcileChildren } from '@/scheduler/reconciler';
import { scheduleRoot } from '@/scheduler/scheduler';
import { Fiber } from '@/types';
import { Update, UpdateQueue } from '@/utils/updateQueue';

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

export abstract class Component {
  public props: any;
  public isReactComponent: Record<string, any>;
  public updateQueue: UpdateQueue;
  public internalFiber: Fiber | null;
  public state: Record<string, any>;

  constructor(props: Record<string, any>) {
    this.props = props;
    this.isReactComponent = {};
    this.updateQueue = new UpdateQueue();
    this.internalFiber = null;
    this.state = {};
  }

  abstract render(): HTMLElement;

  setState(payload: Record<string, any> | ((...args: any[]) => any)) {
    const update = new Update(payload);
    (this.internalFiber as Fiber).updateQueue.enqueueUpdate(update);
    // 从根节点开始调度
    scheduleRoot();
  }
}

// 标识类组件
Component.prototype.isReactComponent = {};
