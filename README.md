# Vue 3 + Three.js 动态粒子星空背景

<div align="center">
  <h3>🌟 基于 Vue 3 和 Three.js 的炫酷动态粒子星空背景</h3>
  <p>具有强大景深效果和毛玻璃UI的现代化Web体验</p>
  
  ![Vue 3](https://img.shields.io/badge/Vue-3.5+-4FC08D?style=flat-square&logo=vue.js)
  ![Three.js](https://img.shields.io/badge/Three.js-0.181+-000000?style=flat-square&logo=three.js)
  ![TypeScript](https://img.shields.io/badge/TypeScript-5.9+-3178C6?style=flat-square&logo=typescript)
  ![Vite](https://img.shields.io/badge/Vite-7.2+-646CFF?style=flat-square&logo=vite)
</div>

## ✨ 项目特色

- 🌟 **动态粒子系统** - 基于着色器的高性能粒子效果
- 🎯 **景深效果** - 近处粒子更亮更大，远处粒子更暗更小
- 🌌 **夜空主题** - 深邃的紫色夜空渐变背景
- 🪟 **毛玻璃UI** - 现代化的半透明界面设计
- 📱 **响应式设计** - 完美适配各种屏幕尺寸

## 🛠️ 技术栈

### 核心框架
- **Vue 3** - 渐进式JavaScript框架，使用Composition API
- **Three.js** - 强大的WebGL 3D图形渲染库
- **TypeScript** - 类型安全的JavaScript超集

### 构建工具
- **Vite** - 快速的现代化构建工具
- **Less** - 功能强大的CSS预处理器

### 着色器技术
- **GLSL** - OpenGL着色器语言
- **顶点着色器** - 处理粒子位置和大小
- **片段着色器** - 处理粒子颜色和景深效果

## 🎨 核心效果

### 🌟 动态粒子系统
- **粒子数量**：2500个，经过性能优化
- **运动轨迹**：基于柏林噪音的自然流动效果
- **景深效果**：近大远小、近亮远暗的空间层次感
- **动态焦点**：景深焦点缓慢移动，增加生动感

### 🌌 夜空背景渐变
- **颜色主题**：深邃的紫色调夜空
- **动态变化**：HSL颜色实时渐变过渡
- **深度层次**：多层次的背景色渐变

### 🪟 现代化UI设计
- **毛玻璃效果**：`backdrop-filter: blur(5px)`
- **高透明度**：94%透明度，完美融入背景
- **无边框设计**：极简主义风格
- **响应式布局**：适配各种屏幕尺寸

## 🚀 快速开始

### 环境要求

- Node.js >= 16
- npm 或 yarn 或 pnpm

### 安装依赖

```bash
npm install
```

### 开发模式

```bash
npm run dev
```

访问 `http://localhost:5173` 查看效果

### 生产构建

```bash
npm run build
```

## 📁 项目结构

```
src/
├── components/
│   └── HelloWorld.vue          # 主要组件，包含毛玻璃UI
├── three/
│   ├── Experience.ts           # Three.js 体验管理器
│   ├── Particles.ts            # 粒子系统核心类
│   ├── Gradient.ts             # 渐变背景类
│   ├── Resources.ts            # 资源管理器
│   └── ...                     # 其他Three.js相关文件
├── shaders/
│   ├── particlesVertex.glsl    # 粒子顶点着色器
│   ├── particlesFragment.glsl  # 粒子片段着色器
│   └── gradientVertex.glsl     # 渐变背景着色器
└── utils/                       # 工具类
```

## ⚙️ 核心配置

### 粒子系统参数
- 粒子数量：2500
- 景深焦点：8单位
- 景深范围：5单位
- 粒子尺寸：动态调整（近大远小）

### 渲染配置
- WebGL渲染器，开启抗锯齿
- 透明背景支持
- 自适应设备像素比

## 🔧 自定义配置

### 调整粒子效果

修改 `src/three/Particles.ts` 中的参数：

```typescript
// 粒子数量
private count: number = 2500

// 景深效果
uFocusPoint: { value: 8 },
uFocusRange: { value: 5 }
```

### 调整背景颜色

修改 `src/three/Gradient.ts` 中的颜色：

```typescript
// 背景色配置
end: {
  value: '#0a0a1f' // 深紫蓝色
},
start: {
  saturation: 60,  // 饱和度
  lightness: 15   // 亮度
}
```

### 调整UI效果

修改 `src/components/HelloWorld.vue` 中的样式：

```less
.greetings {
  background: rgba(30, 30, 60, 0.06);
  backdrop-filter: blur(5px) saturate(120%);
}
```

## 🎯 性能优化

- 使用BufferGeometry优化粒子渲染
- 着色器计算提升GPU性能
- 自适应粒子大小
- 智能资源管理

## 🌐 浏览器兼容性

| 浏览器 | 最低版本 | WebGL支持 | backdrop-filter |
|--------|----------|-----------|----------------|
| Chrome | >= 70 | ✅ | ✅ |
| Firefox | >= 65 | ✅ | ✅ |
| Safari | >= 12 | ✅ | ✅ |
| Edge | >= 79 | ✅ | ✅ |

**注意**：
- 需要支持 WebGL 和 CSS `backdrop-filter` 属性
- 建议使用现代浏览器以获得最佳体验
- 移动端浏览器基本支持主流功能

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

MIT License - 详见 [LICENSE](LICENSE) 文件

## 🙏 致谢

- [Three.js](https://threejs.org/) - 强大的3D图形库
- [Vue.js](https://vuejs.org/) - 渐进式JavaScript框架
- [Vite](https://vite.dev/) - 快速的构建工具

## Recommended IDE Setup

[VS Code](https://code.visualstudio.com/) + [Vue (Official)](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Recommended Browser Setup

- Chromium-based browsers (Chrome, Edge, Brave, etc.):
  - [Vue.js devtools](https://chromewebstore.google.com/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd) 
  - [Turn on Custom Object Formatter in Chrome DevTools](http://bit.ly/object-formatters)
- Firefox:
  - [Vue.js devtools](https://addons.mozilla.org/en-US/firefox/addon/vue-js-devtools/)
  - [Turn on Custom Object Formatter in Firefox DevTools](https://fxdx.dev/firefox-devtools-custom-object-formatters/)

## Type Support for `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for type checking. In editors, we need [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) to make the TypeScript language service aware of `.vue` types.

## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Type-Check, Compile and Minify for Production

```sh
npm run build
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```
