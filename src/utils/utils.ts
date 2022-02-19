import { Props } from '@/types';

export function setProps(dom: HTMLElement, oldProps: Props, newProps: Props) {
  for (const key in oldProps) {
    if (key !== 'children' && key !== 'text') {
      // eslint-disable-next-line no-prototype-builtins
      if (newProps.hasOwnProperty('key')) {
        // 新老都有更新
        setProp(dom, key, newProps[key]);
      } else {
        // 老的有新的没有删除
        dom.removeAttribute(key);
      }
    }
  }
  for (const key in newProps) {
    if (key !== 'children' && key !== 'text') {
      // eslint-disable-next-line no-prototype-builtins
      if (!oldProps.hasOwnProperty('key')) {
        // 老的没有新的有，添加
        setProp(dom, key, newProps[key]);
      }
    }
  }
}

function setProp(dom: HTMLElement, key: string, value: any) {
  // 如果是事件
  if (/^on/.test(key)) {
    dom[key.toLowerCase()] = value; // 暂时没有用合成事件
  } else if (key === 'style') {
    // 如果是样式
    if (value) {
      for (const styleName in value) {
        // eslint-disable-next-line no-prototype-builtins
        if (value.hasOwnProperty(styleName)) {
          // 更新真实 dom 里的值
          dom.style[styleName] = value[styleName];
        }
      }
    }
  } else {
    // 如果以前没有，则直接设置
    dom.setAttribute(key, value);
  }
  return dom;
}
