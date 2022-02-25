import { TAG_ROOT } from '@/constants';
import { scheduleRoot } from './schedule';
import { Fiber } from '@/types';
/**
 * render 是要把一个元素渲染到一个容器内部
 * @param {*} element 元素
 * @param {*} container 容器
 */
function render(element: Fiber, container: HTMLElement) {
  const rootFiber: Fiber = {
    // 每个 Fiber 会有一个 tag 标示此元素类型
    tag: TAG_ROOT,
    // 一般情况下如果这个元素是一个原生节点的话，stateNode 指向真实 DOM 元素
    stateNode: container,
    // 这个 Fiber 的属性对象 children 属性，里面放的是要渲染的元素
    // props.children 是一个数组，里面存放 React 元素（虚拟 DOM）
    // 后面会根据每个 React 元素创建对应的 Fiber
    props: { children: [element] },
  };
  scheduleRoot(rootFiber);
}

export const ReactDOM = {
  render,
};

export default ReactDOM;
