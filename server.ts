import express from 'express';

import type http from 'node:http';
import type https from 'node:https';
import type { InlineConfig } from 'vite';

async function startDevServer(server: http.Server | https.Server) {
  const { createServer, mergeConfig } = await import('vite');

  const config = (await import('./vite.config.ts')) as InlineConfig;

  const vite = await createServer(
    mergeConfig(config, {
      appType: 'custom',
      server: { middlewareMode: true, hmr: config.server?.hmr ?? { server } },
    }),
  );

  server.on('close', () => {
    vite.close().then(
      () => server.emit('vite:close'),
      (e: unknown) => {
        vite.config.logger.error(String(e));
      },
    );
  });

  return vite;
}

const app = express();

const server = app.listen(8080, async () => {
  const vite = await startDevServer(server);
  const config = vite.config;

  app.use(config.base, vite.middlewares);

  vite.bindCLIShortcuts({ print: true });
});
