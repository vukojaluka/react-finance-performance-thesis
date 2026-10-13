import { defineConfig } from 'vite'
import { devtools } from '@tanstack/devtools-vite'

import { tanstackStart } from '@tanstack/react-start/plugin/vite'

import viteReact from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import netlify from '@netlify/vite-plugin-tanstack-start'

const config = defineConfig(({ mode }) => {
  const isProfilingBuild = mode === 'profiling'

  return {
    resolve: {
      tsconfigPaths: true,
      ...(isProfilingBuild
        ? {
            // React 19 ships profiling as a separate client entry point.
            // This alias is active only for `npm run build:profile`.
            alias: {
              'react-dom/client': 'react-dom/profiling',
            },
          }
        : {}),
    },
    ...(isProfilingBuild ? { build: { outDir: 'dist-profile' } } : {}),
    plugins: [
      devtools(),
      netlify(),
      tailwindcss(),
      tanstackStart(),
      viteReact(),
    ],
  }
})

export default config
