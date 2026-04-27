# Mogplex Agent Skills

Skills that teach external agents (Claude Code, Claude Agent SDK, Cursor, opencode) how to **guide a user through the Mogplex CLI cockpit**.

The current Mogplex CLI is interactive-only — there is no headless `exec` surface for an agent to call. These skills are guidance skills: they teach an agent to recommend the right slash command, walk a user through the in-app login screen, and help author repo-local config.

Each subdirectory is a single skill with a `SKILL.md` using standard YAML frontmatter (`name`, `description`). The format is consumable by:

- Claude Code (drop into `~/.claude/skills/` or a plugin's `skills/` dir)
- Claude Agent SDK (pass the skill dir to the SDK's skill loader)
- Cursor (copy contents into project rules)
- opencode / custom agents (load `SKILL.md` as a system prompt snippet)

## Skills in this directory

| Skill | When it applies |
| --- | --- |
| [`using-mogplex-cli`](./using-mogplex-cli) | Umbrella skill. The user wants help driving the Mogplex cockpit. |
| [`mogplex-slash`](./mogplex-slash) | Recommend the right slash command for a user's intent. |
| [`mogplex-auth`](./mogplex-auth) | Walk the user through the in-app login flow and troubleshoot credentials. |

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
  prompt: "How do I switch models in Mogplex?",
  options: {
    settingSources: ["user", "project"],
    // Skills loaded from settingSources' `skills/` dirs automatically
  },
});
```

## Design principles

- **Guidance, not execution.** Skills tell the user what to do in the cockpit. They do not try to drive the TUI.
- **Auth handoff.** Auth lives in the cockpit's login screen. Skills recommend `/login` and explain env-var precedence.
- **Repo-local config is fair game.** Skills can help the user author `AGENTS.md` and `~/.mogplex/projects/<repo-slug>/permissions.json` — those are plain files.
- **No silent writes.** Anything that mutates user-owned state is recommended to the user, not done by the agent.
