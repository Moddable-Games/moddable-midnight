// Midnight City control API over plain fetch (the community helper needs Node and a
// filesystem, which Workers do not have). Shapes match agent-skill/scripts/mcity-control.mjs.
//
// Auth: the account token opens sessions and lists threads; the lease token submits
// actions. Skill reads (inventory, needs, events) need no auth.

// Free plan allows 50 subrequests per invocation, and KV calls count too; stay clear of it.
// KV and Workers AI calls are charged against the same budget with charge().
export const SUBREQUEST_BUDGET = 46;

export function createClient(env) {
  const base = env.MCITY_OBSERVER_URL;
  const accountToken = env.MCITY_API_TOKEN;
  let used = 0;

  async function request(route, init = {}) {
    if (used >= SUBREQUEST_BUDGET) throw new Error("subrequest budget exhausted");
    used += 1;
    const response = await fetch(base + route, init);
    const text = await response.text();
    let body = null;
    try { body = text ? JSON.parse(text) : null; } catch { body = text; }
    if (!response.ok) {
      throw new Error(`${response.status} ${route.split("?")[0]} ${String(text).slice(0, 200)}`);
    }
    return body;
  }

  const bearer = (token) => ({ Authorization: `Bearer ${token}`, "Content-Type": "application/json" });
  const agentPath = (agentId, endpoint) => `/api/skill/agents/${encodeURIComponent(agentId)}/${endpoint}`;

  const postAction = (lease, action) => request("/api/actions", {
    method: "POST",
    headers: bearer(lease.token),
    body: JSON.stringify({ ...action, agentId: lease.agentId }),
  });

  // The event feed keeps only a few seconds of history, so a failure must be caught
  // right after the action. Returns the failure reason, or null if none was seen.
  async function actAndCheck(lease, action, polls = 2) {
    const since = Date.now() - 2000; // tolerate small clock skew with the server
    await postAction(lease, action);
    for (let i = 0; i < polls; i++) {
      await new Promise((resolve) => setTimeout(resolve, 1200));
      const events = (await request(agentPath(lease.agentId, "recent-events?limit=50")))?.recentEvents ?? [];
      const failed = events.find(({ emittedAt, payload: p }) =>
        emittedAt >= since &&
        p?.kind === "action_failed" &&
        p.agentId === lease.agentId &&
        p.actionKind === action.kind &&
        (action.kind !== "speak" || p.targetAgentId === action.targetAgentId));
      if (failed) return failed.payload.reason ?? `${action.kind} failed`;
    }
    return null;
  }

  return {
    remaining: () => SUBREQUEST_BUDGET - used,
    charge: (n = 1) => { used += n; },
    actAndCheck,

    // A fresh lease each tick; it replaces the previous one, so no release is needed.
    openSession: (agentId) => request("/api/local-control/session", {
      method: "POST",
      headers: bearer(accountToken),
      body: JSON.stringify({ agentId, clientInstanceId: `mcity-direct:${agentId}:midnight-city-crew`, modelId: null }),
    }),

    read: (agentId, endpoint) => request(agentPath(agentId, endpoint)),

    merchants: async () => (await request("/api/skill/merchants"))?.merchants ?? [],

    threads: async (agentId) =>
      (await request(`/api/agents/${encodeURIComponent(agentId)}/threads?limit=50`, {
        headers: bearer(accountToken),
      }))?.threads ?? [],
  };
}
