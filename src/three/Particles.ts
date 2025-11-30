import * as THREE from 'three'
import Time from '../utils/Time'
import Resources from './Resources'
import particlesVertexShader from '../shaders/particlesVertex.glsl?raw'
import particlesFragmentShader from '../shaders/particlesFragment.glsl?raw'

/**
 * 粒子系统类
 * 创建和管理动态粒子效果
 */
export default class Particles {
  private scene: THREE.Scene
  private time: Time
  private resources: Resources
  private geometry: THREE.BufferGeometry | null = null
  private material: THREE.ShaderMaterial | null = null
  private points: THREE.Points | null = null
  
  private count: number = 2500
  private materialUniforms: {
    uTime: { value: number }
    uSize: { value: number }
    uProgressSpeed: { value: number }
    uPerlinFrequency: { value: number }
    uPerlinMultiplier: { value: number }
    uFocusPoint: { value: number }  // 景深焦点
    uFocusRange: { value: number }  // 景深范围
    uMask: { value: THREE.Texture | null }
  }

  constructor(scene: THREE.Scene, time: Time, resources: Resources) {
    this.scene = scene
    this.time = time
    this.resources = resources
    
    this.materialUniforms = {
      uTime: { value: 0 },
      uSize: { value: 60 }, // 大幅增大粒子尺寸
      uProgressSpeed: { value: 0.000015 },
      uPerlinFrequency: { value: 0.17 },
      uPerlinMultiplier: { value: 0.5 }, // 减少噪音干扰，让粒子更清晰
      uFocusPoint: { value: 8 },     // 将焦点移近，让近处粒子更清晰
      uFocusRange: { value: 5 },     // 进一步缩小景深范围，增强焦点内外的对比
      uMask: { value: null }
    }

    this.init()
  }

  /**
   * 初始化粒子系统
   */
  private init(): void {
    console.log('Particles init...')
    
    // 直接等待资源加载完成，因为Experience类中已经监听了ready事件
    console.log('Setting mask texture...')
    const maskTexture = this.resources.getItem('particleMaskTexture')
    if (maskTexture) {
      this.materialUniforms.uMask.value = maskTexture
    } else {
      console.warn('particleMaskTexture not found, using null')
    }
    
    console.log('Creating geometry...')
    this.setGeometry()
    
    console.log('Creating material...')
    this.setMaterial()
    
    console.log('Creating points...')
    this.setPoints()
    
    console.log('Particles initialization complete')
  }

  /**
   * 设置粒子几何体
   */
  private setGeometry(): void {
    if (this.geometry) {
      this.geometry.dispose()
    }

    this.geometry = new THREE.BufferGeometry()

    const positionArray = new Float32Array(this.count * 3)
    const progressArray = new Float32Array(this.count)
    const sizeArray = new Float32Array(this.count)
    const alphaArray = new Float32Array(this.count)

    for (let i = 0; i < this.count; i++) {
      positionArray[i * 3 + 0] = (Math.random() - 0.5) * 30 // 进一步扩大分布范围，适应减少的粒子数量
      positionArray[i * 3 + 1] = -3 + Math.random() * 10 // 增加垂直分布范围
      positionArray[i * 3 + 2] = (Math.random() - 0.5) * 15 // 增加深度分布范围
      
      progressArray[i] = Math.random()
      sizeArray[i] = 0.6 + Math.random() * 0.4 // 更大更一致的尺寸
      alphaArray[i] = 0.8 + Math.random() * 0.2 // 更高的透明度，更明显
    }

    this.geometry.setAttribute('position', new THREE.Float32BufferAttribute(positionArray, 3))
    this.geometry.setAttribute('aProgress', new THREE.Float32BufferAttribute(progressArray, 1))
    this.geometry.setAttribute('aSize', new THREE.Float32BufferAttribute(sizeArray, 1))
    this.geometry.setAttribute('aAlpha', new THREE.Float32BufferAttribute(alphaArray, 1))
  }

  /**
   * 设置粒子材质
   */
  private setMaterial(): void {
    console.log('Setting particle material...')
    
    // 首先确保着色器字符串存在
    if (!particlesVertexShader || !particlesFragmentShader) {
      console.error('Shader strings are missing!')
      return
    }
    
    console.log('Vertex shader length:', particlesVertexShader.length)
    console.log('Fragment shader length:', particlesFragmentShader.length)
    console.log('Mask texture:', this.materialUniforms.uMask.value)
    
    this.material = new THREE.ShaderMaterial({
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthTest: false,
      uniforms: this.materialUniforms,
      vertexShader: particlesVertexShader,
      fragmentShader: particlesFragmentShader
    })
    
    console.log('Material created successfully')
  }

  /**
   * 创建粒子点对象
   */
  private setPoints(): void {
    if (!this.geometry || !this.material) return

    this.points = new THREE.Points(this.geometry, this.material)
    this.points.position.y = -1 // 进一步向上移动粒子位置
    this.scene.add(this.points)
  }

  /**
   * 更新粒子系统
   */
  update(): void {
    if (!this.material) return;
    
    this.material.uniforms.uTime.value = this.time.elapsedTime;
    
    // 动态景深焦点 - 让焦点随时间缓慢移动，范围更小
    const focusDistance = 8 + Math.sin(this.time.elapsedTime * 0.0001) * 2;
    this.material.uniforms.uFocusPoint.value = focusDistance;
  }

  /**
   * 调整粒子数量
   */
  setParticleCount(count: number): void {
    this.count = count
    this.setGeometry()
    if (this.points) {
      this.points.geometry = this.geometry!
    }
  }

  /**
   * 更新材质参数
   */
  updateUniforms(params: {
    size?: number
    progressSpeed?: number
    perlinFrequency?: number
    perlinMultiplier?: number
  }): void {
    if (!this.material) return;

    if (params.size !== undefined) {
      this.material.uniforms.uSize.value = params.size;
    }
    if (params.progressSpeed !== undefined) {
      this.material.uniforms.uProgressSpeed.value = params.progressSpeed;
    }
    if (params.perlinFrequency !== undefined) {
      this.material.uniforms.uPerlinFrequency.value = params.perlinFrequency;
    }
    if (params.perlinMultiplier !== undefined) {
      this.material.uniforms.uPerlinMultiplier.value = params.perlinMultiplier;
    }
  }

  /**
   * 销毁粒子系统
   */
  destroy(): void {
    if (this.geometry) {
      this.geometry.dispose()
    }
    if (this.material) {
      this.material.dispose()
    }
    if (this.points) {
      this.scene.remove(this.points)
    }
  }
}