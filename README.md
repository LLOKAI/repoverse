# RepoVerse Prototype

RepoVerse is a visual prototype for an internal GitHub/codebase activity console.

<img width="1618" height="892" alt="Recording 2026-08-13 171628" src="https://github.com/user-attachments/assets/e1650732-666f-4365-a756-0467259bf5a9" />


Open `index.html` in a browser to view it. The app is still static-file friendly, but it now has two modes:

## Modes

- Demo Org: curated multi-repo organization data for a clean pitch.
- GitHub Repo: enter `owner/repo` to fetch public repo metadata, contributors, commits, open PRs, and language data from GitHub's REST API.

## Internal Tool Direction

This branch expands the prototype from a showcase orbit into a more operational console:

- Collapsible scope and inspector panels
- Resizable side panels using native browser resize behavior
- Fullscreen orbit canvas
- People, Teams, and Repos map modes
- Rings for scale and grouping
- Repository planets for multi-repo organizations
- Inspector tabs for Activity, Ownership, and Signals
- Keyboard-focusable nodes and controls

## Optional Token

The token field accepts a GitHub personal access token and stores it in `localStorage` for the browser only. This improves rate limits and can work for private repos the token can access. A production OAuth login should use a backend callback and server-side token exchange so client secrets are never exposed in browser JavaScript.

## Good Demo Repos

- `vercel/next.js`
- `facebook/react`
- `microsoft/vscode`
- `nodejs/node`
- `rust-lang/rust`
