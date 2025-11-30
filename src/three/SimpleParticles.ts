import * as THREE from 'three'
import Time from '../utils/Time'

/**
 * 简化版粒子系统类
 * 使用基本的点云而不是着色器
 */
export default class SimpleParticles {
  private scene!: THREE.Scene
  private time!: Time
  private geometry!: THREE.BufferGeometry
  private material!: THREE.PointsMaterial
  private points!: THREE.Points

  constructor(scene: THREE.Scene, time: Time) {
    this.scene = scene
    this.time = time
    this.init()
  }

  /**
   * 初始化粒子系统
   */
  private init(): void {
    console.log('Creating simple particles...')
    this.setGeometry()
    this.setMaterial()
    this.setPoints()
    console.log('Simple particles created')
  }

  /**
   * 设置粒子几何体
   */
  private setGeometry(): void {
    this.geometry = new THREE.BufferGeometry()

    const positions = []
    const count = 2000

    for (let i = 0; i < count; i++) {
      const x = (Math.random() - 0.5) * 20
      const y = (Math.random() - 0.5) * 10
      const z = (Math.random() - 0.5) * 10
      positions.push(x, y, z)
    }

    this.geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
  }

  /**
   * 设置粒子材质
   */
  private setMaterial(): void {
    this.material = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.1,
      sizeAttenuation: true
    })
  }

  /**
   * 创建粒子点对象
   */
  private setPoints(): void {
    this.points = new THREE.Points(this.geometry, this.material)
    this.points.position.y = -5
    this.scene.add(this.points)
  }

  /**
   * 更新粒子系统
   */
  update(): void {
    // 简单的旋转动画
    this.points.rotation.y += 0.001
  }

  /**
   * 销毁粒子系统
   */
  destroy(): void {
    this.geometry.dispose()
    this.material.dispose()
    this.scene.remove(this.points)
  }
}