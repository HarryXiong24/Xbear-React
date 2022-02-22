import {
  ELEMENT_TEXT,
  TAG_ROOT,
  TAG_HOST,
  TAG_TEXT,
  TAG_CLASS,
  TAG_FUNCTION_COMPONENT,
  PLACEMENT,
  DELETION,
  UPDATE,
} from '../constants';

export type ELEMENT_TEXT_TYPE = typeof ELEMENT_TEXT;
export type TAG_ROOT_TYPE = typeof TAG_ROOT;
export type TAG_HOST_TYPE = typeof TAG_HOST;
export type TAG_TEXT_TYPE = typeof TAG_TEXT;
export type TAG_CLASS_TYPE = typeof TAG_CLASS;
export type TAG_FUNCTION_COMPONENT_TYPE = typeof TAG_FUNCTION_COMPONENT;
export type PLACEMENT_TYPE = typeof PLACEMENT;
export type DELETION_TYPE = typeof DELETION;
export type UPDATE_TYPE = typeof UPDATE;

export interface Props {
  text?: string;
  children?: Fiber[] | [];
  [key: string]: any;
}

export interface Fiber {
  /**
   * 虚拟 dom 里的属性
   */
  // 绑定的真实节点
  stateNode?: HTMLElement | Text | null;
  // 是原生节点还是 react 节点
  type?: string | ELEMENT_TEXT_TYPE;
  // 该节点下的属性，children
  props?: Props | null;

  /**
   * Fiber 里的属性
   */
  // 标志符，区分不同的 fiber 类型
  tag?:
    | TAG_ROOT_TYPE
    | TAG_HOST_TYPE
    | TAG_TEXT_TYPE
    | TAG_FUNCTION_COMPONENT_TYPE;
  // fiber 遍历时用到的指针
  child?: Fiber | null;
  sibling?: Fiber | null;
  return?: Fiber | null;
  // 收集副作用用到的标志
  effectTag?: PLACEMENT_TYPE | DELETION_TYPE | UPDATE_TYPE | null;
  nextEffect?: Fiber | null;
  firstEffect?: Fiber | null;
  lastEffect?: Fiber | null;
}
