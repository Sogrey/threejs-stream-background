import * as THREE from 'three'
import Time from '../utils/Time'
import gradientVertexShader from '../shaders/gradientVertex.glsl?raw'
import gradientFragmentShader from '../shaders/gradientFragment.glsl?raw'

/**
 * 渐变背景类
 * 创建动态颜色渐变背景
 */
export default class Gradient {
  private scene: THREE.Scene
  private time: Time
  private geometry: THREE.PlaneGeometry
  private material: THREE.ShaderMaterial
  private mesh: THREE.Mesh

  private colors: {
    end: {
      value: string
      instance: THREE.Color
    }
    start: {
      saturation: number
      lightness: number
      value: string
      instance: THREE.Color
    }
  }

  constructor(scene: THREE.Scene, time: Time) {
    this.scene = scene
    this.time = time

    this.setGeometry()
    this.setColors()
    this.setMaterial()
    this.setMesh()
  }

  /**
   * 设置几何体
   */
  private setGeometry(): void {
    this.geometry = new THREE.PlaneGeometry(2, 2, 1, 1)
  }

  /**
   * 设置颜色
   */
  private setColors(): void {
    this.colors = {
      end: {
        value: '#0a0a1f', // 深紫蓝色夜空
        instance: new THREE.Color('#0a0a1f')
      },
      start: {
        saturation: 60, // 增加饱和度，更紫
        lightness: 15, // 降低亮度，更深夜空感
        value: `hsl(270, 60%, 15%)`, // 紫色调
        instance: new THREE.Color(`hsl(270, 60%, 15%)`)
      }
    }
  }

  /**
   * 设置材质
   */
  private setMaterial(): void {
    this.material = new THREE.ShaderMaterial({
      depthWrite: false,
      transparent: true,
      uniforms: {
        uTime: { value: 0 },
        uEndColor: { value: this.colors.end.instance },
        uStartColor: { value: this.colors.start.instance }
      },
      vertexShader: gradientVertexShader,
      fragmentShader: gradientFragmentShader
    })
  }

  /**
   * 设置网格
   */
  private setMesh(): void {
    this.mesh = new THREE.Mesh(this.geometry, this.material)
    this.scene.add(this.mesh)
  }

  /**
   * 更新渐变
   */
  update(): void {
    // 动态改变起始颜色的色调
    this.colors.start.value = `hsl(${this.time.elapsedTime * 0.01}, ${this.colors.start.saturation}%, ${this.colors.start.lightness}%)`
    this.colors.start.instance.set(this.colors.start.value)

    this.material.uniforms.uTime.value = this.time.elapsedTime
  }

  /**
   * 获取起始颜色
   */
  get startColor(): THREE.Color {
    return this.colors.start.instance
  }

  /**
   * 获取结束颜色
   */
  get endColor(): THREE.Color {
    return this.colors.end.instance
  }

  /**
   * 销毁渐变
   */
  destroy(): void {
    this.geometry.dispose()
    this.material.dispose()
    this.scene.remove(this.mesh)
  }
}
