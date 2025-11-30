import EventEmitter from './EventEmitter'

/**
 * 尺寸工具类
 * 用于管理窗口尺寸变化
 */
export default class Sizes extends EventEmitter {
  public width: number = window.innerWidth
  public height: number = window.innerHeight
  public pixelRatio: number = Math.min(Math.max(window.devicePixelRatio, 1), 2)

  constructor() {
    super()
    this.setupResizeListener()
  }

  /**
   * 设置窗口尺寸变化监听
   */
  private setupResizeListener(): void {
    window.addEventListener('resize', this.handleResize.bind(this))
  }

  /**
   * 处理窗口尺寸变化
   */
  private handleResize(): void {
    this.width = window.innerWidth
    this.height = window.innerHeight
    this.pixelRatio = Math.min(Math.max(window.devicePixelRatio, 1), 2)

    this.emit('resize')
  }

  /**
   * 获取窗口宽高比
   */
  get aspectRatio(): number {
    return this.width / this.height
  }

  /**
   * 销毁实例
   */
  destroy(): void {
    window.removeEventListener('resize', this.handleResize.bind(this))
    this.removeAllListeners()
  }
}