import * as THREE from 'three'
import Time from '../utils/Time'
import Resources from './Resources'
import Gradient from './Gradient'

/**
 * 雾化效果类
 * 创建不断颜色渐变的烟雾效果
 */
export default class Smoke {
  private scene: THREE.Scene
  private time: Time
  private resources: Resources
  private gradient: Gradient
  
  private count: number = 40
  private group: THREE.Group
  private geometry: THREE.PlaneGeometry
  private items: Array<{
    floatingSpeed: number
    rotationSpeed: number
    mesh: THREE.Mesh
    material: THREE.MeshBasicMaterial // 每个项保存自己的材质引用
  }> = []

  private color: {
    value: string
    instance: THREE.Color
  }

  constructor(scene: THREE.Scene, time: Time, resources: Resources, gradient: Gradient) {
    this.scene = scene
    this.time = time
    this.resources = resources
    this.gradient = gradient
    
    this.group = new THREE.Group()
    this.group.position.y = -2 // 向后移动，在粒子后面
    this.group.position.z = -1 // Z轴后移，确保在粒子后面
    this.scene.add(this.group)

    this.color = {
      value: '#130819',
      instance: new THREE.Color('#130819')
    }

    this.setGeometry()
    this.setItems()
  }

  /**
   * 设置几何体
   */
  private setGeometry(): void {
    this.geometry = new THREE.PlaneGeometry(1, 1, 1, 1)
  }

  /**
   * 设置烟雾项
   */
  private setItems(): void {
    this.items = []

    for (let i = 0; i < this.count; i++) {
      const item: any = {}

      item.floatingSpeed = Math.random() * 0.0001
      item.rotationSpeed = (Math.random() - 0.5) * Math.random() * 0.0003

      // 材质 - 每个烟雾层创建独立的材质
      const smokeTexture = this.resources.getItem('smokeTexture')
      const material = new THREE.MeshBasicMaterial({
        depthWrite: false,
        depthTest: false, // 禁用深度测试，确保正确混合
        transparent: true,
        alphaMap: smokeTexture || undefined,
        opacity: 0.02 + Math.random() * 0.08, // 非常薄的雾化效果
        side: THREE.DoubleSide // 双面渲染
      })

      material.color = this.color.instance

      // 网格
      item.mesh = new THREE.Mesh(this.geometry, material)
      item.material = material // 保存材质引用
      
      const scale = 6 + Math.random() * 6 // 大幅增加覆盖面积
      item.mesh.scale.set(scale, scale, scale)

      // 主要分布在屏幕下半部分，扩大分布范围
      item.mesh.position.x = (Math.random() - 0.5) * 20
      item.mesh.position.y = -5 + Math.random() * 5 // 更多覆盖下半屏
      item.mesh.position.z = (Math.random() - 0.5) * 8
      
      this.group.add(item.mesh)

      // 保存
      this.items.push(item)
    }
  }

  /**
   * 更新烟雾效果
   */
  update(): void {
    const elapsedTime = this.time.elapsedTime + 123456789.123

    // 使用渐变的起始颜色并混合少量白色，保持更淡的颜色
    this.color.instance.copy(this.gradient.startColor)
    this.color.instance.lerp(new THREE.Color('#ffffff'), 0.05)

    // 更新每个烟雾项的材质颜色和动画
    for (const item of this.items) {
      if (item.material) {
        item.material.color = this.color.instance
      }
      
      item.mesh.rotation.z = elapsedTime * item.rotationSpeed
      item.mesh.position.y = Math.sin(elapsedTime * item.floatingSpeed)
    }
  }

  /**
   * 调整尺寸（如果需要）
   */
  resize(): void {
    // 可以在这里添加响应式逻辑
  }

  /**
   * 销毁烟雾效果
   */
  destroy(): void {
    this.geometry.dispose()
    
    for (const item of this.items) {
      if (item.material) {
        item.material.dispose()
      }
      this.group.remove(item.mesh)
    }
    
    this.scene.remove(this.group)
  }
}