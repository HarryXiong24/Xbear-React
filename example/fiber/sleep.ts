// 在 JS 里实现睡眠的功能
export default function sleep(delay: number) {
  // start 当前时间
  // eslint-disable-next-line no-empty
  for (let start = Date.now(); Date.now() - start <= delay; ) {}
}
