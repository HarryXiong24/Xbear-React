import React from '@/react';

// jsx 元素
export const element = (
  <div>
    <div id="A1">
      <span>text1</span>
      <button>加1</button>
    </div>
    <div id="A2">
      <span>text2</span>
    </div>
  </div>
);

// babel 解析过的 element
export const tsx_parse_by_babel = React.createElement(
  'div',
  null,
  React.createElement(
    'div',
    {
      id: 'A1',
    },
    React.createElement('span', null, 'text1'),
    React.createElement('button', null, '\u52A01')
  ),
  React.createElement(
    'div',
    {
      id: 'A2',
    },
    React.createElement('span', null, 'text2')
  )
);
