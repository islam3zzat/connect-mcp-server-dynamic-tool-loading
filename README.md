# Remote MCP Server Template [Early version]

This project provides a template for building a **Model Context Protocol (MCP) server** for commercetools Composable Commerce. The MCP server can be hosted on [commercetools Connect](https://docs.commercetools.com/connect/) and is designed to be easily configurable and extensible for various commerce use cases.

## Overview

The MCP server acts as a servicable channel to AI agents that enables secure, flexible, and context-aware access to commercetools APIs. It supports both public and private authentication modes and allows fine-grained control over available tools and actions.

## Features

- **Configurable authentication:** Supports both `client_credentials` and `auth_token` authentication.
- **Tool-based access control:** Enable or restrict API actions using the `TOOLS` configuration.
- **Admin mode:** Optionally allow resource creation and editing.
- **Easy deployment:** Ready to be hosted on commercetools Connect.

## Configuration

Configuration is managed via the `connect.yaml` file. Below is an explanation of each field:

### `standardConfiguration`

| Key        | Description                                                                                                   | Default             | Required |
|------------|--------------------------------------------------------------------------------------------------------------|---------------------|----------|
| `AUTH_TYPE`| Use `client_credentials` for public MCP with configured API client, or `auth_token` for Bearer token access. | `client_credentials`| No       |
| `AUTH_URL` | commercetools Composable Commerce Auth URL.                                                                  |                     | Yes      |
| `API_URL`  | commercetools Composable Commerce API URL.                                                                   |                     | Yes      |
| `TOOLS`    | Comma-separated list of tools ([see documentation](https://docs.commercetools.com/sdk/commerce-mcp/essentials-mcp#individual-tools)). Use `all` for all tools. | `all`               | Yes      |
| `IS_ADMIN` | Set to `true` to allow resource creation and editing. Review your use case before enabling.                  | `false`             | No       |

### `securedConfiguration`

| Key           | Description                                         | Required |
|---------------|-----------------------------------------------------|----------|
| `PROJECT_KEY` | commercetools Composable Commerce project key.      | Yes      |
| `CLIENT_ID`   | commercetools Composable Commerce client ID.        | Yes      |
| `CLIENT_SECRET`| commercetools Composable Commerce client secret.   | Yes      |

## Authentication

- **Public Mode (`client_credentials`):**  
  Uses the configured API client credentials for authentication.
- **Private Mode (`auth_token`):**  
  Requires an `Authorization` header with a Bearer token in each request.

## Tool Configuration

The `TOOLS` field controls which API actions are available.

- Use a comma-separated list (e.g., `products.read,cart.create`).
- Use `all` to enable all available tools.
- Refer to the [MCP Essentials documentation](https://docs.commercetools.com/sdk/commerce-mcp/essentials-mcp#individual-tools) for the full list.

## How to develop

1. **Clone the repository:**
   ```bash
   git clone <your-repo-url>
   cd composable-commerce-remote-mcp
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure your environment:**
   - Edit `connect.yaml` to set your project credentials and desired configuration.
   - Optionally, use a `.env` file for local development.

4. **Run the MCP server locally:**
   ```bash
   npm run build
   npm start
   ```

5. **Deploy to Connect:**
   - Package your service and deploy using commercetools Connect documentation.

## Support

For questions or issues, please contact the [commercetools support team](http://support.commercetools.com/).

## References

- [commercetools Connect Documentation](https://docs.commercetools.com/connect/)
- [MCP Essentials Documentation](https://docs.commercetools.com/sdk/commerce-mcp/essentials-mcp#individual-tools)
