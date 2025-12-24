# Contributing to Mass SMS

Thank you for interest in contributing! This document provides guidelines for contributing to the project.

## Code of Conduct

- Be respectful and inclusive
- Focus on the code, not the person
- Help others learn and improve

## How to Contribute

### Reporting Bugs

1. Check existing issues first
2. Provide clear bug title and description
3. Include steps to reproduce
4. Provide expected vs actual behavior
5. Include relevant logs or screenshots

### Suggesting Enhancements

1. Check existing issues first
2. Clearly describe the enhancement
3. Explain the use case
4. Provide examples if possible

### Pull Requests

1. Fork the repository
2. Create feature branch: `git checkout -b feature/description`
3. Make focused changes
4. Write clear commit messages
5. Run tests: `npm test`
6. Submit PR with description

## Development Standards

- TypeScript strict mode
- ESLint + Prettier formatting
- Meaningful variable/function names
- Comments for complex logic
- Tests for new features

## Commit Message Format

```
<type>: <subject>

<body>

<footer>
```

Types: feat, fix, docs, style, refactor, test, chore

Example:
```
feat: Add SMS rate limiting

Implements rate limiting on SMS sending endpoint to prevent abuse.
- Add rate limiter middleware
- Configure 100 SMS per hour limit
- Return 429 status when exceeded

Closes #123
```

## Questions?

Create an issue or discussion for questions. Happy contributing!
