import * as THREE from 'three'
import EventEmitter from '../utils/EventEmitter'
import type { ResourceItem, ResourceGroup } from '../types/Resources'

// 重新导出类型
export type { ResourceItem, ResourceGroup }

/**
 * 资源管理类
 * 用于加载和管理纹理等资源
 */
export default class Resources extends EventEmitter {
  private items: { [key: string]: THREE.Texture | null } = {}
  private toLoad: ResourceItem[] = []
  private loaded: ResourceItem[] = []

  constructor(groups: ResourceGroup[]) {
    super()
    this.setupGroups(groups)
  }

  /**
   * 设置资源组
   */
  private setupGroups(groups: ResourceGroup[]): void {
    groups.forEach(group => {
      group.items.forEach(item => {
        this.toLoad.push(item)
      })
    })
    
    // 开始加载所有资源
    this.loadAllItems()
  }

  /**
   * 加载所有资源项
   */
  private loadAllItems(): void {
    let loadedCount = 0
    
    console.log('Starting to load', this.toLoad.length, 'resources')
    
    this.toLoad.forEach(item => {
      const loader = new THREE.TextureLoader()
      
      console.log(`Loading ${item.name} from ${item.source}`)
      
      loader.load(
        item.source,
        (texture: THREE.Texture) => {
          console.log(`Successfully loaded ${item.name}`)
          this.items[item.name] = texture
          this.loaded.push(item)
          loadedCount++
          
          // 检查是否所有资源都已加载
          if (loadedCount === this.toLoad.length) {
            console.log('All resources loaded successfully')
            this.emit('ready')
          }
        },
        (progress: ProgressEvent) => {
          console.log(`Loading progress for ${item.name}:`, progress)
        },
        (error: Error) => {
          console.error(`Failed to load ${item.name}:`, error)
          this.items[item.name] = null
          this.loaded.push(item)
          loadedCount++
          
          // 检查是否所有资源都已加载
          if (loadedCount === this.toLoad.length) {
            console.log('All resources attempted to load (some may have failed)')
            this.emit('ready')
          }
        }
      )
    })
  }

  /**
   * 获取已加载的资源
   */
  getItem(name: string): THREE.Texture | null {
    return this.items[name]
  }

  /**
   * 获取所有已加载的资源
   */
  get allItems(): { [key: string]: THREE.Texture | null } {
    return this.items
  }
}