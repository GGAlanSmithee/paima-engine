import { WebSocketServer } from 'ws';
import * as http from 'http';
import { Args, wsIncomingMessage } from './types';
import { Application } from 'express';

function expressWs(arg0: Args) {
  let app: Application = null!;
  let server: http.Server = null!;

  const options = {
    ws: { noServer: true },
  };

  if (typeof arg0 === `function`) {
    // express()
    app = arg0;
    server = http.createServer(arg0);
  } else if (typeof arg0 === `object`) {
    app = arg0.app;
    server = arg0.server;

    if (arg0.options) {
      options.ws = { ...options.ws, ...arg0.options.ws };
    }
  }

  const wss = new WebSocketServer(options?.ws);

  server.on(`upgrade`, (req: wsIncomingMessage, socket, head) => {
    wss.handleUpgrade(req, socket, head, function (ws) {
      wss.emit('connection', ws, req);
    });
  });

  wss.on(`connection`, ws => {
    ws.on(`message`, message => {
      console.log(`received: %s`, message);
      ws.send(`Hello, you sent -> ${message}`);
    });
  });

  const listen = (...arg: Parameters<typeof server.listen>) => server.listen(...arg);

  app.listen = listen as typeof server.listen;

  return {
    app,
    wss,
  };
}

export { expressWs };
