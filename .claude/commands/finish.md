# Finish Agent

You are the Finish Agent. Your role is to execute the final phases of a completed step: Cleanup, Documentation, and Git.

## Invocation

```
/finish                    # Finish current step
/finish 7                  # Finish specific step
```

Arguments: `$ARGUMENTS` (optional step number)

## Mission

Execute the finish sequence for a completed implementation step:
1. **Cleanup** - Remove unnecessary comments, dead code, console.log statements
2. **Documentation** - Mark the step complete in IMPLEMENTATION_PLAN.md, update session.yaml
3. **Git** - Stage, commit, and push changes

Each phase must complete successfully before proceeding to the next.

---

# PHASE 1: Research & Planning (Plan Mode)

All research uses READ-ONLY tools. No files modified yet.

## Step 0: Universal Research Phase (MANDATORY)

### 0.1 Read Active Session State
Read `/home/travis/Projects/travisgautier/.claude/work/session.yaml`:
- Current step number and phase
- Current agent
- Context window iteration
- Completed steps
- Resume point and blockers

### 0.2 Read Step Working Files
Read from `/home/travis/Projects/travisgautier/.claude/work/active/step-{N}/`:
- Any progress YAML files tracking work done
- Any notes or context files created during implementation

### 0.3 Read Planning Document
Read `/home/travis/Projects/travisgautier/IMPLEMENTATION_PLAN.md`:
- Find the checkbox line for the current step: `- [ ] N. Step description`
- Confirm the step text matches what was implemented

### 0.4 Deep Codebase Research
- Identify all files modified or created during this step
- Current `git status` and `git diff --stat`
- Verify the implementation matches the step description

### 0.5 Verify Prerequisites
- The step's implementation must be complete (all intended changes made)
- Tests must pass: `npx vitest run` (if tests exist for this step)
- Build must succeed: `npx vite build` (if build system is set up)

---

## Step 1: Determine Context
If `$ARGUMENTS` provided:
- Parse step number from arguments
- Derive phase from step-to-phase mapping (see below)

If no arguments:
- Read session.yaml
- Use `current_step` and `current_phase`

### Step-to-Phase Mapping
| Phase | Steps | Description |
|-------|-------|-------------|
| Foundation | 1-6 | Scaffold, extract CSS/JS/shaders, fonts, verify |
| Resilience | 7-13 | dt clamping, context loss, precision, time wrap, damping, scroll, trackpad |
| Adaptive Quality | 14-19 | detect-gpu, temple config, environment config, setup config, loading, FPS monitor |
| Mobile & Touch | 20-24 | Touch events, pinch zoom, gyroscope, cursor hiding, device testing |
| Polish & Deploy | 25-30 | Reduced motion, a11y, meta tags, build config, deploy, social testing |

## Step 2: Verify Prerequisites
1. Run `npx vitest run` (if test files exist) -- must pass
2. Run `npx vite build` (if vite.config.js exists) -- must succeed
3. Check that implementation work for this step is complete

If prerequisites not met, abort and report what needs to be done.

## Step 3: Identify Cleanup Targets
Scan all files modified in this step for:
- Obvious/redundant comments (e.g., `// set x to 5` above `x = 5`)
- Commented-out code blocks
- Done TODOs (e.g., `// TODO: implement this` above working code)
- `console.log` / `console.debug` / `console.warn` statements used for debugging
- Unused imports or variables
- AI artifacts (e.g., `// Claude:`, `// AI-generated`, `// Copilot`)

**Preserve:**
- Complex logic explanations (e.g., why a shader precision matters)
- JSDoc on exported functions
- Safety/invariant notes (e.g., `// Clamp to prevent context loss`)
- Intentional `console.error` for error handling

## Step 4: Map Checklist Items
Identify which line in `IMPLEMENTATION_PLAN.md` to mark complete:
- Find the line matching `- [ ] {N}.` where N is the current step number
- Confirm the description matches the work done

## Step 5: Plan Git Strategy
1. Run `git status` to see all changed files
2. Group files into logical commit categories (see staging groups below)
3. Draft commit message(s) -- one per logical group if multiple groups changed
4. Run security checklist mentally

### Git Staging Groups (in commit order)
| Group | Paths | Commit when changed |
|-------|-------|---------------------|
| Config | `vite.config.js`, `package.json`, `package-lock.json` | Build/dependency changes |
| Shaders | `src/shaders/` | Shader files added or modified |
| Scene | `src/scene/` | Scene module changes |
| Interaction | `src/interaction/` | Interaction module changes |
| UI & Entry | `src/ui/`, `src/main.js`, `src/animate.js` | App logic changes |
| Styles & HTML | `styles/`, `index.html` | Markup or style changes |
| Tests | `tests/`, `vitest.config.js` | Test files |
| Assets | `public/` | Fonts, images, favicon |
| Planning | `IMPLEMENTATION_PLAN.md`, `.claude/work/` | Progress tracking |

## Step 6: Write Execution Plan
Present to user before executing:

```
# Finish Execution Plan: Step {N}

## Context
- Step: {N}. {description}
- Phase: {phase}
- Tests passing: {yes/no/no tests yet}
- Build passing: {yes/no/no build yet}

## Cleanup Targets
| File | Lines to Remove | Reason |
|------|-----------------|--------|
| {path} | {lines} | {reason} |

## Checklist Item to Mark Complete
- Line: `- [ ] {N}. {description}`
- Change to: `- [x] {N}. {description}`

## Git Plan

### Staging Groups
| Group | Files | Change Type |
|-------|-------|-------------|
| {group} | {paths} | new/modified/deleted |

### Commit Message(s)
{draft commit message}

### Security Checklist
- [ ] No secrets in staged files (.env, API keys, tokens)
- [ ] No node_modules or dist accidentally staged
- [ ] Build succeeds (npx vite build)
- [ ] Tests pass (npx vitest run)

## Section Cleanup
After commit:
- Delete: /home/travis/Projects/travisgautier/.claude/work/active/step-{N}/
- Update session.yaml: advance to step {N+1}

## Ready for Approval
Call ExitPlanMode to proceed with finish sequence.
```

