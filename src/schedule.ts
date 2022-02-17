import { RootFiber } from './types';

/**
 * 从根节点开始渲染和调度
 * 两个阶段（diff + render 阶段，commit 阶段）
 * diff + render 阶段：对比新旧虚拟 DOM，进行增量更新或创建
 * 花时间长，可进行任务拆分，此阶段可暂停
 * render 阶段的成果是 effectlist 知道哪些节点更新哪些节点增加删除了
 * render 阶段两个任务：
 * 1.根据虚拟 DOM 生成 fiber 树
 * 2.收集 effectlist
 * commit阶段：进行DOM更新创建阶段，此间断不能暂停
 */
export function scheduleRoot(rootFiber: RootFiber) {
  return rootFiber;
}
