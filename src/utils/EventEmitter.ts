/**
 * 事件发射器类
 * 用于管理组件间的事件通信
 */
export default class EventEmitter {
  private events: { [key: string]: Function[] } = {}

  /**
   * 添加事件监听器
   * @param event 事件名称
   * @param callback 回调函数
   */
  on(event: string, callback: Function): void {
    if (!this.events[event]) {
      this.events[event] = []
    }
    this.events[event].push(callback)
  }

  /**
   * 移除事件监听器
   * @param event 事件名称
   * @param callback 回调函数
   */
  off(event: string, callback: Function): void {
    if (!this.events[event]) return
    
    const index = this.events[event].indexOf(callback)
    if (index > -1) {
      this.events[event].splice(index, 1)
    }
  }

  /**
   * 触发事件
   * @param event 事件名称
   * @param args 参数列表
   */
  emit(event: string, ...args: any[]): void {
    if (!this.events[event]) return
    
    this.events[event].forEach(callback => {
      callback(...args)
    })
  }

  /**
   * 移除所有事件监听器
   */
  removeAllListeners(): void {
    this.events = {}
  }

  /**
   * 移除指定事件的所有监听器
   * @param event 事件名称
   */
  removeAllListenersForEvent(event: string): void {
    if (this.events[event]) {
      delete this.events[event]
    }
  }
}