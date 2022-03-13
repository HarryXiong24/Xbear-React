// 测试 Fiber
// import fiberIdle from './fiber';
// fiberIdle();

// 测试 babel 和 createElement
// import { element, tsx_parse_by_babel } from './createElement';
// console.log(element);
// console.log(tsx_parse_by_babel);

// 测试 ReactDOM.render 函数
// import { Element } from './schedule/index';
// import ReactDOM from './schedule/reactDOM';
// ReactDOM.render(Element, document.getElementById('app')!);

// 测试二次更新
import { Element1, Element2, Element3 } from './re-render/index';
import ReactDOM from '../src/react-dom';
ReactDOM.render(Element1, document.getElementById('app')!);
const btn1 = document.getElementById('btn1');
const btn2 = document.getElementById('btn2');
btn1?.addEventListener('click', () => {
  ReactDOM.render(Element2, document.getElementById('app')!);
});
btn2?.addEventListener('click', () => {
  ReactDOM.render(Element3, document.getElementById('app')!);
});
