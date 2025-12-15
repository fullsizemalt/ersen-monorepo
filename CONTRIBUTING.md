# Contributing to DAEMON 2.0

Thank you for your interest in contributing to DAEMON 2.0! This document provides guidelines and workflows for contributing.

## 📋 Prerequisites

Before contributing, please:

1. Read the [Project Constitution](/.specify/memory/constitution.md)
2. Review the [README](README.md) for project overview
3. Check [existing issues](https://github.com/your-org/daemon2/issues) before creating new ones

## 🚀 Getting Started

### Development Setup

```bash
# Clone the repository
git clone https://github.com/your-org/daemon2.git
cd daemon2

# Install dependencies
cd backend && npm install
cd ../frontend && npm install

# Configure environment
cp .env.example .env
# Edit .env with your credentials

# Start development servers
docker compose up postgres -d
cd backend && npm run dev
cd ../frontend && npm run dev
```

### Running Tests

```bash
# Backend tests
cd backend && npm test

# Frontend tests
cd frontend && npm test

# Full test suite
npm test
```

## 🔄 Workflow

### Branch Naming

Use the following prefixes:

- `feature/` - New features (e.g., `feature/spotify-widget`)
- `fix/` - Bug fixes (e.g., `fix/auth-callback-error`)
- `docs/` - Documentation changes (e.g., `docs/api-endpoints`)
- `test/` - Test additions (e.g., `test/widget-install`)
- `chore/` - Maintenance tasks (e.g., `chore/update-dependencies`)

### Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add Spotify widget integration
fix: resolve OAuth callback redirect issue
docs: update API endpoint documentation
test: add integration tests for widget installation
chore: update TypeScript to v5.3
```

### Pull Request Process

1. **Create a branch** from `master`:

   ```bash
   git checkout -b feature/your-feature
   ```

2. **Make your changes** following the code standards

3. **Write/update tests** for your changes

4. **Run the test suite** to ensure nothing is broken:

   ```bash
   npm test
   ```

5. **Commit your changes** with a conventional commit message

6. **Push your branch**:

   ```bash
   git push origin feature/your-feature
   ```

7. **Open a Pull Request** against `master`

8. **Wait for CI checks** to pass

9. **Address review feedback** if any

10. **Merge** once approved and all checks pass

## 📝 Code Standards

### TypeScript

- **No `any` types** - Use proper typing
- **Strict mode enabled** - Follow compiler strictness
- **Export types** - Export interfaces and types for reuse

### Backend (Express)

- Use async/await for asynchronous code
- Handle errors with proper HTTP status codes
- Validate all input using middleware
- Use parameterized queries for PostgreSQL

### Frontend (React)

- Use functional components with hooks
- Keep components small and focused
- Use TypeScript interfaces for props
- Follow the existing design system

### Styling

- Use CSS variables for theming
- Follow the glassmorphism aesthetic
- Ensure 60fps animations
- Mobile-first responsive design

## 🧪 Testing Guidelines

### What to Test

- **Critical paths**: Authentication, payments, widget installation
- **Edge cases**: Empty states, error conditions, boundary values
- **User journeys**: Complete flows from start to finish

### Test Structure

```typescript
describe('WidgetService', () => {
  describe('installWidget', () => {
    it('should install widget for free tier user with available slots', async () => {
      // Arrange
      // Act
      // Assert
    });

    it('should reject installation when slot limit exceeded', async () => {
      // ...
    });
  });
});
```

## 📁 Spec-Driven Development

DAEMON 2.0 uses [Speckit](https://github.com/speckit/speckit) for specification-driven development.

### Before Implementing a Feature

1. **Create or update spec** in `specs/[phase-name]/`:
   - `spec.md` - User stories and requirements
   - `plan.md` - Technical implementation plan
   - `tasks.md` - Task breakdown

2. **Generate checklist** using `/speckit.checklist`

3. **Complete checklist** before marking implementation done

### Spec Commands

```
/speckit.specify   - Create feature specification
/speckit.plan      - Generate implementation plan
/speckit.tasks     - Generate task breakdown
/speckit.checklist - Create requirements checklist
/speckit.implement - Execute implementation
```

## 🐛 Reporting Bugs

When reporting bugs, please include:

1. **Description**: Clear description of the issue
2. **Steps to Reproduce**: Minimal steps to reproduce
3. **Expected Behavior**: What should happen
4. **Actual Behavior**: What actually happens
5. **Environment**: OS, browser, Node version
6. **Screenshots**: If applicable

## 💡 Suggesting Features

For feature suggestions:

1. Check if already suggested in issues
2. Describe the use case
3. Explain the expected behavior
4. Consider how it fits the constitution principles

## 📜 License

By contributing, you agree that your contributions will be licensed under the [ISC License](LICENSE).

## 🙏 Thank You

Your contributions make DAEMON 2.0 better for everyone!
