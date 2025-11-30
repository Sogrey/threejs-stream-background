import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  assetsInclude: ['**/*.glsl'],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // 将Three.js分离到单独的chunk
          'three': ['three'],
          // 将Vue相关分离到单独的chunk
          'vue': ['vue']
        }
      }
    },
    // 提高chunk大小警告限制到700kb
    chunkSizeWarningLimit: 700
  }
})
