import { WebSocketServer, WebSocket, ServerOptions } from 'ws';
import { Server } from 'http';
import { Application } from 'express';
import { IncomingMessage } from 'http';

export interface wsIncomingMessage extends IncomingMessage {
  /**
   * Parse parameters in path, /books/:id => {id: '...'}
   */
  params: {
    [key: string]: undefined | string;
  };

  /**
   * Parse query parameters, Arrays are not currently supported
   */
  query: {
    [key: string]: undefined | string;
  };
}

export type WsExpressOption = {
  app: Application;
  server: Server;
  options?: {
    ws: ServerOptions;
  };
};

export type Args = Application | WsExpressOption;
