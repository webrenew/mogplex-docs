---
name: mogplex-auth
description: Verifies or establishes Mogplex CLI authentication before running other Mogplex commands. Use when `mogplex login status` shows no credential, a Mogplex command fails with an auth error, or the user asks to sign in, switch accounts, or inspect credential state.
---

# Mogplex auth preflight

Every action against Mogplex needs a credential. Run this skill first whenever another skill tells you to "handle auth" or when a command fails with an auth error.

## Resolution order (do not try to override this)

Mogplex picks credentials in a fixed order:

1. **Provider env var in the current shell.** If set, it wins — no matter what is stored on disk.

   | Provider | Env var |
   | --- | --- |
   | Mogplex | `MOGPLEX_API_KEY` |
   | Anthropic | `ANTHROPIC_API_KEY` |
   | OpenAI | `OPENAI_API_KEY` |
   | Google | `GOOGLE_GENERATIVE_AI_API_KEY` |
   | Groq | `GROQ_API_KEY` |
   | Mistral | `MISTRAL_API_KEY` |
   | DeepSeek | `DEEPSEEK_API_KEY` |
   | xAI | `XAI_API_KEY` |
   | Cohere | `COHERE_API_KEY` |
   | Vercel | `VERCEL_API_TOKEN` |

2. **Stored credentials** in `~/.mogplex/auth.json`.
3. **No credentials** → interactive prompt (TUI) or a clear failure in non-interactive contexts.

Env vars beat stored creds. Always.

## Check current state

```bash
mogplex login status
```

Read the output, do not read the file. The command prints a safe summary and never reveals secret material.

Possible outcomes:

| `login status` says | What it means |
| --- | --- |
| `mogplex` credential present | Account-backed login is active (unless an env var overrides it). |
| a provider entry (e.g. `openai`) | Direct provider credential stored locally. |
| nothing stored | No disk credential — will fall back to env vars, else fail. |

Then sanity-check env vars in the current process:

```bash
env | grep -E '^(MOGPLEX|ANTHROPIC|OPENAI|GOOGLE_GENERATIVE_AI|GROQ|MISTRAL|DEEPSEEK|XAI|COHERE|VERCEL)_' | sed 's/=.*/=<redacted>/'
```

Never print the full value.

## Establish auth

### Preferred: account-backed browser login

The user runs this themselves — it opens a browser flow:

```bash
mogplex login
```

Do not attempt to drive the browser. Hand off to the user with exactly this instruction and wait for them to confirm it completed. Then re-check:

```bash
mogplex login status
```

Account-backed login unlocks synced model catalog, remote MCP server definitions, and hosted model access.

### Alternative: direct provider env var

For CI, ephemeral shells, or when the user does not want credentials written to disk:

```bash
export OPENAI_API_KEY=sk-...
mogplex exec "..."
```

Do not write keys into shell rc files on the user's behalf. Suggest it; let them do it.

### Alternative: stored provider key

Inside a live session, the user runs `/login <provider>` and pastes the key into the TUI. You cannot do this for them.

## Troubleshooting decision tree

```
auth error from a mogplex command
        │
        ▼
run `mogplex login status`
        │
        ▼
credential shown?  ── no ──► is an env var set for any provider?
    │                              │
    │                              yes ──► env var may be malformed; print a
    │                              │        redacted preview and ask user to verify
    │                              no  ──► ask user to run `mogplex login`
    │
    yes
    │
    ▼
does the session use that credential?
        │
        no  ──► an env var is overriding it; unset it or clear it from the
        │        current shell, then retry
        yes ──► account login succeeded but hosted account lacks model access;
                direct user to Mogplex web settings to add a provider key
```

## Signing out

```bash
# Inside a live session only:
/logout
```

Three things to remember:

- Env vars still win on the next session.
- The current process may still hold the old adapter; restart for certainty.
- Logging out of Mogplex clears hosted state — model catalog sync and remote MCP definitions vanish locally.

Always confirm with the user before suggesting `/logout`.

## Hard rules

- Never read `~/.mogplex/auth.json` directly.
- Never echo a raw key, even from env. Redact.
- Never write a key into a shell config file without explicit user consent.
- Never advise the user to put a key into a JSON config for another agent host when `mogplex login` would give them an account-backed token instead.

## See also

- [using-mogplex-cli](../using-mogplex-cli/SKILL.md)
- [Authentication guide](https://mogplex.dev/cli/guides/authentication)
