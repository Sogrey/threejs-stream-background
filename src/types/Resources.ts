export interface ResourceItem {
  name: string
  source: string
  type: 'texture'
}

export interface ResourceGroup {
  name: string
  data?: any
  items: ResourceItem[]
}