---
name: using-mogplex-cli
description: Umbrella skill for driving a user's Mogplex workspace through the `mogplex` CLI when no Mogplex MCP server is available. Use when the user asks to run a Mogplex workspace action, execute a Mogplex slash command, or use Mogplex skills, agents, or memories from outside the Mogplex web app. Also triggers on mentions of "mogplex", ".agents/commands/", or "~/.mogplex/".
---

# Using the Mogplex CLI

Mogplex exposes its workspace, slash-command registry, agent roster, skills, and memories through a local CLI (`mogplex`). When a Mogplex MCP server is not available, use the CLI as the integration surface instead of asking the user to paste tokens or configure servers manually.

## When to use this skill

- The user references their Mogplex account, workspace, agents, skills, or memories.
- The user asks you to run a `/slash` command that belongs to Mogplex (`/status`, `/mcp`, `/skills`, `/sandbox`, `/logs`, etc.).
- The user asks you to run a project-local slash command stored in `.agents/commands/` or a personal one in `~/.mogplex/commands/`.
- The task would normally be an MCP tool call against Mogplex but no such MCP is connected.

## Preflight — always run first

Before any command that talks to Mogplex, verify the CLI is installed and authenticated:

```bash
command -v mogplex >/dev/null || echo "mogplex CLI not installed"
mogplex login status
```

If `login status` shows no stored credential and no provider env var is set, stop and follow [`mogplex-auth`](../mogplex-auth/SKILL.md) before continuing. Do not attempt to edit `~/.mogplex/auth.json` directly.

## Core command map

| Intent | Command | Reference skill |
| --- | --- | --- |
| Run a one-off prompt, get a final result | `mogplex exec "<prompt>"` | [mogplex-exec](../mogplex-exec/SKILL.md) |
| Get machine-readable output | `mogplex exec --json "<prompt>"` | [mogplex-exec](../mogplex-exec/SKILL.md) |
| List available slash commands | `mogplex slash list --json` | [mogplex-slash](../mogplex-slash/SKILL.md) |
| Run a slash command non-interactively | `mogplex exec "/status"` | [mogplex-slash](../mogplex-slash/SKILL.md) |
| Check auth state | `mogplex login status` | [mogplex-auth](../mogplex-auth/SKILL.md) |
| Start a live session | `mogplex` | — (hand off to user) |

## Decision flow

```
user wants Mogplex action
        │
        ▼
is it conversational / multi-turn? ── yes ──► tell user to run `mogplex` themselves;
        │                                      do not try to drive a TUI
        no
        ▼
is it a slash command (/foo)? ── yes ──► mogplex exec "/foo"   (see mogplex-slash)
        │
        no
        ▼
is it a one-off prompt?      ── yes ──► mogplex exec --json "..."   (see mogplex-exec)
```

## Reading output

- Text output is for humans. Do not parse it.
- Use `--json` for a single final object, `--jsonl` for streaming events.
- Top-level flags `--output text|json|jsonl` also work. Pick one and stick with it per invocation.

## Known limits

- `mogplex exec` cannot hold a conversation. If the user says "then do X", run a new `exec` with the follow-up phrased as a complete task, or hand off to an interactive session.
- The `slash` top-level command currently only lists the registry. Execution goes through `exec "/..."`.
- Some capabilities show up in `mogplex --help` but are not real top-level commands yet; they exist only as slash commands. Trust `mogplex slash list --json` over help text.
- The agent cannot read `~/.mogplex/auth.json`. All credential state must be inspected via `mogplex login status`.

## Safety

- Any slash command that mutates state (`/config set`, `/logout`, `/sandbox kill`) should be confirmed with the user before running. Mogplex does not sandbox the CLI itself.
- Prefer provider env vars (`OPENAI_API_KEY`, `ANTHROPIC_API_KEY`, `MOGPLEX_API_KEY`, …) over writing credentials to disk in CI contexts.
- Logs at `~/.mogplex/logs/<session-id>.jsonl` redact secrets by default. Do not export or share them without reviewing.

## See also

- [Exec mode guide](https://mogplex.dev/cli/guides/exec-mode)
- [Slash commands guide](https://mogplex.dev/cli/guides/slash-commands)
- [Authentication guide](https://mogplex.dev/cli/guides/authentication)
