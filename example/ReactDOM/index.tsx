import React from '@/react';
import { Fiber } from '@/types';

// jsx 元素
export const Element: Fiber = (
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
