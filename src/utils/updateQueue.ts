export class Update {
  public payload;
  constructor(payload) {
    this.payload = payload;
  }
}

// 更新队列
// 数据结构是单链表
export class UpdateQueue {
  public firstUpdate;
  public lastUpdate;

  constructor() {
    this.firstUpdate = null;
    this.lastUpdate = null;
  }
  // 入队
  enqueueUpdate(update) {
    if (this.lastUpdate === null) {
      this.firstUpdate = this.lastUpdate = update;
    } else {
      this.lastUpdate.nextUpdate = update;
      this.lastUpdate = update;
    }
  }
  // 使用列表更新状态
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
