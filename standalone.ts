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

const webRootPath = path.join(process.cwd(), '/dist');

app.use(express.static(webRootPath));

// Allow any unknown URL to be handled by the client application.
app.use((req, res, next) => {
  if (req.accepts('html')) {
    res.sendFile(path.join(webRootPath, 'index.html'));
  } else {
    next();
  }
});

const server = http.createServer(app);

server.listen(Number(port), () => {
  console.log(`Server running on port: ${port}`);
});
