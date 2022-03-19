import { reconcileChildren } from '@/scheduler/reconciler';
import { scheduleRoot } from '@/scheduler/scheduler';
import { Fiber } from '@/types';
import { Update, UpdateQueue } from '@/utils/updateQueue';

// 正在工作中的 fiber
export let workInProgressFiber: Fiber | null = null;
// hooks 索引
export let hookIndex = 0;

export function updateFunctionComponent(currentFiber: Fiber) {
  workInProgressFiber = currentFiber;
  hookIndex = 0;
  workInProgressFiber.hooks = [];
  const newChildren = [(currentFiber.type as any)(currentFiber.props)];
  reconcileChildren(currentFiber, newChildren);
}

export function useReducer(reducer, initialValue) {
  const oldHook =
    workInProgressFiber!.alternate &&
    workInProgressFiber!.alternate.hooks &&
    workInProgressFiber!.alternate.hooks[hookIndex];
  let newHook: any = oldHook;
  if (oldHook) {
    // 第二次渲染
    oldHook.state = oldHook.updateQueue.forceUpdate(oldHook.state);
  } else {
    // 第一次渲染，newHook 没有值的时候
    newHook = {
      state: initialValue,
      updateQueue: new UpdateQueue(), // 空的更新队列
    };
  }
  const dispatch = (action) => {
    // { type:'ADD' }
    const payload = reducer ? reducer(newHook.state, action) : action;
    newHook.updateQueue.enqueueUpdate(new Update(payload));
    scheduleRoot();
  };
  workInProgressFiber!.hooks![hookIndex++] = newHook;
  return [newHook.state, dispatch];
}
