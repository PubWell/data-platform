import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    AutoImport({
      imports: ['vue','vue-router'],
      eslintrc: {
        enabled: true, // Default `false`
        filepath: './.eslintrc-auto-import.json',
        globalsPropValue: true,
      },
      resolvers: [
        ElementPlusResolver()
      ],
      dts: 'src/auto-import.d.ts',
    }),
    Components({
      extensions: ['vue', 'jsx', 'tsx', 'ts', 'js','mjs'],
      resolvers: [
        ElementPlusResolver()
      ],
      dts: 'src/components.d.ts',
    })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  css: {
    preprocessorOptions: {
      // 全局样式引入
      scss: {
        additionalData: '@import "./src/assets/scss/custom.scss";',
        javascriptEnabled: true,
      },
    },
  },
  
  server: {
    host: '0.0.0.0',
    port: 3200,
    open: true,
  },
})
