import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import pkg from './package.json' assert { type: 'json' }

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    __NAME__: `"${pkg.name}"`,
  },
  resolve: {
    alias: {
      '@': '/src',
    },
  },
})
