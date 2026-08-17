# RepoVerse Prototype

RepoVerse is a static prototype for an internal GitHub/codebase activity console. It deploys on Vercel with no build step.

<img width="1628" height="980" alt="image" src="https://github.com/user-attachments/assets/d7aa973f-8970-40f6-bbf1-a35ac9f7193b" />



## Current Capabilities

- Demo Org mode with curated multi-repo data.
- GitHub Repo mode for `owner/repo` drilldown.
- GitHub Org/User mode for public repository planets.
- People, Teams, and Repos orbit modes.
- Repo planets for multi-repo organizations, with size influenced by activity/load and click-to-drilldown into contributor orbit mode.
- Contributor avatars, contribution counts, recent commits, and open PR context.
- PR Radar grouped into Draft, Needs Review, Changes Requested, and Approved demo states.
- Live Activity feed from sampled GitHub events and commits.
- Hybrid Intelligence panel that combines real GitHub data with demo-friendly inferred signals.
- Collapsible/resizable side panels and fullscreen orbit stage.
- Keyboard-focusable controls and nodes.

## GitHub Data Used

The prototype currently uses public REST API endpoints for:

- repository metadata
- organization/user repositories
- contributors
- open pull requests
- recent commits
- public repository events
- CODEOWNERS discovery when available

A GitHub token can be entered locally for higher rate limits or private repo access. It is stored only in browser `localStorage`. Production OAuth should use a backend callback and server-side token exchange.

## Good Demo Inputs

Repos:

- `storybookjs/storybook`
- `vitejs/vite`
- `facebook/react`
- `microsoft/vscode`

Orgs/users:

- `storybookjs`
- `vitejs`
- `supabase`
- `grafana`

## Product Direction

The recommended strategy is hybrid: use real GitHub data for repos, avatars, PRs, commits, labels, events, and counts; use enriched summaries for ownership, team grouping, review risk, and manager-facing insights until a backend intelligence layer exists.

