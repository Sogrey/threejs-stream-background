<template>
  <div class="stream-background">
    <div class="experience-container">
      <canvas ref="canvasRef" class="experience-canvas"></canvas>
    </div>

    <div class="content-overlay">
      <div class="greetings">
        <h1 class="green">{{ msg }}</h1>
        <h3>
          Vue 3 + Three.js 动态粒子星空背景
        </h3>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import Experience from '../three/Experience'
// 临时使用简化版本进行测试
// import SimpleExperience from '../three/SimpleExperience'

defineProps<{
  msg: string
}>()

const canvasRef = ref<HTMLCanvasElement | null>(null)
const experienceRef = ref<Experience | null>(null)

onMounted(() => {
  if (canvasRef.value) {
    experienceRef.value = new Experience(canvasRef.value, document.querySelector('.experience-container') as HTMLElement)
  }
})

onUnmounted(() => {
  if (experienceRef.value) {
    experienceRef.value.destroy()
  }
})
</script>

<style scoped lang="less">
.stream-background {
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;
  background: #1a0836;

  .experience-container {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }

  .experience-canvas {
    display: block;
    width: 100%;
    height: 100%;
  }

  .content-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    pointer-events: none;
    z-index: 10;

    .greetings {
      text-align: center;
      color: white;
      padding: 2rem;
      background: rgba(30, 30, 60, 0.06); // 进一步增加透明度
      border-radius: 1.5rem;
      backdrop-filter: blur(5px) saturate(120%); // 减少模糊度，稍微增加饱和度
      -webkit-backdrop-filter: blur(5px) saturate(120%); // Safari 兼容
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2); // 恢复阴影强度
      max-width: 600px;
      margin: 0 2rem;

      h1 {
        font-weight: 700;
        font-size: 3rem;
        margin-bottom: 1rem;
        background: linear-gradient(45deg, #00ff88, #00bbff);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
      }

      h3 {
        font-size: 1.5rem;
        margin-bottom: 1rem;
        font-weight: 400;
        color: rgba(255, 255, 255, 0.9);
      }

      p {
        font-size: 1rem;
        color: rgba(255, 255, 255, 0.7);
        line-height: 1.6;
      }
    }
  }
}

// 响应式断点
@media (min-width: 768px) {
  .stream-background .content-overlay .greetings {
    h1 {
      font-size: 4rem;
    }

    h3 {
      font-size: 1.8rem;
    }

    p {
      font-size: 1.1rem;
    }
  }
}

@media (min-width: 1024px) {
  .stream-background .content-overlay .greetings {
    max-width: 800px;
    padding: 3rem;
  }
}
</style>
