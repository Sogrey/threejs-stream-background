/**
 * 时间工具类
 * 用于管理动画时间和帧率
 */
export default class Time {
  private start: number = Date.now()
  private current: number = this.start
  private elapsed: number = 0
  private delta: number = 16

  constructor() {
    // 初始值已经设置
  }

  /**
   * 更新时间
   */
  update(): void {
    const currentTime = Date.now()
    this.delta = currentTime - this.current
    this.current = currentTime
    this.elapsed = this.current - this.start
  }

  /**
   * 获取当前时间戳
   */
  get currentTimestamp(): number {
    return this.current
  }

  /**
   * 获取经过的时间（毫秒）
   */
  get elapsedTime(): number {
    return this.elapsed
  }

  /**
   * 获取帧间隔时间（毫秒）
   */
  get deltaTime(): number {
    return this.delta
  }
}