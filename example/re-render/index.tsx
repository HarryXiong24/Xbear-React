import React from '@/react';
import { Fiber } from '@/types';

// jsx 元素
export const Element1: Fiber = (
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

export const Element2: Fiber = (
  <div id="A1-new">
    A1-new
    <div id="B1">
      B1-new
      <div id="C1-new">C1-new</div>
      <div id="C2-new">C2-new</div>
    </div>
    <div id="B2-new">
      <span>B2-new</span>
    </div>
  </div>
);

export const Element3: Fiber = (
  <div id="A1-new">
    A1-new
    <div id="B1">
      B1-new
      <div id="C1-new">C1-new-new</div>
    </div>
    <div id="B2-new">
      <span>B2-new</span>
    </div>
  </div>
);
