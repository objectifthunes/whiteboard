import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'
import { copyFileSync } from 'fs'

export default defineConfig({
  plugins: [
    dts({ rollupTypes: true }),
    {
      name: 'copy-css',
      closeBundle() {
        copyFileSync('src/whiteboard.css', 'dist/whiteboard.css')
      },
    },
  ],
  build: {
    lib: {
      entry: 'src/index.ts',
      formats: ['es'],
      fileName: 'index',
    },
    rollupOptions: {
      external: ['react', 'react-dom', 'react/jsx-runtime', 'zustand'],
      output: {
        // The whole kit is client-side UI; Vite strips module-level
        // directives when bundling, so RSC consumers (Next layouts)
        // need the banner or createContext explodes server-side.
        banner: '"use client";',
      },
      onwarn(warning, warn) {
        if (warning.code === 'MODULE_LEVEL_DIRECTIVE') return
        warn(warning)
      },
    },
  },
})
