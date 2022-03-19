import { ELEMENT_TEXT } from './constants';
import { scheduleRoot } from './scheduler/schedule';
import { Fiber } from './types';
import { Update, UpdateQueue } from './utils/updateQueue';

/**
 * 创建元素（虚拟DOM）的方法
 * @param {*} type  元素的类型 div span p
 * @param {*} config 配置对象 属性 key ref
 * @param  {...any} children 所有的儿子，这里整成一个数组
 * React.createElement("div", {id: "A1"},
 * React.createElement("div", {
        id: "B1"
    },B1文本,React.createElement("div", {
        id: "C1"
    },C1文本),React.createElement("div", {
        id: "C2"
    },C2文本)),React.createElement("div", {
        id: "B2"
    }));
 */

function createElement(
  type: string,
  config: Record<string, any> | null,
  ...children: (Record<string, any> | string)[]
) {
  return {
    type,
    props: {
      ...config, // 属性扩展 id，key
      children: children.map((child: Record<string, any> | string) => {
        // 兼容处理，如果是react元素返回自己，如果是文本类型，如果是一个字符串的话，返回元素对象
        // 比方说 'B1' 那么改为了 { type: Symbol(ELEMENT_TEXT), props: {text: "B1文本", children: []}}
        return typeof child === 'object'
          ? child
          : {
              type: ELEMENT_TEXT,
              props: { text: child, children: [] },
            };
      }),
    },
  };
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
    this.internalFiber!.updateQueue.enqueueUpdate(update);
    // 从根节点开始调度
    scheduleRoot();
  }
}

// 标识类组件
Component.prototype.isReactComponent = {};

export const React = {
  createElement,
  Component,
};

export default React;
