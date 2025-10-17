import express from 'express';
import http from 'node:http';
import path from 'node:path';

import app from '#server/index';

let port = process.env.PORT as string | number | undefined;

if (process.env.NODE_ENV === 'production') {
  port ??= 80;
} else {
  port ??= 8080;
}

app.use(express.static(path.join(process.cwd(), '/dist')));

const server = http.createServer(app);

server.listen(Number(port), () => {
  console.log(`Server running on port ${port}`);
});
