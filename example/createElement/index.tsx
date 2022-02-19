import React from '@/react';

// jsx 元素
export const element = (
  <div id="A1">
    A1
    <div id="B1">
      B1
      <div id="C1">C1</div>
      <div id="C2">C2</div>
    </div>
    <div id="B2">
      <span>B2</span>
    </div>
  </div>
);

// babel 解析过的 element
export const tsx_parse_by_babel = React.createElement(
  'div',
  {
    id: 'A1',
  },
  'A1',
  React.createElement(
    'div',
    {
      id: 'B1',
    },
    'B1',
    React.createElement(
      'div',
      {
        id: 'C1',
      },
      'C1'
    ),
    React.createElement(
      'div',
      {
        id: 'C2',
      },
      'C2'
    )
  ),
  React.createElement(
    'div',
    {
      id: 'B2',
    },
    React.createElement('span', null, 'B2')
  )
);
