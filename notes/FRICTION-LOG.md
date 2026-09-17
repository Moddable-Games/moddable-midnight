# Friction log

Running record of where Midnight's developer tooling helped, guessed or failed
while building this proof of concept. Each entry: what happened, what it cost,
and the fix worth suggesting.

## Findings before writing any code

### 1. The documented Kapa MCP endpoint returns 404

Docs (`/ai-integration/kapa-mcp-server`) give the command:

```
claude mcp add --transport http midnight https://midnight.mcp.kapa.ai
```

Probing that host on 2026-09-17: `GET /` returns 405, and `/mcp`, `/sse`,
`/mcp/sse`, `/messages`, `/v1/mcp` all return 404. A POST of a JSON-RPC
`initialize` to `/mcp` and `/sse` also returns 404.

Effect: one of the two official AI tools cannot be added by following the docs.

Suggested fix: correct the path in docs, or publish the working route and a
`GET /` health response that names it.

### 2. midnightntwrk.expert is hard for agents to read

The site answers differently by `Accept` header: browsers get a Vite SPA whose
content only exists after JavaScript runs; agents get the plugin marketplace
JSON, served as `text/html`.

- `llms.txt`, `robots.txt`, `sitemap.xml` and `.well-known/ai-plugin.json` all
  return 200 with the catch-all response rather than real files
- Unknown paths return 200, so nothing is distinguishable from a typo
- The marketplace JSON does not link to the Kapa MCP server, and the docs do not
  link to the marketplace manifest

Effect: the tooling built to make Midnight agent-buildable is itself hard for an
agent to discover or crawl. `docs.midnight.network/llms.txt` (179KB) shows
the standard the expert site could meet.

Suggested fix: serve a real `llms.txt` and `sitemap.xml`, return 404 for unknown
paths, send `application/json` for the manifest, and cross-link the two tools.

## During the build

<!-- Add entries as they happen: what was asked for, what the tooling produced,
what the compiler said, and how long the loop took. -->
