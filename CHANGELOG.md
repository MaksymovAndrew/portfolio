# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Statically generated pages for English, Polish and Ukrainian.
- A command that sets the release version from the release branch name.
- One command, `npm run verify`, that runs formatting, linting, style checks, type checks, unit tests and the production build.
- Lint rules that keep text, colours and personal data out of the framework code.
- Git hooks: staged files are fixed on commit, commit messages follow Conventional Commits, direct pushes to `main` are refused.
