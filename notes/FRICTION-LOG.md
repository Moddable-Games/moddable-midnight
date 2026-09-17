# Friction log

Running record of where Midnight's developer tooling helped, guessed or failed
while building this proof of concept. Each entry: what happened, what it cost,
and the fix worth suggesting.

## Findings before writing any code

Probed and, where an early conclusion turned out to be wrong, corrected before it
reached anyone. Evidence over impressions.

### 1. The Kapa MCP server needs a sign-in the docs do not mention

Docs (`/ai-integration/kapa-mcp-server`) give the command:

```
claude mcp add --transport http midnight https://midnight.mcp.kapa.ai
```

and state no API key is required. Probing on 2026-09-17:

- `GET https://midnight.mcp.kapa.ai/` returns 405
- `POST /` with a JSON-RPC `initialize` returns **401 `invalid_token`,
  "Authentication required"**
- `/.well-known/oauth-protected-resource` returns 200 and names the authorization
  server `https://mcp.kapa.ai/auth/public`, scope `openid`
- `/mcp`, `/sse`, `/messages` and `/v1/mcp` all return 404

So the server is healthy and expects an OAuth flow. A first-time reader who
tries the plain URL, or an agent probing the usual MCP paths, meets a 401 or a
404 with nothing pointing at the sign-in step.

Suggested fix: say in the docs that the first connection opens a browser sign-in,
and note what to do when it does not (headless machines, CI). A short
troubleshooting line would remove the guesswork.

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

### 3. Install guide pins an older compiler than `compact update` installs

`/getting-started/installation.md` says:

```
compact update 0.31.1
```

Running `compact update` with no argument on 2026-09-17 installed **0.34.0** and
set it as default. Toolchain `compact 0.5.2`.

Effect: a reader following the guide literally pins a version three releases
behind, and an agent reading the same page will suggest it.

Suggested fix: drop the pinned version from the guide, or mark it as an example
and point to `compact update` for the current release.

### 4. The skills shape output, not just knowledge (positive)

Running `/midnight-expert:doctor` and `/midnight-tooling:doctor` returned a
health report that was genuinely good: status vocabulary from the check scripts
(`pass`, `warn`, `critical`, `info`), a defined badge mapping, table layouts and
section headings, all specified in the skill files rather than left to the
agent. The result read like a product feature, not a chat response.

Two things stood out:

- Once that style was established, it carried across the rest of the session.
  The agent kept the same reporting shape for later output, so the plugins set a
  house style rather than formatting one command.
- The formatting rules did some of the thinking: "omit sections where everything
  passes", "re-run only the checks that failed", "show the report, never the raw
  bash output". That is process encoded as instructions, and it made the answer
  shorter and more useful.

**Question worth asking the team:** how much of Midnight Expert's value is
knowledge (Compact syntax, SDK detail, verification) and how much is enforced
process (report shape, fix-then-verify loops, what not to show)? The second kind
seems to travel further than expected, and it is cheaper to maintain than
reference content that ages with every release.

## During the build

<!-- Add entries as they happen: what was asked for, what the tooling produced,
what the compiler said, and how long the loop took. -->
