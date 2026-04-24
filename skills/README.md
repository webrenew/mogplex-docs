# Mogplex Agent Skills

Skills that teach external agents how to drive a user's Mogplex workspace through the `mogplex` CLI — a drop-in substitute when a Mogplex MCP server is not available.

Each subdirectory is a single skill with a `SKILL.md` using standard YAML frontmatter (`name`, `description`). The format is consumable by:

- Claude Code (drop into `~/.claude/skills/` or a plugin's `skills/` dir)
- Claude Agent SDK (pass the skill dir to the SDK's skill loader)
- Cursor (copy contents into project rules)
- opencode / custom agents (load `SKILL.md` as a system prompt snippet)

## Skills in this directory

| Skill | When it applies |
| --- | --- |
| [`using-mogplex-cli`](./using-mogplex-cli) | Umbrella skill. The agent needs to interact with the user's Mogplex workspace and no Mogplex MCP is configured. |
| [`mogplex-exec`](./mogplex-exec) | Run a one-off Mogplex task non-interactively and consume structured output. |
| [`mogplex-slash`](./mogplex-slash) | Discover and execute Mogplex slash commands from the shell. |
| [`mogplex-auth`](./mogplex-auth) | Verify or establish Mogplex authentication before running other commands. |

## Install into Claude Code

Run from the `mogplex-docs` repo root (the directory that contains this `skills/` folder):

```bash
# Global install
mkdir -p ~/.claude/skills && cp -R skills/* ~/.claude/skills/

# Or per-project
mkdir -p .claude/skills && cp -R skills/* .claude/skills/
```

If you pulled the skills tree with `npx degit webrenew/mogplex-docs/skills mogplex-skills` instead (so there is no outer `skills/` directory):

```bash
# Global
mkdir -p ~/.claude/skills && cp -R mogplex-skills/* ~/.claude/skills/

# Or per-project (run from your project root)
mkdir -p .claude/skills && cp -R mogplex-skills/* .claude/skills/
```

## Install into an Agent SDK app

```ts
import { query } from "@anthropic-ai/claude-agent-sdk";

const response = query({
  prompt: "Run /status against my Mogplex workspace",
  options: {
    settingSources: ["user", "project"],
    // Skills loaded from settingSources' `skills/` dirs automatically
  },
});
```

## Design principles

- **CLI-first.** Skills assume `mogplex` is on PATH. They never instruct the agent to read or write credential files directly.
- **Auth preflight.** Every action-performing skill tells the agent to run `mogplex login status` first and surface a clear error if unauthenticated.
- **Structured output.** Skills prefer `--json` / `--jsonl` output for anything the agent has to parse.
- **No silent writes.** Any command that mutates state is called out explicitly so the agent asks the user before running it.
