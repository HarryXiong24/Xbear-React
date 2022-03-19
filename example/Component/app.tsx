import React from '@/react';
import ClassCounter from './class';
import FunctionCounter from './function';

export const App = () => {
  return (
    <div>
      <div>
        <h1>类组件</h1>
        <ClassCounter />
      </div>
      <div>
        <h1>函数组件</h1>
        <FunctionCounter />
      </div>
    </div>
  );
};

export default App;
