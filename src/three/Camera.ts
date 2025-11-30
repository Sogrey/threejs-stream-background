import * as THREE from 'three'
import Sizes from '../utils/Sizes'

/**
 * 相机类
 * 管理Three.js相机
 */
export default class Camera {
  public instance!: THREE.PerspectiveCamera
  private sizes: Sizes

  constructor(sizes: Sizes) {
    this.sizes = sizes
    this.setInstance()
    this.setupResizeListener()
  }

  /**
   * 创建相机实例
   */
  private setInstance(): void {
    this.instance = new THREE.PerspectiveCamera(
      35, // fov
      this.sizes.aspectRatio, // aspect
      0.1, // near
      100 // far
    )
    this.instance.position.set(6, 6, 6)
    this.instance.lookAt(0, 0, 0)
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
   * 更新相机
   */
  update(): void {
    // 相机更新逻辑（如果需要动画）
  }

  /**
   * 调整相机尺寸
   */
  resize(): void {
    this.instance.aspect = this.sizes.aspectRatio
    this.instance.updateProjectionMatrix()
  }

  /**
   * 销毁相机
   */
  destroy(): void {
    this.sizes.removeAllListenersForEvent('resize')
  }
}