import * as THREE from 'three'
import Sizes from '../utils/Sizes'

/**
 * 渲染器类
 * 管理Three.js渲染器
 */
export default class Renderer {
  public instance!: THREE.WebGLRenderer
  private sizes: Sizes

  constructor(sizes: Sizes, canvas?: HTMLCanvasElement) {
    this.sizes = sizes
    this.setInstance(canvas)
    this.setupResizeListener()
  }

  /**
   * 创建渲染器实例
   */
  private setInstance(canvas?: HTMLCanvasElement): void {
    this.instance = new THREE.WebGLRenderer({
      canvas: canvas,
      antialias: true,
      alpha: true
    })
    
    this.instance.setPixelRatio(this.sizes.pixelRatio)
    this.instance.setSize(this.sizes.width, this.sizes.height)
    this.instance.setClearColor(0x000000, 0)
  }

  /**
   * 设置尺寸变化监听
   */
  private setupResizeListener(): void {
    this.sizes.on('resize', () => {
      this.resize()
    })
  }

  /**
   * 更新渲染器
   */
  update(scene: THREE.Scene, camera: THREE.PerspectiveCamera): void {
    this.instance.render(scene, camera)
  }

  /**
   * 调整渲染器尺寸
   */
  resize(): void {
    this.instance.setSize(this.sizes.width, this.sizes.height)
    this.instance.setPixelRatio(this.sizes.pixelRatio)
  }

  /**
   * 销毁渲染器
   */
  destroy(): void {
    this.sizes.removeAllListenersForEvent('resize')
    this.instance.dispose()
  }
}