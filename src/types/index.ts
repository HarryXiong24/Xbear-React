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

export type ELEMENT_TEXT = typeof ELEMENT_TEXT;
export type TAG_ROOT = typeof TAG_ROOT;
export type TAG_HOST = typeof TAG_HOST;
export type TAG_TEXT = typeof TAG_TEXT;
export type TAG_CLASS = typeof TAG_CLASS;
export type TAG_FUNCTION_COMPONENT = typeof TAG_FUNCTION_COMPONENT;
export type PLACEMENT = typeof PLACEMENT;
export type DELETION = typeof DELETION;
export type UPDATE = typeof UPDATE;

export interface Fiber {
  tag: symbol;
  stateNode?: HTMLElement | Text | null;
  props: Record<string, any> | null;
  type?: string | ELEMENT_TEXT;
  child?: Fiber | null;
  sibling?: Fiber | null;
  return?: Fiber | null;
  effectTag?: PLACEMENT | DELETION | UPDATE;
  nextEffect?: Fiber | null;
  firstEffect?: Fiber | null;
  lastEffect?: Fiber | null;
}
