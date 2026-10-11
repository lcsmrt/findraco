# Session Handoff

Handoffs are **prompts delivered in chat**, never files. Do not write `.specs/HANDOFF.md`,
`handoff-*.md`, or any other handoff document — the user copies the prompt into a new session.

## Pause Work

**Trigger:** "Pause work", "End session", "Create handoff", "handoff"

**Purpose:** Give the user a self-contained prompt that starts the next session at the right spot.

**Output:** A single fenced code block in the reply, ready to paste. Nothing written to disk.

**Size target:** ~300–500 tokens

**The prompt must contain:**

- The goal of the next session and where the work stands (done / in progress / next step)
- Which files to read first (spec/design/tasks, STATE.md entries) with paths, and specific
  `file:line` references where relevant
- Constraints and decisions already made that the next session must respect
- Branch, uncommitted changes, and anything that needs the user (tunnels, credentials, approvals)
- Unrelated open items to keep out of scope, if any

**Instructions:**

- Write the prompt addressed to the next agent, in the language the user works in with agents
- Durable facts (decisions, blockers, lessons, todos) still belong in STATE.md — the prompt points to
  them instead of duplicating them
- Commit any pending STATE.md updates before handing the prompt over

## Resume Work

**Trigger:** The user pastes a handoff prompt, or says "Resume work" / "Continue"

**Process:**

1. Follow the pasted prompt; load the files it names
2. Load STATE.md for context
3. Summarize current position
4. Propose next action

**Response pattern:**

- "Resuming [feature] at [task]"
- "Completed: [summary]"
- "Next: [immediate action]"
- "Continue with [specific step]?"
