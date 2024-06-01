import { WebSocketServer } from 'ws';
import * as http from 'http';
import {
  Args,
  WsSubscribeMessage,
  WsUnsubscribeMessage,
  WsMessage,
  wsIncomingMessage,
} from './types';
import { Application } from 'express';
import { doLog } from '@paima/utils';
import assertNever from 'assert-never';
import { WebSocket } from 'ws';

// create a dictionary of clients subscribed to a regex matched with a specific consise format
// for example battle|battle-id|round|actions as /battle|1234|\d+|\w+/g
export const wsSubscriptions: { [key: string]: WebSocket[] } = {};

const isSubscribeMessage = (message: any): message is WsSubscribeMessage => {
  return (
    typeof message === `object` && message.type === `subscribe` && typeof message.regex === `string`
  );
};

const isUnsubscribeMessage = (message: any): message is WsUnsubscribeMessage => {
  return (
    typeof message === `object` &&
    message.type === `unsubscribe` &&
    typeof message.regex === `string`
  );
};

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
      try {
        const json: WsMessage = JSON.parse(message.toString());

        if (isSubscribeMessage(json)) {
          if (!wsSubscriptions[json.regex]) {
            wsSubscriptions[json.regex] = [];
          }

          wsSubscriptions[json.regex].push(ws);
        } else if (isUnsubscribeMessage(json)) {
          if (wsSubscriptions[json.regex]) {
            wsSubscriptions[json.regex] = wsSubscriptions[json.regex].filter(w => w !== ws);
          }
        } else {
          assertNever(json);
        }
      } catch (e) {
        doLog(`Error parsing message: %s`, message);
      }
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
