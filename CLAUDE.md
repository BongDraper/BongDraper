# CLAUDE.md - AI Assistant Guide for BongDraper

This document provides comprehensive guidance for AI assistants (like Claude) working on the BongDraper repository. It covers codebase structure, development workflows, and key conventions to follow.

## Table of Contents

1. [Repository Overview](#repository-overview)
2. [Codebase Structure](#codebase-structure)
3. [Development Workflow](#development-workflow)
4. [Coding Conventions](#coding-conventions)
5. [Git Workflow](#git-workflow)
6. [Testing Guidelines](#testing-guidelines)
7. [Common Tasks](#common-tasks)
8. [Important Notes for AI Assistants](#important-notes-for-ai-assistants)

---

## Repository Overview

**Repository:** BongDraper/BongDraper
**Status:** Early development / Initial setup
**Primary Language:** TBD
**Purpose:** TBD

### Key Technologies
- TBD (To be updated as stack is defined)

---

## Codebase Structure

```
BongDraper/
├── .git/                 # Git repository metadata
└── CLAUDE.md            # This file - AI assistant guide
```

**Note:** This structure will be updated as the project grows. Check this section regularly for the latest organization.

### Directory Conventions

When the codebase grows, follow these common conventions:

```
├── src/                 # Source code
│   ├── components/     # Reusable components (if applicable)
│   ├── utils/          # Utility functions
│   ├── config/         # Configuration files
│   └── tests/          # Test files
├── docs/               # Documentation
├── scripts/            # Build and deployment scripts
├── .github/            # GitHub workflows and templates
└── README.md           # Project overview
```

---

## Development Workflow

### Branch Strategy

**Main Branch:** TBD (typically `main` or `master`)
**Feature Branches:** `claude/feature-name-{sessionId}`

#### Creating New Branches

All AI-assisted development should happen on branches following this pattern:
- **Format:** `claude/{feature-description}-{sessionId}`
- **Example:** `claude/add-claude-documentation-9Ed4R`

#### Branch Lifecycle

1. Create feature branch from main
2. Develop and commit changes
3. Push to origin with `-u` flag
4. Create pull request for review
5. Merge after approval

### Commit Guidelines

#### Commit Message Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

#### Types
- **feat:** New feature
- **fix:** Bug fix
- **docs:** Documentation changes
- **style:** Code style changes (formatting, no logic change)
- **refactor:** Code refactoring
- **test:** Adding or updating tests
- **chore:** Maintenance tasks
- **perf:** Performance improvements

#### Examples

```bash
feat(api): add user authentication endpoint

Implement JWT-based authentication with refresh tokens.
Includes middleware for route protection.

Closes #123
```

```bash
fix(ui): resolve button alignment issue

Center-align submit button on mobile viewports.
```

---

## Coding Conventions

### General Principles

1. **Simplicity First:** Write simple, readable code. Avoid over-engineering.
2. **No Premature Abstraction:** Don't create utilities or helpers until needed in multiple places.
3. **Minimal Error Handling:** Only validate at system boundaries (user input, external APIs).
4. **Delete Unused Code:** Remove completely instead of commenting out.
5. **Self-Documenting Code:** Prefer clear naming over comments.

### Code Style

**Note:** Specific style guides will be added as the tech stack is defined.

#### General Rules
- Use consistent indentation (2 or 4 spaces)
- Prefer const over let, avoid var
- Use descriptive variable names
- Keep functions small and focused
- Avoid deep nesting (max 3-4 levels)

#### Comments
- Only add comments where logic isn't self-evident
- Explain "why" not "what"
- Update comments when code changes
- Remove outdated comments

#### File Organization
- One primary export per file
- Group related functions together
- Keep files under 300 lines when possible

---

## Git Workflow

### Daily Operations

#### Starting New Work

```bash
# Fetch latest changes
git fetch origin

# Create new feature branch
git checkout -b claude/feature-name-{sessionId}
```

#### Committing Changes

```bash
# Stage specific files
git add <file1> <file2>

# Commit with descriptive message
git commit -m "feat(scope): descriptive message"
```

#### Pushing Changes

```bash
# First push to new branch
git push -u origin claude/feature-name-{sessionId}

# Subsequent pushes
git push origin claude/feature-name-{sessionId}
```

### Network Retry Policy

If git operations fail due to network errors, retry up to 4 times with exponential backoff:
- First retry: 2 seconds
- Second retry: 4 seconds
- Third retry: 8 seconds
- Fourth retry: 16 seconds

### Safety Rules

**NEVER:**
- Push to main/master directly
- Force push without explicit permission
- Use `--no-verify` flag
- Amend commits that have been pushed
- Commit sensitive data (.env files, credentials)

**ALWAYS:**
- Review changes before committing
- Use descriptive commit messages
- Keep commits atomic and focused
- Run tests before pushing (when available)

---

## Testing Guidelines

### Test Structure

**Note:** Testing framework will be specified as project develops.

### General Testing Principles

1. **Test What Matters:** Focus on behavior, not implementation
2. **Readable Tests:** Tests should serve as documentation
3. **Fast Tests:** Keep unit tests fast (<100ms each)
4. **Isolated Tests:** No dependencies between tests
5. **Clear Assertions:** One concept per test

### Running Tests

```bash
# Run all tests
# TBD - command will be added when testing is set up

# Run specific test file
# TBD

# Run with coverage
# TBD
```

---

## Common Tasks

### Adding a New Feature

1. **Read First:** Always read existing code before making changes
2. **Plan:** Use TodoWrite to break down the task
3. **Implement:** Make focused, minimal changes
4. **Test:** Verify functionality works
5. **Commit:** Create clear commit message
6. **Push:** Push to feature branch

### Fixing a Bug

1. **Reproduce:** Understand the issue fully
2. **Locate:** Find the root cause
3. **Fix:** Make minimal change to resolve
4. **Verify:** Ensure bug is fixed and no regression
5. **Commit:** Use `fix(scope):` prefix

### Refactoring Code

1. **Justify:** Only refactor when necessary
2. **Tests First:** Ensure tests exist and pass
3. **Small Steps:** Make incremental changes
4. **Verify:** Run tests after each step
5. **Document:** Explain why refactoring was needed

### Adding Documentation

1. **Accuracy:** Ensure technical correctness
2. **Clarity:** Write for the intended audience
3. **Examples:** Include code examples when helpful
4. **Update:** Keep docs in sync with code
5. **Placement:** Put docs close to relevant code

---

## Important Notes for AI Assistants

### Tool Usage Preferences

1. **File Operations:**
   - Use `Read` instead of `cat`
   - Use `Edit` instead of `sed`/`awk`
   - Use `Write` for new files instead of `echo` or heredocs
   - Use `Glob` for finding files instead of `find`
   - Use `Grep` for searching content instead of `grep`/`rg`

2. **Task Management:**
   - Use `TodoWrite` for all multi-step tasks
   - Mark items `in_progress` before starting
   - Mark items `completed` immediately after finishing
   - Only one task should be `in_progress` at a time

3. **Code Exploration:**
   - Use `Task` tool with `Explore` agent for understanding codebase
   - Don't use bash commands for file exploration
   - Read files in parallel when possible

### Communication Style

- Be concise and technical
- No emojis unless requested
- Use code references with `file:line` format
- Output text directly, never use `echo` to communicate
- Focus on facts over validation

### Decision Making

- **Read before modifying:** Never propose changes to unread code
- **Ask when uncertain:** Use `AskUserQuestion` for clarification
- **Avoid over-engineering:** Only implement what's requested
- **Security first:** Watch for vulnerabilities (XSS, injection, etc.)
- **No backwards compatibility hacks:** Delete unused code completely

### Security Considerations

Always check for:
- **Injection vulnerabilities:** SQL, command, XSS
- **Authentication/Authorization:** Proper access controls
- **Data validation:** At system boundaries only
- **Sensitive data:** Never commit secrets
- **Dependencies:** Keep updated and reviewed

### Performance Guidelines

- **Profile before optimizing:** Don't guess at bottlenecks
- **Measure impact:** Verify optimizations help
- **Avoid premature optimization:** Clarity first, speed second
- **Consider trade-offs:** Balance performance vs. maintainability

---

## Repository-Specific Context

### Current State

This repository is in its initial setup phase. As the project develops:

1. **Update this document** with actual structure and conventions
2. **Add specific technology stack** information
3. **Document key architectural decisions**
4. **List common gotchas and solutions**
5. **Include examples from actual codebase**

### Questions to Answer (Update as known)

- [ ] What problem does this project solve?
- [ ] What is the target deployment environment?
- [ ] What are the main dependencies?
- [ ] What is the build process?
- [ ] How is testing configured?
- [ ] What CI/CD pipeline is used?
- [ ] Are there environment-specific configurations?

---

## Maintenance

**Last Updated:** 2026-01-18
**Updated By:** Claude (Initial creation)
**Next Review:** After initial project structure is established

### Changelog

- **2026-01-18:** Initial CLAUDE.md creation with template structure

---

## Additional Resources

- [Git Best Practices](https://git-scm.com/book/en/v2)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [Clean Code Principles](https://github.com/ryanmcdermott/clean-code-javascript)

---

**Note to Future AI Assistants:** This document should be treated as a living guide. As you work on the codebase, update this file to reflect:
- New architectural patterns discovered
- Common pitfalls and their solutions
- Project-specific conventions that emerge
- Technology stack details as they're added
- Build and deployment processes

Always keep this document accurate and helpful for the next AI assistant who works on this project.
