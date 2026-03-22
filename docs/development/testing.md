# Testing Guide

## Purpose

Aura uses three layers of verification:

- smart contract tests for on-chain behavior,
- backend tests for API and middleware behavior,
- frontend checks for lint/build plus Playwright end-to-end coverage.

The goal is to catch contract regressions first, then integration regressions, then browser and device regressions.

## Local Commands

Run the full local validation before opening a PR:

```bash
# Smart contracts
npm test

# Backend API
cd backend && npm test

# Frontend static checks
cd frontend && npm run lint
cd frontend && npm run build

# Cross-browser and mobile flows
cd frontend && npm run test:e2e
```

If Playwright browsers are not installed locally yet:

```bash
cd frontend && npx playwright install chromium firefox webkit
```

## CI Matrix

GitHub Actions currently runs:

- `contracts`: compile, unit tests, and coverage
- `backend`: dependency install plus syntax validation
- `frontend`: lint and production build
- `frontend-e2e`: Playwright on Chromium, Firefox, WebKit, Pixel 7 emulation, and iPhone 13 emulation

The Playwright suite uses the production Vite app served locally, not a mocked component harness.

## Playwright Scope

Current automated coverage focuses on the highest-risk user flows:

- keyboard help dialog opens and closes correctly
- wallet-gated routes show a connect-wallet prompt when no wallet is connected
- public pages and verify remain within the viewport on desktop and mobile
- verify renders authentic results
- verify renders suspicious/fraud states
- verify renders actionable not-found errors

The E2E suite stubs verification API responses to stay deterministic across browsers and CI runners.

## Supported Browser Matrix

Minimum supported matrix for release sign-off:

| Surface | Automation | Notes |
| --- | --- | --- |
| Chrome / Chromium desktop | Playwright | Primary reference browser |
| Firefox desktop | Playwright | Layout and input parity |
| Safari desktop | Playwright WebKit | Best-effort Safari parity via WebKit |
| Android mobile | Playwright Pixel 7 | Responsive layout and touch targets |
| iPhone mobile | Playwright iPhone 13 | Responsive layout and touch targets |

## Manual QA Checklist

These checks still require a human before production deploys:

1. Connect a real wallet and complete register on Fuji.
2. Transfer custody with a real wallet and verify the history update on-chain.
3. Scan a real QR code with camera permissions on mobile Safari and Chrome.
4. Confirm responsive layouts at `320px`, `375px`, `414px`, and tablet width.
5. Verify keyboard-only navigation, focus visibility, skip link, and shortcut dialog.
6. Validate `prefers-reduced-motion` behavior on verification and timeline flows.

## Failure Triage

- If contract tests fail, inspect Solidity logic or event expectations first.
- If backend tests fail, inspect route validation or service-level error mapping.
- If Playwright fails only in one browser, treat it as a compatibility bug unless proven otherwise.
- If Playwright fails across all browsers, inspect recent UI copy, selectors, API contracts, and route behavior before adjusting the tests.
