// 测试 Fiber
// import fiberIdle from './fiber';
// fiberIdle();

// 测试 babel 和 createElement
// import { element, tsx_parse_by_babel } from './createElement';
// console.log(element);
// console.log(tsx_parse_by_babel);

// 测试 ReactDOM.render 函数
import { Element } from './ReactDOM';
import ReactDOM from '@/react-dom';
ReactDOM.render(Element, document.getElementById('app')!);
