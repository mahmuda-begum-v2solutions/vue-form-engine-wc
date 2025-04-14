import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig(({ mode }) => {
  const isWebComponentBuild = mode === 'webcomponent'

  return {
    plugins: [
      vue({
        template: {
          compilerOptions: {
            isCustomElement: (tag) => tag.includes('-'),
          },
        },
      }),
      vueDevTools(),
      tailwindcss(),
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    define: {
      'process.env.NODE_ENV': JSON.stringify(mode), // <<< This is correct
    },
    build: isWebComponentBuild
      ? {
          lib: {
            entry: 'src/main.ce.ts',
            formats: ['es'],
            fileName: () => `my-web-components.js`,
          },
          cssCodeSplit: false,
          rollupOptions: {
            external: [],
            output: {
              globals: {},
            },
          },
        }
      : {},
  }
})
