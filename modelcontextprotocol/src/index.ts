import * as dotenv from 'dotenv';
dotenv.config();

import {
  CommercetoolsAgentEssentials,
  CommercetoolsAgentEssentialsStreamable,
  AuthConfig,
} from '@commercetools/agent-essentials/modelcontextprotocol';

import express, { Express } from 'express';
import bodyParser from 'body-parser';
import { logger } from './utils/logger.utils';

type EnvVars = {
  clientId?: string;
  clientSecret?: string;
  authUrl?: string;
  projectKey?: string;
  apiUrl?: string;
  remote?: boolean;
  stateless?: boolean;
  port?: number;
  accessToken?: string;
  authType?: 'client_credentials' | 'auth_token';
};

const env: EnvVars = {
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  authUrl: process.env.AUTH_URL,
  projectKey: process.env.PROJECT_KEY,
  apiUrl: process.env.API_URL,
  remote: process.env.REMOTE === 'true',
  stateless: process.env.STATELESS === 'true',
  port: Number(process.env.PORT) || 8080,
  accessToken: process.env.ACCESS_TOKEN,
  authType: process.env.AUTH_TYPE as EnvVars['authType'],
};

// Create auth config
const getAuthConfig = (env: EnvVars): AuthConfig => {
  const baseConfig = {
    authUrl: env.authUrl!,
    projectKey: env.projectKey!,
    apiUrl: env.apiUrl!,
  };

  switch (env.authType) {
    case 'client_credentials':
      return {
        type: 'client_credentials',
        clientId: env.clientId!,
        clientSecret: env.clientSecret!,
        ...baseConfig,
      };
    case 'auth_token':
      return {
        type: 'auth_token',
        accessToken: env.accessToken!,
        ...baseConfig,
      };
    default:
      throw new Error(`Unsupported auth type: ${env.authType}`);
  }
};

// Initialize Express
const app: Express = express();
app.disable('x-powered-by');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Create MCP server
const agentServer = new CommercetoolsAgentEssentials({
  authConfig: getAuthConfig(env),
  configuration: {
    actions: {
      products: { read: true },
      cart: { read: true, create: true, update: true },
    },
  },
});

// Add streamable transport layer
const serverStreamable = new CommercetoolsAgentEssentialsStreamable({
  stateless: false, // make the MCP server stateless/stateful
  streamableHttpOptions: {
    sessionIdGenerator: undefined,
  },
  server: agentServer,
  app: app, // optional express app instance
});

// Start the server
serverStreamable.listen(8080, () => {
  logger.info(`⚡️ MCP server listening on port 8080}`);
});

export default serverStreamable;
