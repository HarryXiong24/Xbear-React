import { useReducer } from './useReducer';

export function useState(initialValue) {
  return useReducer(null, initialValue);
}
