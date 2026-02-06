# ROUTER.md - Model Selection Logic

When a user request matches a specific domain, **delegate** the task to the specialized model.

## 🚦 Routing Table

| Domain | Keywords | Model Alias | Action |
|--------|----------|-------------|--------|
| **Coding** | code, script, function, debug, refactor, API, error, bug | `gpt` | Spawn sub-agent |
| **Heavy Coding** | architect, rewrite, migration, legacy code, enterprise, full stack | `sonnet` | Spawn sub-agent |
| **Planning** | plan, strategy, roadmap, architecture, brainstorm, design | `ag-opus` | Spawn sub-agent |
| **Research** | research, search, find info, investigate, compare | `google-antigravity/gemini-3-flash` | Use directly (Native) |
| **Quick** | quick, simple, one-liner, what is, define | `cheap` | Use directly or sub-agent |
| **Email** | email, mail, inbox, send message to | `agent-mail` | Use `agent-mail` skill |
| **VM/Platform** | vm, container, server, host, expose, port | `exe-platform` | Use `exe-platform` skill |

## 🛠️ How to Delegate

When routing to a sub-agent, use `sessions_spawn`:

```json
{
  "task": "<User's request>",
  "model": "<Model Alias>",
  "thinking": "high" // Use 'high' for Opus/Codex-Pro, 'low' for others
}
```

## ⚡ Exceptions

- If the request is trivial (e.g., "fix this typo"), handle it natively.
- If the user explicitly sets `model=...`, obey the user.
