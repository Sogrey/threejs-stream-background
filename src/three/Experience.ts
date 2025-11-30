import * as THREE from 'three'
import Time from '../utils/Time'
import Sizes from '../utils/Sizes'
import Resources from './Resources'
import type { ResourceGroup } from '../types/Resources'
import Camera from './Camera'
import Renderer from './Renderer'
import Particles from './Particles'
import Gradient from './Gradient'
import Smoke from './Smoke'
// 临时使用简化版本进行测试
import SimpleParticles from './SimpleParticles'

/**
 * Three.js体验类
 * 管理整个Three.js场景
 */
export default class Experience {
  private static instance: Experience | null = null

  public scene!: THREE.Scene
  public time!: Time
  public sizes!: Sizes
  public resources!: Resources
  public camera!: Camera
  public renderer!: Renderer
  public particles: Particles | null = null
  public gradient: Gradient | null = null
  public smoke: Smoke | null = null

  private canvas!: HTMLCanvasElement
  private targetElement!: HTMLElement
  private animationId: number | null = null

  constructor(canvas: HTMLCanvasElement, targetElement?: HTMLElement) {
    if (Experience.instance) {
      return Experience.instance
    }
    Experience.instance = this

    this.canvas = canvas
    this.targetElement = targetElement || document.body

    this.time = new Time()
    this.sizes = new Sizes()
    
    this.setConfig()
    this.setScene()
    this.setCamera()
    this.setRenderer()
    this.setResources()
    
    this.setupEventListeners()
    this.startRenderLoop()
  }

  /**
   * 设置配置
   */
  private setConfig(): void {
    // 可以在这里添加配置逻辑
  }

  /**
   * 设置场景
   */
  private setScene(): void {
    this.scene = new THREE.Scene()
  }

  /**
   * 设置相机
   */
  private setCamera(): void {
    this.camera = new Camera(this.sizes)
  }

  /**
   * 设置渲染器
   */
  private setRenderer(): void {
    this.renderer = new Renderer(this.sizes, this.canvas)
  }

  /**
   * 设置资源
   */
  private setResources(): void {
    const assets: ResourceGroup[] = [
      {
        name: 'base',
        data: {},
        items: [
          { name: 'particleMaskTexture', source: '/assets/particleMask.png', type: 'texture' },
          { name: 'smokeTexture', source: '/assets/smoke.png', type: 'texture' }
        ]
      }
    ]

    console.log('Setting up resources...')
    this.resources = new Resources(assets)
    
    // 等待资源加载完成
    this.resources.on('ready', () => {
      console.log('Resources ready, checking texture...')
      const texture = this.resources.getItem('particleMaskTexture')
      console.log('Texture loaded:', texture)
      
      if (texture) {
        console.log('Setting gradient...')
        this.setGradient()
        console.log('Setting smoke...')
        this.setSmoke()
        console.log('Setting particles...')
        this.setParticles()
      } else {
        console.warn('Texture not found, creating elements anyway...')
        this.setGradient()
        this.setSmoke()
        this.setParticles()
      }
    })
  }

  /**
   * 设置渐变背景
   */
  private setGradient(): void {
    console.log('Creating gradient...')
    this.gradient = new Gradient(this.scene, this.time)
    console.log('Gradient created:', this.gradient)
  }

  /**
   * 设置烟雾效果
   */
  private setSmoke(): void {
    console.log('Creating smoke...')
    if (this.gradient) {
      this.smoke = new Smoke(this.scene, this.time, this.resources, this.gradient)
      console.log('Smoke created:', this.smoke)
    } else {
      console.error('Gradient not available for smoke')
    }
  }

  /**
   * 设置粒子系统
   */
  private setParticles(): void {
    console.log('Creating particles...')
    // 恢复使用原始着色器粒子系统
    this.particles = new Particles(this.scene, this.time, this.resources)
    console.log('Particles created:', this.particles)
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
      
      if (this.gradient) {
        this.gradient.update()
      }
      
      if (this.smoke) {
        this.smoke.update()
      }
      
      if (this.particles) {
        this.particles.update()
      }
      
      this.renderer.instance.render(this.scene, this.camera.instance)
      
      this.animationId = requestAnimationFrame(render)
    }
    
    render()
  }

  /**
   * 调整尺寸
   */
  resize(): void {
    this.camera.resize()
    this.renderer.resize()
  }

  /**
   * 获取单例实例
   */
  static getInstance(): Experience | null {
    return Experience.instance
  }

  /**
   * 销毁实例
   */
  destroy(): void {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId)
    }
    
    if (this.gradient) {
      this.gradient.destroy()
    }
    
    if (this.smoke) {
      this.smoke.destroy()
    }
    
    if (this.particles) {
      this.particles.destroy()
    }
    
    this.camera.destroy()
    this.renderer.destroy()
    this.sizes.destroy()
    
    Experience.instance = null
  }
}