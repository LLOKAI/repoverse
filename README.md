# RepoVerse Prototype

RepoVerse is a visual prototype for a live GitHub/codebase activity map.

<img width="2494" height="1027" alt="image" src="https://github.com/user-attachments/assets/4946d94d-8e52-4556-8c69-26af71e665f9" />


Open `index.html` in a browser to view it. The app is still static-file friendly, but it now has two modes:

- Demo Mode: curated contributor personas for a clean pitch/demo.
- GitHub Mode: enter `owner/repo` to fetch public repo metadata, top contributors, recent commits, open PRs, language mix, stars, forks, and issue counts from GitHub's REST API.

## Optional Token

The token field accepts a GitHub personal access token and stores it in `localStorage` for the browser only. This improves rate limits and can work for private repos the token can access. A production OAuth login would need a backend callback and server-side token exchange so the client secret is never exposed in browser JavaScript.

## Good Demo Repos

Try these in the repository input:

- `vercel/next.js`
- `facebook/react`
- `microsoft/vscode`
- `nodejs/node`
- `rust-lang/rust`

## Concept

- Central repository/product node
- Contributor avatars orbiting around it
- Animated data transmission from contributors to the codebase
- Hoverable contributor summaries
- GitHub-native dark interface with RepoVerse's neon orbit identity
- Manager/developer awareness panel without making the product feel like surveillance