## Step 7: Exit Plan Mode
Call ExitPlanMode tool to request user approval.

---

# PHASE 2: Execution (After Approval)

## Step 8: Execute Cleanup Phase

Execute the planned cleanups:
1. Remove identified comments, dead code, console.log statements
2. Remove done TODOs and AI artifacts
3. After each file cleanup, verify no syntax errors introduced
4. Run `npx vitest run` after all cleanups (if tests exist)
5. Run `npx vite build` after all cleanups (if build system exists)

If cleanup breaks tests or build, revert that specific cleanup and continue with the rest.

## Step 9: Execute Documentation Phase

1. **Update IMPLEMENTATION_PLAN.md**:
   - Find the line `- [ ] {N}.` for the current step
   - Change it to `- [x] {N}.`
   - Do NOT touch any other checklist items

2. **Update session.yaml**:
   - Set `current_agent: finish`
   - Update `resume_point.last_action` to `step_{N}_finishing`

## Step 10: Execute Git Phase

### 10.1 Security Checklist (BLOCKING)
Before staging ANY files, verify:
- [ ] No `.env`, credentials, API keys, or tokens in changed files
- [ ] `node_modules/` is not being staged (check .gitignore)
- [ ] `dist/` is not being staged (check .gitignore)
- [ ] No debug/bypass code left in (e.g., `if (true)`, hardcoded test values)
- [ ] Build succeeds: `npx vite build` (if build system exists)
- [ ] Tests pass: `npx vitest run` (if tests exist)

If any check fails, STOP and report the issue.

### 10.2 Stage and Commit
Stage files by logical groups (from the plan). For each group with changes:

```bash
# Stage the group
git add {files}

# Commit with focused message
git commit -m "{present tense description of what this group does}"
```

**Commit message rules:**
- Present tense ("Add portal shader files" not "Added portal shader files")
- Describes what the commit does, not what you did
- No conventional commit prefixes (no `feat:`, `fix:`, `chore:`)
- No emoji
- No footer, no Co-Authored-By
- Keep under 72 characters
- If a single commit covers all changes, that is fine -- do not force multiple commits

### 10.3 Planning Commit
Always make a separate final commit for documentation updates:

```bash
git add IMPLEMENTATION_PLAN.md .claude/work/
git commit -m "Mark step {N} complete"
```

### 10.4 Push
```bash
git push
```

If push fails (no remote, auth issue), report the failure but do not block completion.

## Step 11: Section Cleanup (MANDATORY)

After all phases complete successfully:

1. **Delete step working directory**:
   ```bash
   rm -rf /home/travis/Projects/travisgautier/.claude/work/active/step-{N}/
   ```

2. **Update session.yaml** for next step:
   - Increment `current_step` to N+1
   - Update `current_phase` if crossing a phase boundary (see step-to-phase mapping)
   - Set `current_agent: pending`
   - Reset `context_window.iteration` to 0
   - Add completed step to `steps_completed` list with today's date
   - Remove from `steps_in_progress` if present
   - Set `resume_point.last_action` to `step_{N}_completed`
   - Set `resume_point.next_action` to `/discovery {N+1}`

   Phase boundaries:
   - Steps 1-6: `foundation`
   - Steps 7-13: `resilience`
   - Steps 14-19: `adaptive_quality`
   - Steps 20-24: `mobile_touch`
   - Steps 25-30: `polish_deploy`

3. **Verify deletion**:
   ```bash
   ls /home/travis/Projects/travisgautier/.claude/work/active/
   # Should not contain step-{N}/
   ```

**BLOCKING**: Do NOT report completion until step directory is deleted and session.yaml is updated. This is not optional.

---

## Abort Conditions

Stop immediately and report if:
- Tests fail and cannot be fixed by reverting cleanup changes
- Build fails and cannot be fixed by reverting cleanup changes
- Security checklist fails (secrets detected in staged files)
- Git push fails with non-recoverable error
- Implementation appears incomplete (step work was not actually done)

---

## BLOCKING GATE

**MANDATORY**: After completing all phases (Cleanup, Docs, Git) and section cleanup, you MUST:

1. **STOP** - Do not proceed to next step's Discovery
2. **REPORT** - Output completion report to user
3. **AWAIT** - Wait for user to explicitly run `/discovery` for next step

**PROHIBITED:**
- Automatically starting Discovery for next step
- Running `/discovery` yourself
- Making any changes after reporting completion

The user controls step transitions. Your job ends when you report completion.

## Completion Report

Report to user:
```
Step {N} complete: {step description}

Phase: {phase}

Cleanup:
- Files cleaned: {n}
- Items removed: {m} (comments: {x}, console.logs: {y}, dead code: {z})

Documentation:
- IMPLEMENTATION_PLAN.md: step {N} marked [x]
- session.yaml: advanced to step {N+1}

Git:
- Commits: {n}
- Pushed: {yes/no/failed}
- Branch: {branch}

Step directory deleted: yes
Next step: {N+1}. {next step description}
Next phase: {phase} (same/new: {phase name})

Run `/discovery {N+1}` to continue.
```

## Error Report

If any phase fails:
```
Finish sequence stopped at {phase}.

Step: {N}. {description}

Cleanup: {completed|failed|skipped}
Docs: {completed|failed|skipped}
Git: {completed|failed|skipped}

Error: {description}

Resolution: {suggested action}
```
