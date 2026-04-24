---
name: mogplex-slash
description: Discovers and runs Mogplex slash commands from the shell via `mogplex slash list` and `mogplex exec "/..."`. Use when the user asks for a slash command like /status, /mcp, /skills, /sandbox, or /logs, or when a project stores commands in `.agents/commands/` or `~/.mogplex/commands/`.
---

# Mogplex slash commands

Slash commands are Mogplex's control surface — session control, local tooling, project scripts. They are NOT prompts sent to a model; they are registered actions.

## Preflight

```bash
mogplex login status
```

Most slash commands require auth. If unauthenticated, resolve that first (see `mogplex-auth`).

## Discover the registry

Always inspect what actually exists in the current environment before depending on a command:

```bash
mogplex slash list --json
```

Why JSON: the registry is machine-readable there, with command metadata (name, description, scope). Do not hand-parse the text form.

The registry includes three sources:

1. **Built-ins** shipped with the CLI (`/status`, `/mcp`, `/skills`, `/sandbox`, `/logs`, `/model`, `/approvals`, `/compact`, `/clear`, `/init`, `/review`, `/config`, `/login`, `/logout`, `/quit`, `/help`).
2. **Project commands** from `.agents/commands/*.md` in the current repo.
3. **User commands** from `~/.mogplex/commands/*.md`.

## Execute a slash command

Use `exec` — the `slash` top-level command is only for inspection:

```bash
mogplex exec "/status"
mogplex exec "/mcp"
mogplex exec "/config list"
mogplex exec "/skills list"
mogplex exec "/logs --lines=100"
mogplex exec "/sandbox peek"
```

Pass `--json` when you need to parse the output:

```bash
mogplex exec --json "/status"
mogplex exec --json "/skills list"
```

## High-value built-ins for agents

| Command | Purpose | Safe to run without asking? |
| --- | --- | --- |
| `/status` | Model, usage, approval mode, cwd | yes, read-only |
| `/skills list` | Installed Mogplex skills | yes, read-only |
| `/mcp` | Configured MCP servers | yes, read-only |
| `/config list` | Current config values | yes, read-only |
| `/logs --lines=N` | Recent session errors | yes, logs are redacted |
| `/sandbox peek` | Inspect sandbox state | yes, read-only |
| `/config set …` | Mutate config | no, ask user first |
| `/sandbox kill` | Destroy sandbox state | no, ask user first |
| `/logout` | Remove stored credentials | no, ask user first |

## Project-local slash commands

When the user mentions a command you do not recognize (e.g. `/deploy-preview`), it is likely project-local. Check:

```bash
ls .agents/commands/ 2>/dev/null
ls ~/.mogplex/commands/ 2>/dev/null
```

Each `.md` file in those directories registers a slash command. Read the file to understand what it does before executing it.

## If a command is missing

Work through this checklist before telling the user a command does not exist:

1. `mogplex slash list --json` to confirm the registry in the current runtime.
2. Check `.agents/commands/` for a project-scoped override or addition.
3. Check `~/.mogplex/commands/` for a personal command.
4. The capability may exist only as a top-level command (e.g. `mogplex login`) rather than a slash command. Run `mogplex --help`.
5. The capability may be listed in `--help` but not yet implemented as a standalone subcommand. Try the slash form inside `exec "/..."`.

## Common mistakes

- Running `mogplex slash /status` (it does not execute slash commands).
- Assuming every `/` item you see in a doc is available in the user's build — always confirm with `slash list --json`.
- Running mutating slash commands (`/config set`, `/sandbox kill`, `/logout`) without user confirmation.

## See also

- [mogplex-exec](../mogplex-exec/SKILL.md) — the execution path for slash commands
- [mogplex-auth](../mogplex-auth/SKILL.md) — auth preflight
- [Slash commands guide](https://mogplex.dev/cli/guides/slash-commands)
