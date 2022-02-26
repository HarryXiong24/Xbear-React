export class Update {
  public payload;
  constructor(payload) {
    this.payload = payload;
  }
}

//数据结构是单链表 更新队列
export class UpdateQueue {
  public firstUpdate;
  public lastUpdate;
  constructor() {
    this.firstUpdate = null;
    this.lastUpdate = null;
  }
  enqueueUpdate(update) {
    if (this.lastUpdate === null) {
      this.firstUpdate = this.lastUpdate = update;
    } else {
      this.lastUpdate.nextUpdate = update;
      this.lastUpdate = update;
    }
  }
  forceUpdate(state) {
    let currentUpdate = this.firstUpdate;
    while (currentUpdate) {
      const nextState =
        typeof currentUpdate.payload === 'function'
          ? currentUpdate.payload(state)
          : currentUpdate.payload;
      state = { ...state, ...nextState };
      currentUpdate = currentUpdate.nextUpdate;
    }
    this.firstUpdate = this.lastUpdate = null;
    return state;
  }
}
