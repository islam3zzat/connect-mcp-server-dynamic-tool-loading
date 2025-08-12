import * as dotenv from 'dotenv';
dotenv.config();

import {
  CommercetoolsAgentEssentials,
  CommercetoolsAgentEssentialsStreamable,
  AuthConfig,
  Configuration,
  AvailableNamespaces
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
  stateless?: boolean;
  accessToken?: string;
  authType?: 'client_credentials' | 'auth_token';
  tools?: any;
  isAdmin?: boolean;
};

const env: EnvVars = {
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  authUrl: process.env.AUTH_URL,
  projectKey: process.env.PROJECT_KEY,
  apiUrl: process.env.API_URL,
  stateless: process.env.STATELESS === 'true',
  accessToken: process.env.ACCESS_TOKEN,
  authType: process.env.AUTH_TYPE as EnvVars['authType'],
  tools: process.env.TOOLS,
  isAdmin: process.env.IS_ADMIN === 'true'
};

const ACCEPTED_TOOLS = [
  'business-unit.read',
  'business-unit.create',
  'business-unit.update',
  'products.read',
  'products.create',
  'products.update',
  'project.read',
  'product-search.read',
  'category.read',
  'category.create',
  'category.update',
  'channel.read',
  'channel.create',
  'channel.update',
  'product-selection.read',
  'product-selection.create',
  'product-selection.update',
  'order.read',
  'order.create',
  'order.update',
  'cart.read',
  'cart.create',
  'cart.update',
  'customer.create',
  'customer.read',
  'customer.update',
  'customer-group.read',
  'customer-group.create',
  'customer-group.update',
  'quote.read',
  'quote.create',
  'quote.update',
  'quote-request.read',
  'quote-request.create',
  'quote-request.update',
  'staged-quote.read',
  'staged-quote.create',
  'staged-quote.update',
  'standalone-price.read',
  'standalone-price.create',
  'standalone-price.update',
  'product-discount.read',
  'product-discount.create',
  'product-discount.update',
  'cart-discount.read',
  'cart-discount.create',
  'cart-discount.update',
  'discount-code.read',
  'discount-code.create',
  'discount-code.update',
  'product-type.read',
  'product-type.create',
  'product-type.update',
  'bulk.create',
  'bulk.update',
  'inventory.read',
  'inventory.create',
  'inventory.update',
  'store.read',
  'store.create',
  'store.update',
];

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

  const selectedTools = env.tools!;
  const configuration: Configuration = {
    actions: {},
    context: {
      isAdmin: env.isAdmin
    },
  };

  if (selectedTools[0] === 'all') {
    ACCEPTED_TOOLS.forEach((tool) => {
      if (!configuration.actions) {
        configuration.actions = {};
      }
      const [namespace, action] = tool.split('.');

      configuration.actions[namespace as AvailableNamespaces] = {
        ...configuration.actions[namespace as AvailableNamespaces],
        [action]: true,
      };
    });
  } else if (selectedTools[0] === 'all.read') {
    ACCEPTED_TOOLS.forEach((tool) => {
      if (!configuration.actions) {
        configuration.actions = {};
      }
      const [namespace, action] = tool.split('.');
      if (action === 'read') {
        configuration.actions[namespace as AvailableNamespaces] = {
          ...configuration.actions[namespace as AvailableNamespaces],
          [action]: true,
        };
      }
    });
  } else {
    selectedTools.forEach((tool: any) => {
      if (!configuration.actions) {
        configuration.actions = {};
      }
      const [namespace, action] = tool.split('.');
      configuration.actions[namespace as AvailableNamespaces] = {
        ...(configuration.actions[namespace as AvailableNamespaces] || {}),
        [action]: true,
      };
    });
  }


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
