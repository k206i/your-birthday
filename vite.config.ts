/// <reference types="vitest" />

import legacy from '@vitejs/plugin-legacy'
import vue from '@vitejs/plugin-vue'
import svgLoader from 'vite-svg-loader'
import path from 'path'
import { defineConfig } from 'vite'
import pkg from './package.json'

// https://vitejs.dev/config/
export default defineConfig({
  // В релизной сборке версию задаёт тег через APP_VERSION_NAME, локально её берём из package.json
  define: {
    __APP_VERSION__: JSON.stringify( process.env.APP_VERSION_NAME ?? pkg.version ),
    // Проверка обновлений с GitHub. По умолчанию выключена: в магазинной сборке её быть не должно
    __UPDATE_CHECK__: JSON.stringify( process.env.UPDATE_CHECK === 'true' ),
  },
  plugins: [
    vue(),
    legacy(),
    svgLoader(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  test: {
    globals: true,
    environment: 'jsdom'
  }
})
