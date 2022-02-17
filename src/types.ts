export interface RootFiber {
  tag: symbol;
  stateNode: HTMLElement;
  props: Record<string, any> | null;
}
