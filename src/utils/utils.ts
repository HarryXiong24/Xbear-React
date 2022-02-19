export function setProps(dom, oldProps, newProps) {
  for (const key in oldProps) {
    if (key !== 'children') {
      // eslint-disable-next-line no-prototype-builtins
      if (newProps.hasOwnProperty('key')) {
        // 新老都有更新
        setProp(dom, key, newProps[key]);
      } else {
        //老的有新的没有删除
        dom.removeAttribute(key);
      }
    }
  }
  for (const key in newProps) {
    if (key !== 'children') {
      // eslint-disable-next-line no-prototype-builtins
      if (!oldProps.hasOwnProperty('key')) {
        // 老的没有新的有，添加
        setProp(dom, key, newProps[key]);
      }
    }
  }
}

function setProp(dom, key: string, value: any) {
  // 如果是事件
  if (/^on/.test(key)) {
    dom[key.toLowerCase()] = value; // 没有用合成事件
  } else if (key === 'style') {
    // 如果是样式
    if (value) {
      for (const styleName in value) {
        // eslint-disable-next-line no-prototype-builtins
        if (value.hasOwnProperty(styleName)) {
          dom.style[styleName] = value[styleName];
        }
      }
    }
  } else {
    dom.setAttribute(key, value);
  }
  return dom;
}
