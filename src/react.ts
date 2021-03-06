import { Component } from './classComponent';
import { ELEMENT_TEXT } from './constants';
import { useReducer } from './hooks/useReducer';
import { useState } from './hooks/useState';

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

export const React = {
  createElement,
  Component,
  useReducer,
  useState,
};

export { useState } from './hooks/useState';
export { useReducer } from './hooks/useReducer';
export { Component } from './classComponent';

export default React;
