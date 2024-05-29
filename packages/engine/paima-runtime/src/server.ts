import cors from 'cors';
import type { Express, Response as ExResponse, Request as ExRequest, NextFunction } from 'express';
import express from 'express';
import swaggerUi from 'swagger-ui-express';
import { basicControllerJson } from '@paima/rest';
import { merge, isErrorResult } from 'openapi-merge';
import { doLog, logError } from '@paima/utils';
import path from 'path';
import { ValidateError } from 'tsoa';
import { expressWs } from './express-ws/express-ws';

// todo: go over naming conventions below
// note: the below is retain backwards compatiblity, allowing server to be used as a drop-in replacement for express
//       while also being compatible with express-ws, exposing server.ws in addition to server.get, server.post, etc.
type ExpressWs = ReturnType<typeof expressWs>;
type Server = Express & ExpressWs['app'];
type ExpressWsServer = Omit<ExpressWs, 'app'> & { app: Server };

const { app: server, wss: wsServer }: ExpressWsServer = expressWs(express()) as ExpressWsServer;
const bodyParser = express.json();

server.use(cors());
server.use(bodyParser);

function startServer(): void {
  // Assign the port
  let port = process.env.WEBSERVER_PORT;
  if (!port) port = '3333';

  server.listen(port, () => {
    doLog(`Game Node Webserver Started At: http://localhost:${port}`);
  });

  // const start = Date.now();

  // setInterval(() => {
  //   doLog(`Websocket after ${Math.round(Date.now() - start) / 1000} seconds: ${wss}`);
  // }, 1000);
}

function getOpenApiJson(userStateMachineApi: object | undefined): object {
  if (userStateMachineApi == null) {
    return basicControllerJson;
  } else {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const mergeResult = merge([{ oas: basicControllerJson as any }, { oas: userStateMachineApi }]);
    if (isErrorResult(mergeResult)) {
      logError(`Failed to merge openAPI definitions: ${JSON.stringify(mergeResult)}`);
      return userStateMachineApi;
    }
    return mergeResult.output;
  }
}

function registerValidationErrorHandler(): void {
  server.use(function errorHandler(
    err: unknown,
    req: ExRequest,
    res: ExResponse,
    next: NextFunction
  ): ExResponse | void {
    if (err instanceof ValidateError) {
      console.warn(`Caught Validation Error for ${req.path}:`, err.fields);
      return res.status(422).json({
        message: 'Validation Failed',
        details: err?.fields,
      });
    }
    if (err instanceof Error) {
      // Log rather than swallowing silently, otherwise difficult to debug.
      console.warn(`${req.method} ${req.path}:`, err);

      return res.status(500).json({
        message: 'Internal Server Error',
      });
    }

    next();
  });
}

function registerDocs(userStateMachineApi: object | undefined): void {
  const swaggerUiPath = path.resolve(__dirname) + '/swagger-ui';
  const swaggerServer = [
    swaggerUi.serve[0],
    // the default swaggerUi.serve points to the root of the `pkg` build from standalone
    // there is no way to override the path, so we instead just add a new path
    // that we manually added in the standalone build that contains the swagger-ui
    // this isn't ideal as it bloats the executable by 10MB
    express.static(swaggerUiPath, {}),
  ];
  const openApi = getOpenApiJson(userStateMachineApi);
  server.use('/docs', swaggerServer, swaggerUi.setup(openApi, { explorer: false }));
}
export { server, wsServer, startServer, registerDocs, registerValidationErrorHandler };
