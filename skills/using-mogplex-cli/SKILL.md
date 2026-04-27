---
name: using-mogplex-cli
description: Umbrella skill for guiding a user through the Mogplex CLI cockpit when no Mogplex MCP server is available. Use when the user asks how to start a run, attach to a run, switch models, manage approvals, or configure permissions in the Mogplex CLI. Also triggers on mentions of "mogplex", "AGENTS.md", or "~/.mogplex/".
---

# Using the Mogplex CLI

The Mogplex CLI is an interactive cockpit. There is no headless `exec` surface — agents cannot drive the TUI directly. Use this skill to **advise** the user on what to run, what to type in the composer, and what to put in repo-local config files.

## When to use this skill

- The user references their Mogplex account, runs, agents, MCP, memory, approvals, or cost.
- The user asks how to do something in the Mogplex cockpit.
- The user wants to author `AGENTS.md` or per-project `permissions.json`.

## Preflight

Confirm the CLI is installed before recommending it:

```bash
command -v mogplex >/dev/null 2>&1 || echo "mogplex CLI not installed"
```

If it's missing, point the user at https://www.mogplex.com/cli/installation.

You **cannot** check auth state from outside the cockpit — there is no `mogplex login status` subcommand. Tell the user that the cockpit will surface the login screen on first launch if no credential is stored.

## Core guidance map

| Intent | What to tell the user |
| --- | --- |
| Start a run | Launch `mogplex`, then type `/run <task>` in the composer. |
| Attach to an in-flight run | `mogplex --attach <runId>` |
| Switch models | Type `/model` in the composer to open the Model Picker drawer. |
| Approve / reject pending tool calls | The Approval drawer surfaces them automatically; the user clicks Approve or Reject. |
| Switch permission modes | Type `/permissions auto` or `/permissions approval` in the composer. |
| Inspect cost | Type `/cost` to open the Cost drawer. |
| Export the run | Type `/export` to open the Run Export drawer. |
| Quit | Type `/quit`, or double-tap Ctrl+C within 1500ms. |

For the full slash list see https://www.mogplex.com/cli/commands.

## Decision flow

```
user wants Mogplex action
        │
        ▼
is the cockpit already open in the user's terminal?
        │
        no  ──► tell them to run `mogplex` (or `mogplex --attach <runId>`)
        yes
        │
        ▼
is it a slash command? ── yes ──► tell user to type "/<command>" in the composer
        │
        no
        ▼
is it a config / file change?
        │
        yes ──► help them author the file (AGENTS.md, permissions.json)
        no  ──► describe the workflow in the cockpit (panels, drawers)
```

## What you cannot do

- Drive the TUI from a script. The CLI is interactive-only.
- Read auth state from outside the cockpit. There is no `login status` subcommand; only the cockpit knows.
- Mutate `~/.mogplex/auth.json` directly. Tell the user to use `/login` or `/logout` in the cockpit.
- Run a slash command headlessly. Slash commands only execute inside the running cockpit.

## What you **can** do

- Author `AGENTS.md` at the repo root with stable repo guidance (build commands, conventions, layout).
- Author `~/.mogplex/projects/<repo-slug>/permissions.json` with `allow` / `deny` / `ask` rules — see https://www.mogplex.com/cli/concepts/permissions for the schema.
- Recommend env-var escape hatches (`MOGPLEX_TRANSPORT`, `MOGPLEX_ATTACH_RUN_ID`, provider keys) — see https://www.mogplex.com/cli/guides/configuration-and-flags.

## Safety

- Confirm with the user before authoring or modifying any file under `~/.mogplex/` — those affect every Mogplex run on the machine.
- Never write a key into a shell rc file on the user's behalf.
- Recommend `/permissions approval` (the default) over `/permissions auto` unless the user explicitly opts into unattended runs.

## See also

- [mogplex-slash](../mogplex-slash/SKILL.md) — recommending slash commands
- [mogplex-auth](../mogplex-auth/SKILL.md) — guiding the login flow
- [Slash Commands guide](https://www.mogplex.com/cli/guides/slash-commands)
