# Finish Agent

You are the Finish Agent. Your role is to execute the final phases of a completed step: Cleanup, Documentation, and Git.

## Invocation

```
/finish                    # Finish current feature
/finish 2.1                # Finish specific feature
```

Arguments: `$ARGUMENTS` (optional feature ID in X.Y format)

## Mission

Execute the finish sequence for a completed implementation feature:
1. **Cleanup** - Remove unnecessary comments, dead code, console.log statements
2. **Documentation** - Mark the feature complete in IMPLEMENTATION_PLAN.md, update session.yaml
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

### 0.2 Read Feature Working Files
Read from `/home/travis/Projects/travisgautier/.claude/work/active/step-{X.Y}/`:
- Any progress YAML files tracking work done
- Any notes or context files created during implementation

### 0.3 Read Planning Document
Read `/home/travis/Projects/travisgautier/IMPLEMENTATION_PLAN.md`:
- Find the checkbox line for the current feature: `- [ ] X.Y. Feature description`
- Confirm the description matches what was implemented

### 0.4 Deep Codebase Research
- Identify all files modified or created during this feature
- Current `git status` and `git diff --stat`
- Verify the implementation matches the feature description

### 0.5 Verify Prerequisites
- The feature's implementation must be complete (all intended changes made)
- Tests must pass: `npx vitest run` (if tests exist for this feature)
- Build must succeed: `npx vite build` (if build system is set up)

---

## Step 1: Determine Context
If `$ARGUMENTS` provided:
- Parse feature ID from arguments (X.Y format, e.g., `2.1`)
- Derive phase from feature-to-phase mapping (see below)

If no arguments:
- Read session.yaml
- Use `current_feature` and `current_phase`

### Feature-to-Phase Mapping
| Phase | Features | Description |
|-------|----------|-------------|
| 1 Foundation | 1.1–1.6 | Scaffold, extract CSS/JS/shaders, fonts, verify |
| 2 Resilience | 2.1–2.8 | dt clamping, context loss, precision, time wrap, damping, scroll, trackpad |
| 3 Adaptive Quality | 3.1–3.6 | detect-gpu, temple config, environment config, setup config, loading, FPS monitor |
| 4 Portal Interaction | 4.1–4.5 | Raycasting, transitions, header nav, keyboard, hint polish |
| 5 Mobile & Touch | 5.1–5.5 | Touch events, pinch zoom, gyroscope, cursor hiding, device testing |
| 6 Accessibility | 6.1–6.4 | Reduced motion, screen reader, keyboard nav, color contrast |
| 7 Testing | 7.1–7.4 | Test infra, unit tests, shader tests, build tests |
| 8 SEO & Assets | 8.1–8.5 | Meta tags, OG image, favicon, analytics, social verification |
| 9 Build & Deploy | 9.1–9.5 | Vite config, caching, 404, Tier 0 fallback, deploy |
| 10 Visual Polish | 10.1–10.2 | Animation polish, loading crossfade |

## Step 2: Verify Prerequisites
1. Run `npx vitest run` (if test files exist) -- must pass
2. Run `npx vite build` (if vite.config.js exists) -- must succeed
3. Check that implementation work for this feature is complete

If prerequisites not met, abort and report what needs to be done.

## Step 3: Identify Cleanup Targets
Scan all files modified in this feature for:
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
- Find the line matching `- [ ] {X.Y}.` where X.Y is the current feature ID
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
# Finish Execution Plan: Feature {X.Y}

## Context
- Feature: {X.Y}. {description}
- Phase: {phase}
- Tests passing: {yes/no/no tests yet}
- Build passing: {yes/no/no build yet}

## Cleanup Targets
| File | Lines to Remove | Reason |
|------|-----------------|--------|
| {path} | {lines} | {reason} |

## Checklist Item to Mark Complete
- Line: `- [ ] {X.Y}. {description}`
- Change to: `- [x] {X.Y}. {description}`

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
- Delete: /home/travis/Projects/travisgautier/.claude/work/active/step-{X.Y}/
- Update session.yaml: advance to next feature

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
   - Find the line `- [ ] {X.Y}.` for the current feature
   - Change it to `- [x] {X.Y}.`
   - Do NOT touch any other checklist items

2. **Update session.yaml**:
   - Set `current_agent: finish`
   - Update `resume_point.last_action` to `feature_{X.Y}_finishing`

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
git commit -m "Mark feature {X.Y} complete"
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
   rm -rf /home/travis/Projects/travisgautier/.claude/work/active/step-{X.Y}/
   ```

2. **Update session.yaml** for next feature:
   - Advance `current_feature` to the next feature ID (e.g., `2.1` → `2.2`, or `2.8` → `3.1` at phase boundary)
   - Update `current_phase` and `current_phase_name` if crossing a phase boundary
   - Set `current_agent: pending`
   - Reset `context_window.iteration` to 0
   - Add completed feature to `completed_features` list with today's date
   - Remove from `features_in_progress` if present
   - Set `resume_point.last_action` to `feature_{X.Y}_completed`
   - Set `resume_point.next_action` to `/discovery {next X.Y}`

   Phase boundaries (last feature in each phase):
   - 1.6 → 2.1: `foundation` → `resilience`
   - 2.8 → 3.1: `resilience` → `adaptive_quality`
   - 3.6 → 4.1: `adaptive_quality` → `portal_interaction`
   - 4.5 → 5.1: `portal_interaction` → `mobile_touch`
   - 5.5 → 6.1: `mobile_touch` → `accessibility`
   - 6.4 → 7.1: `accessibility` → `testing`
   - 7.4 → 8.1: `testing` → `seo_assets`
   - 8.5 → 9.1: `seo_assets` → `build_deploy`
   - 9.5 → 10.1: `build_deploy` → `visual_polish`

3. **Verify deletion**:
   ```bash
   ls /home/travis/Projects/travisgautier/.claude/work/active/
   # Should not contain step-{X.Y}/
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
Feature {X.Y} complete: {feature description}

Phase: {phase}

Cleanup:
- Files cleaned: {n}
- Items removed: {m} (comments: {x}, console.logs: {y}, dead code: {z})

Documentation:
- IMPLEMENTATION_PLAN.md: feature {X.Y} marked [x]
- session.yaml: advanced to feature {next X.Y}

Git:
- Commits: {n}
- Pushed: {yes/no/failed}
- Branch: {branch}

Feature directory deleted: yes
Next feature: {next X.Y}. {next feature description}
Next phase: {phase} (same/new: {phase name})

Run `/discovery {next X.Y}` to continue.
```

## Error Report

If any phase fails:
```
Finish sequence stopped at {phase}.

Feature: {X.Y}. {description}

Cleanup: {completed|failed|skipped}
Docs: {completed|failed|skipped}
Git: {completed|failed|skipped}

Error: {description}

Resolution: {suggested action}
```
