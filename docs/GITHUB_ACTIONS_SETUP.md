# GitHub Actions Setup Guide

## Quick Start

### 1. Enable GitHub Actions

GitHub Actions are enabled by default for public repositories. For private repos, go to:
- Settings → Actions → General → Enable "Allow all actions and reusable workflows"

### 2. Choose Your Workflow

We provide two workflow options:

#### Option A: Basic Testing (Recommended to start)
Uses `.github/workflows/test.yml`
- ✅ No secrets required
- ✅ Runs tests on every push/PR
- ✅ Generates coverage reports
- ✅ Comments coverage on PRs

#### Option B: Full CI/CD Pipeline
Uses `.github/workflows/ci.yml`
- Includes everything from Option A
- Adds build verification
- Includes Vercel deployment (optional)
- Requires additional secrets for deployment

### 3. Using Basic Testing (No Setup Required)

Simply push your code:

```bash
git add .
git commit -m "Add GitHub Actions"
git push
```

The workflow will automatically:
1. Run ESLint
2. Check TypeScript types
3. Run all tests with coverage
4. Upload coverage reports as artifacts
5. Comment coverage on PRs

### 4. Optional Integrations

#### Codecov Integration

1. Sign up at [codecov.io](https://codecov.io)
2. Connect your GitHub repository
3. Get your `CODECOV_TOKEN`
4. Add to GitHub: Settings → Secrets and variables → Actions → New repository secret
   - Name: `CODECOV_TOKEN`
   - Value: Your token from Codecov

#### Vercel Deployment (for full CI/CD)

1. Get your Vercel credentials:
```bash
# Install Vercel CLI
npm i -g vercel

# Login and link project
vercel link

# Get tokens from .vercel/project.json
cat .vercel/project.json
```

2. Add GitHub secrets:
   - `VERCEL_TOKEN` - From Vercel account settings
   - `VERCEL_ORG_ID` - From `.vercel/project.json`
   - `VERCEL_PROJECT_ID` - From `.vercel/project.json`
   - `VITE_OPENWEATHER_API_KEY` - Your OpenWeatherMap API key

## Viewing Results

### Action Runs
- Go to your GitHub repository
- Click "Actions" tab
- See all workflow runs

### Coverage Reports
- In any workflow run, scroll to "Artifacts"
- Download "coverage-report"
- Open `index.html` in browser

### PR Comments
Pull requests automatically get coverage comments showing:
- Overall coverage percentage
- Coverage change vs base branch
- Detailed file-by-file breakdown

## Badge Setup

### Add Status Badge to README

```markdown
![Tests](https://github.com/USERNAME/REPO/actions/workflows/test.yml/badge.svg)
```

### Add Coverage Badge (with Codecov)

```markdown
[![codecov](https://codecov.io/gh/USERNAME/REPO/branch/main/graph/badge.svg)](https://codecov.io/gh/USERNAME/REPO)
```

### Example README Section

```markdown
# AI WeatherTracker

[![Tests](https://github.com/USERNAME/REPO/actions/workflows/test.yml/badge.svg)](https://github.com/USERNAME/REPO/actions/workflows/test.yml)
[![codecov](https://codecov.io/gh/USERNAME/REPO/branch/main/graph/badge.svg)](https://codecov.io/gh/USERNAME/REPO)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A modern weather tracking application with React and TypeScript.
```

## Workflow Details

### Test Workflow (test.yml)

**Triggers:**
- Push to `main` or `develop`
- Pull requests to `main` or `develop`

**Steps:**
1. Checkout code
2. Setup Node.js 18
3. Install dependencies with `npm ci`
4. Run ESLint
5. Run TypeScript check
6. Run tests with coverage
7. Upload coverage artifacts
8. Comment coverage on PRs

**Duration:** ~2-3 minutes

### Full CI/CD Workflow (ci.yml)

**Jobs:**
1. **Test** - Same as test.yml
2. **Build** - Verify production build works
3. **Deploy Preview** - Deploy PR previews to Vercel
4. **Deploy Production** - Deploy main branch to production

**Duration:** ~5-7 minutes

## Troubleshooting

### Action Fails on First Run

**Common causes:**
1. Missing dependencies - Fixed automatically
2. TypeScript errors - Run `npm run typecheck` locally
3. Test failures - Run `npm test` locally

### Coverage Not Uploading

Check that `@vitest/coverage-v8` is installed:
```bash
npm install -D @vitest/coverage-v8
```

### PR Coverage Comment Not Appearing

1. Ensure the action has permission to comment
2. Check: Settings → Actions → General → Workflow permissions
3. Select "Read and write permissions"
4. Save changes

### Build Fails in CI But Works Locally

```bash
# Use same command as CI
npm ci
npm run build
```

Common issues:
- Environment variables missing
- Different Node.js versions
- Dependencies not locked in package-lock.json

## Best Practices

### 1. Run Tests Locally First

```bash
npm run ci
```

### 2. Use Branch Protection

Settings → Branches → Add rule for `main`:
- ✅ Require status checks to pass
- ✅ Require branches to be up to date
- Select: "Run Tests"

### 3. Require Passing Tests

- Set coverage thresholds in `vitest.config.ts`
- Tests fail if coverage drops
- Prevents merging untested code

### 4. Review Coverage Reports

- Check coverage artifacts after each run
- Identify untested code
- Add tests before merging

### 5. Keep Actions Updated

GitHub will notify you of:
- Action version updates
- Security advisories
- Deprecated features

## Cost Considerations

### Free Tier (Public Repos)
- ✅ Unlimited minutes
- ✅ All features available

### Free Tier (Private Repos)
- 2,000 minutes/month
- ~500-1000 workflow runs
- Upgrade if needed

### Optimize Usage
- Use `npm ci` instead of `npm install` (faster)
- Cache dependencies (already configured)
- Only run on relevant branches
- Skip jobs conditionally

## Advanced Configuration

### Run Tests on Specific Paths

```yaml
on:
  push:
    paths:
      - 'src/**'
      - 'package.json'
      - '.github/workflows/**'
```

### Matrix Testing

Test multiple Node.js versions:

```yaml
strategy:
  matrix:
    node-version: [18, 20, 21]
steps:
  - uses: actions/setup-node@v4
    with:
      node-version: ${{ matrix.node-version }}
```

### Scheduled Tests

Run tests daily:

```yaml
on:
  schedule:
    - cron: '0 0 * * *'  # Every day at midnight
```

## Resources

- [GitHub Actions Docs](https://docs.github.com/en/actions)
- [Workflow Syntax](https://docs.github.com/en/actions/reference/workflow-syntax-for-github-actions)
- [Vitest CI Guide](https://vitest.dev/guide/ci.html)
- [Codecov Docs](https://docs.codecov.com/docs)

---

**Need Help?** Open an issue or check the Actions logs for detailed error messages.
