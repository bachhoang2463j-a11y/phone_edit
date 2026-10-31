import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

// 单入口单文件 ESM 输出，与原部署形态一致（酒馆助手 import '/scripts/phone_index.js'）
export default defineConfig({
  plugins: [vue()],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    minify: false,
    target: 'esnext',
    rollupOptions: {
      input: 'src/index.js',
      output: {
        format: 'es',
        entryFileNames: 'phone_index.js',
        chunkFileNames: 'phone_index.js',
        assetFileNames: 'phone_index.[ext]',
      },
    },
  },
});
