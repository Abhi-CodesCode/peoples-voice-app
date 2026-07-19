# Contributing to People's Voices

Thank you for your interest in contributing to People's Voices! This guide will help you get started.

---

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How to Contribute](#how-to-contribute)
- [Development Workflow](#development-workflow)
- [Code Style](#code-style)
- [Commit Message Format](#commit-message-format)
- [Testing Guidelines](#testing-guidelines)
- [Pull Request Guidelines](#pull-request-guidelines)
- [Privacy Considerations](#privacy-considerations)

---

## Code of Conduct

By participating in this project, you agree to maintain a respectful and inclusive environment. Be kind, constructive, and welcoming to all contributors.

---

## How to Contribute

### 1. Fork the Repository

Click the **Fork** button on GitHub to create your own copy of the repository.

### 2. Clone Your Fork

```bash
git clone https://github.com/your-username/peoples-voice-app.git
cd peoples-voice-app
```

### 3. Create a Branch

Create a descriptive branch from `main`:

```bash
git checkout -b feat/your-feature-name
# or
git checkout -b fix/your-bug-fix
```

**Branch naming conventions:**

| Prefix | Use Case |
|---|---|
| `feat/` | New features |
| `fix/` | Bug fixes |
| `docs/` | Documentation updates |
| `refactor/` | Code refactoring |
| `style/` | Styling and UI changes |
| `test/` | Test additions or changes |
| `chore/` | Build, tooling, or dependency updates |

### 4. Make Your Changes

- Follow the [Code Style](#code-style) guidelines below
- Ensure your changes don't introduce PII collection (see [Privacy Considerations](#privacy-considerations))

### 5. Push and Open a Pull Request

```bash
git push origin feat/your-feature-name
```

Then open a Pull Request against the `main` branch on GitHub.

---

## Development Workflow

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Run linter
npm run lint

# Build for production
npm run build
```

---

## Code Style

### TypeScript

- **Strict mode** is enforced (`"strict": true` in `tsconfig.json`)
- Use explicit types — avoid `any` wherever possible
- Prefer `interface` for object shapes, `type` for unions and intersections
- Use `const` by default; use `let` only when reassignment is necessary

### React & Next.js

- Use the `"use client"` directive **only** in components that require interactivity, hooks, or browser APIs
- Follow the [shadcn/ui](https://ui.shadcn.com/) pattern: reusable primitives go in `src/components/ui/`
- Use the `@/` import alias for all project imports

```tsx
// ✅ Good
import { Button } from "@/components/ui/button";

// ❌ Bad
import { Button } from "../../../components/ui/button";
```

### Styling

- Use **TailwindCSS** utility classes — avoid custom CSS unless absolutely necessary
- Follow the project's design system colors (see `tailwind.config.ts`)
- Use **Framer Motion** for animations

### Linting & Formatting

- **ESLint** is configured with `eslint-config-next`
- Run `npm run lint` before committing to catch issues early
- Use **Prettier** for consistent formatting (2-space indentation, single quotes, trailing commas)

```bash
npm run lint
```

---

## Commit Message Format

We follow **[Conventional Commits](https://www.conventionalcommits.org/)**:

```
<type>(<scope>): <short description>

[optional body]

[optional footer]
```

### Types

| Type | Description |
|---|---|
| `feat` | A new feature |
| `fix` | A bug fix |
| `docs` | Documentation changes |
| `style` | Code style changes (formatting, no logic change) |
| `refactor` | Code refactoring (no feature or fix) |
| `test` | Adding or updating tests |
| `chore` | Build process, tooling, or dependency updates |
| `perf` | Performance improvements |

### Examples

```
feat(map): add clustering for high-density areas
fix(form): prevent duplicate submissions on slow networks
docs(readme): update environment variable instructions
refactor(hooks): extract useSubmission from page component
```

---

## Testing Guidelines

### General Principles

- Write tests for new features and bug fixes
- Ensure existing tests pass before submitting a PR
- Test both happy paths and edge cases

### What to Test

- **Components**: Render correctly, respond to user interaction, display proper states
- **Hooks**: Return expected values, handle loading/error states
- **Utilities**: Pure functions with various inputs
- **API Routes**: Request validation, response shapes, error handling

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch
```

---

## Pull Request Guidelines

1. **Keep PRs focused** — one feature or fix per PR
2. **Write a clear description** — explain what changed and why
3. **Reference issues** — link to related GitHub issues (e.g., `Closes #42`)
4. **Include screenshots** — for UI changes, add before/after screenshots
5. **Ensure CI passes** — all linting and tests must pass
6. **Request review** — tag a maintainer for review

### PR Template

```markdown
## What does this PR do?

Brief description of the change.

## Why?

Context and motivation for the change.

## Screenshots (if applicable)

Before | After
--- | ---
![before](url) | ![after](url)

## Checklist

- [ ] Code follows the project's style guidelines
- [ ] No PII is collected or displayed
- [ ] Tests added/updated as needed
- [ ] Linting passes (`npm run lint`)
- [ ] Self-reviewed the code
```

---

## Privacy Considerations

**This is critical.** People's Voices is a privacy-first platform. When contributing, ensure:

- ❌ **NEVER** collect or display personally identifiable information (PII): name, email, phone number, precise GPS coordinates, IP address
- ✅ **ALWAYS** use city-level or state-level location data (centroid coordinates only)
- ✅ **ALWAYS** include the voluntary submission disclaimer on pages that display data
- ✅ **ALWAYS** ensure new features maintain user anonymity

If you're unsure whether a feature could compromise privacy, open an issue to discuss it before implementing.

---

Thank you for helping make civic participation accessible and private! 🙏
