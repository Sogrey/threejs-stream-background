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
  
  private instanceCount: number = 12 // 创建12个烟雾实例，增加密度
  private particlesPerInstance: number = 35 // 每个实例35个粒子，增强覆盖
  private smokeInstances: Array<{
    group: THREE.Group
    items: Array<{
      floatingSpeed: number
      rotationSpeed: number
      mesh: THREE.Mesh
      material: THREE.MeshBasicMaterial
      // 新增缓动参数
      moveSpeedX: number
      moveSpeedY: number
      moveSpeedZ: number
      basePosition: THREE.Vector3
      scaleSpeed: number
      baseScale: THREE.Vector3
    }>
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

    this.color = {
      value: '#130819',
      instance: new THREE.Color('#130819')
    }

    this.createSmokeInstances()
  }

  /**
   * 创建多个烟雾实例
   */
  private createSmokeInstances(): void {
    for (let instanceIndex = 0; instanceIndex < this.instanceCount; instanceIndex++) {
      const instance = this.createSmokeInstance(instanceIndex)
      this.smokeInstances.push(instance)
    }
  }

  /**
   * 生成正态分布随机数 (Box-Muller变换)
   */
  private gaussianRandom(mean: number = 0, stdDev: number = 1): number {
    let u = 0, v = 0
    while(u === 0) u = Math.random() // 避免0
    while(v === 0) v = Math.random() // 避免0
    return mean + stdDev * Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v)
  }

  /**
   * 创建单个烟雾实例
   */
  private createSmokeInstance(instanceIndex: number): {
    group: THREE.Group
    items: Array<{
      floatingSpeed: number
      rotationSpeed: number
      mesh: THREE.Mesh
      material: THREE.MeshBasicMaterial
    }>
  } {
    const group = new THREE.Group()
    
    // 使用正态分布生成位置，主要集中在底部水平中间
    // X轴：集中在中间区域，标准差3.0，大部分在±6范围内
    const offsetX = this.gaussianRandom(0, 3.0)
    // Y轴：集中在底部，标准差2.0，大部分在-4到+2范围内（底部偏向）
    const offsetY = this.gaussianRandom(-1, 2.0)
    // Z轴：集中在中间，标准差2.0，大部分在±4范围内
    const offsetZ = this.gaussianRandom(0, 2.0)
    
    // 限制在合理范围内，避免极端值
    group.position.set(
      Math.max(-10, Math.min(10, offsetX)),
      Math.max(-6, Math.min(4, offsetY)),
      Math.max(-4, Math.min(4, offsetZ))
    )
    
    const geometry = new THREE.PlaneGeometry(1, 1, 1, 1)
    const items: any[] = []

    for (let i = 0; i < this.particlesPerInstance; i++) {
      const item: any = {}

      item.floatingSpeed = Math.random() * 0.00008 + 0.00004 // 更缓慢的浮动速度
      item.rotationSpeed = (Math.random() - 0.5) * 0.00008 // 更缓慢的旋转速度
      
      // 新增各个方向的移动速度，每个粒子有独特的运动周期
      item.moveSpeedX = (Math.random() * 0.00012 + 0.00004) * (Math.random() > 0.5 ? 1 : -1)
      item.moveSpeedY = (Math.random() * 0.00016 + 0.00008) * (Math.random() > 0.5 ? 1 : -1)
      item.moveSpeedZ = (Math.random() * 0.00008 + 0.00004) * (Math.random() > 0.5 ? 1 : -1)
      item.scaleSpeed = Math.random() * 0.0004 + 0.0002 // 更缓慢的缩放变化速度

      // 材质 - 每个烟雾层创建独立的材质
      const smokeTexture = this.resources.getItem('smokeTexture')
      const material = new THREE.MeshBasicMaterial({
        depthWrite: false,
        depthTest: false, // 禁用深度测试，确保正确混合
        transparent: true,
        alphaMap: smokeTexture || undefined,
        opacity: 0.04 + Math.random() * 0.06, // 降低透明度一半，找到最佳平衡点
        side: THREE.DoubleSide // 双面渲染
      })

      material.color = this.color.instance

      // 网格
      item.mesh = new THREE.Mesh(geometry, material)
      item.material = material // 保存材质引用
      
      // 基础尺寸
      const baseScale = 2.0 + Math.random() * 1.0 // 尺寸范围：2.0-3.0
      item.baseScale = new THREE.Vector3(baseScale, baseScale, baseScale)
      item.mesh.scale.set(baseScale, baseScale, baseScale)

      // 使用正态分布生成粒子相对位置，围绕实例中心分布
      // X轴：标准差2.5，大部分在±5范围内
      const baseX = this.gaussianRandom(0, 2.5)
      // Y轴：标准差2.0，大部分在±4范围内，但整体偏向底部
      const baseY = this.gaussianRandom(-0.5, 2.0)
      // Z轴：标准差1.5，大部分在±3范围内
      const baseZ = this.gaussianRandom(0, 1.5)
      
      item.basePosition = new THREE.Vector3(baseX, baseY, baseZ)
      item.mesh.position.set(baseX, baseY, baseZ)
      
      group.add(item.mesh)
      items.push(item)
    }

    this.scene.add(group)
    return { group, items }
  }

  /**
   * 更新烟雾效果
   */
  update(): void {
    const elapsedTime = this.time.elapsedTime + 123456789.123

    // 使用渐变的起始颜色并混合少量白色，保持更淡的颜色
    this.color.instance.copy(this.gradient.startColor)
    this.color.instance.lerp(new THREE.Color('#ffffff'), 0.05)

    // 更新每个烟雾实例中的所有烟雾项
    for (const instance of this.smokeInstances) {
      for (const item of instance.items) {
        if (item.material) {
          item.material.color = this.color.instance
        }
        
        // 多维度缓动旋转
        item.mesh.rotation.z = Math.sin(elapsedTime * item.rotationSpeed) * Math.PI * 0.2
        item.mesh.rotation.x = Math.cos(elapsedTime * item.rotationSpeed * 0.7) * Math.PI * 0.1
        item.mesh.rotation.y = Math.sin(elapsedTime * item.rotationSpeed * 0.5) * Math.PI * 0.1
        
        // X方向缓动移动 - 使用正弦波创造流畅的左右摆动
        const offsetX = Math.sin(elapsedTime * item.moveSpeedX) * 0.8
        // Y方向缓动移动 - 使用余弦波创造上下浮动，限制幅度保持底部聚集
        const offsetY = Math.cos(elapsedTime * item.moveSpeedY) * 0.6
        // Z方向缓动移动 - 创造前后层次感
        const offsetZ = Math.sin(elapsedTime * item.moveSpeedZ) * 0.4
        
        // 应用位置偏移
        item.mesh.position.x = item.basePosition.x + offsetX
        item.mesh.position.y = item.basePosition.y + offsetY
        item.mesh.position.z = item.basePosition.z + offsetZ
        
        // 缓动缩放效果 - 让烟雾有呼吸感
        const scaleOscillation = Math.sin(elapsedTime * item.scaleSpeed) * 0.15 + 1.0 // 0.85-1.15范围
        item.mesh.scale.x = item.baseScale.x * scaleOscillation
        item.mesh.scale.y = item.baseScale.y * scaleOscillation
        item.mesh.scale.z = item.baseScale.z * scaleOscillation
      }
      
      // 为整个实例组添加轻微的旋转，增加整体的流动性
      instance.group.rotation.y = Math.sin(elapsedTime * 0.00002) * 0.03
      instance.group.rotation.x = Math.cos(elapsedTime * 0.000015) * 0.015
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
    for (const instance of this.smokeInstances) {
      for (const item of instance.items) {
        if (item.material) {
          item.material.dispose()
        }
        instance.group.remove(item.mesh)
      }
      this.scene.remove(instance.group)
    }
  }
}