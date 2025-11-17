import { fileURLToPath, URL } from 'node:url';

import vue from '@vitejs/plugin-vue';
import { defineConfig, PluginOption, PreviewServer, ViteDevServer } from 'vite';
import vueDevTools from 'vite-plugin-vue-devtools';

// Attach an Express application to the Vite middleware stack.
function useLazyExpress(path: string) {
  return {
    name: 'use-express',
    apply: 'serve',
    configureServer: async (server: ViteDevServer) =>
      void server.middlewares.use((await import(path)).default),
    configurePreviewServer: async (server: PreviewServer) =>
      void server.middlewares.use((await import(path)).default),
  } as const satisfies PluginOption;
}

function relativeToRoot(path: string) {
  return fileURLToPath(new URL(path, import.meta.url));
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
    useLazyExpress(relativeToRoot('./server/index.ts')),
  ],
  resolve: { alias: { '@': relativeToRoot('./src') } },
});
