import * as THREE from 'three'
import Time from '../utils/Time'
import Sizes from '../utils/Sizes'
import Camera from './Camera'
import Renderer from './Renderer'

/**
 * 简化版Three.js体验类
 * 用于测试基本场景是否正常工作
 */
export default class SimpleExperience {
  public scene!: THREE.Scene
  public time!: Time
  public sizes!: Sizes
  public camera!: Camera
  public renderer!: Renderer

  private canvas!: HTMLCanvasElement
  private animationId: number | null = null

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas
    this.time = new Time()
    this.sizes = new Sizes()
    
    this.setConfig()
    this.setScene()
    this.setCamera()
    this.setRenderer()
    this.createTestContent()
    
    this.setupEventListeners()
    this.startRenderLoop()
  }

  /**
   * 设置配置
   */
  private setConfig(): void {
    // 配置
  }

  /**
   * 设置场景
   */
  private setScene(): void {
    this.scene = new THREE.Scene()
    console.log('Scene created')
  }

  /**
   * 设置相机
   */
  private setCamera(): void {
    this.camera = new Camera(this.sizes)
    console.log('Camera created')
  }

  /**
   * 设置渲染器
   */
  private setRenderer(): void {
    this.renderer = new Renderer(this.sizes, this.canvas)
    console.log('Renderer created')
  }

  /**
   * 创建测试内容
   */
  private createTestContent(): void {
    // 创建一个简单的立方体作为测试
    const geometry = new THREE.BoxGeometry(1, 1, 1)
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 })
    const cube = new THREE.Mesh(geometry, material)
    this.scene.add(cube)
    
    console.log('Test cube created and added to scene')
  }

  /**
   * 设置事件监听器
   */
  private setupEventListeners(): void {
    this.sizes.on('resize', () => {
      this.resize()
    })
  }

  /**
   * 开始渲染循环
   */
  private startRenderLoop(): void {
    const render = () => {
      this.time.update()
      this.camera.update()
      this.renderer.instance.render(this.scene, this.camera.instance)
      this.animationId = requestAnimationFrame(render)
    }
    
    render()
    console.log('Render loop started')
  }

  /**
   * 调整尺寸
   */
  resize(): void {
    this.camera.resize()
    this.renderer.resize()
  }

  /**
   * 销毁实例
   */
  destroy(): void {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId)
    }
    
    this.camera.destroy()
    this.renderer.destroy()
    this.sizes.destroy()
  }
}