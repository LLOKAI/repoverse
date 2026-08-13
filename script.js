const ORBIT_POSITIONS = [
  { x: 8, y: 9, c1: [410, 245], c2: [315, 170], end: [214, 112] },
  { x: 73, y: 8, c1: [622, 215], c2: [732, 145], end: [840, 104] },
  { x: 75, y: 52, c1: [645, 365], c2: [760, 378], end: [888, 420] },
  { x: 3, y: 76, c1: [377, 420], c2: [262, 498], end: [150, 604] },
  { x: 42, y: 0, c1: [492, 205], c2: [498, 118], end: [508, 64] },
  { x: 63, y: 82, c1: [560, 485], c2: [632, 596], end: [744, 650] },
  { x: 4, y: 42, c1: [365, 342], c2: [240, 325], end: [110, 340] },
  { x: 71, y: 31, c1: [600, 330], c2: [725, 270], end: [840, 245] }
];
const COLORS = ["#58a6ff", "#db61a2", "#3fb950", "#d29922", "#a371f7", "#f85149", "#39c5cf", "#ff7b72"];
const demoRepo = {
  name: "repoverse/demo", description: "A curated demo of contributor activity, PR summaries, and ownership signals.", stars: "12.8k", forks: "1.9k", issues: "14", language: "TypeScript", subtitle: "demo signal live",
  languages: { TypeScript: 58, CSS: 19, JavaScript: 17, HTML: 6 },
  people: [
    { login: "mira", name: "Mira Chen", avatar: "", count: 42, summary: "Split billing webhooks into typed event handlers.", detail: "Backend lead for billing events. Latest work extracts webhook handling into typed, testable event modules.", activity: ["PR #4821 awaiting final review", "Owns billing-webhooks and event-store", "Raised service test coverage by 14%"] },
    { login: "kai", name: "Kai Patel", avatar: "", count: 31, summary: "Reviewing auth migration and token refresh edge cases.", detail: "Security-minded reviewer focused on auth migration, token refresh paths, and session expiry behavior.", activity: ["Reviewed 4 PRs today", "Flagged 2 session expiry regressions", "Maintains auth middleware"] },
    { login: "nova", name: "Nova Alvarez", avatar: "", count: 28, summary: "Shipping usage dashboards with streaming query cache.", detail: "Product engineer building the live usage dashboard and streaming query cache.", activity: ["Feature branch analytics-live", "Touched dashboard, API, and cache layers", "Unblocked reporting epic"] },
    { login: "sol", name: "Sol Morgan", avatar: "", count: 24, summary: "Reduced flaky integration tests in checkout pipeline.", detail: "Reliability contributor improving checkout pipeline confidence and CI speed.", activity: ["CI pass rate trending up", "Quarantined 3 unstable specs", "Cut checkout test runtime by 18%"] },
    { login: "juno", name: "Juno Wright", avatar: "", count: 19, summary: "Owns API schema cleanup and breaking-change notes.", detail: "API steward cleaning schema drift and documenting breaking changes before release.", activity: ["12 endpoints updated", "OpenAPI diff ready", "Migration notes drafted"] },
    { login: "ren", name: "Ren Okafor", avatar: "", count: 17, summary: "Pairing on search latency and index warming.", detail: "Performance contributor pairing on search latency, index warming, and query tracing.", activity: ["p95 latency down 23%", "Added trace spans to search-api", "Pairing with platform team"] }
  ]
};
const els = {
  repoForm: document.querySelector("#repoForm"), repoInput: document.querySelector("#repoInput"), tokenInput: document.querySelector("#tokenInput"), demoButton: document.querySelector("#demoButton"), statusText: document.querySelector("#statusText"),
  repoName: document.querySelector("#repoName"), repoDescription: document.querySelector("#repoDescription"), starsMetric: document.querySelector("#starsMetric"), forksMetric: document.querySelector("#forksMetric"), issuesMetric: document.querySelector("#issuesMetric"), languageMetric: document.querySelector("#languageMetric"), languageStrip: document.querySelector("#languageStrip"),
  coreTitle: document.querySelector("#coreTitle"), coreSubtitle: document.querySelector("#coreSubtitle"), connections: document.querySelector("#connections"), contributorsLayer: document.querySelector("#contributorsLayer"), detailName: document.querySelector("#detailName"), detailSummary: document.querySelector("#detailSummary"), activityList: document.querySelector("#activityList")
};
function formatNumber(value) { return new Intl.NumberFormat("en", { notation: "compact" }).format(value || 0); }
function escapeHtml(value) { return String(value || "").replace(/[&<>"]/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[char])); }
function setStatus(message, isError = false) { els.statusText.textContent = message; els.statusText.classList.toggle("error", isError); }
function headers() { const token = els.tokenInput.value.trim() || localStorage.getItem("repoverse.githubToken") || ""; return token ? { Authorization: `Bearer ${token}`, Accept: "application/vnd.github+json" } : { Accept: "application/vnd.github+json" }; }
async function github(path) { const res = await fetch(`https://api.github.com${path}`, { headers: headers() }); if (!res.ok) throw new Error(`${res.status} ${res.statusText}`); return res.json(); }
async function loadGithubRepo(fullName) {
  const match = fullName.trim().match(/^([\w.-]+)\/([\w.-]+)$/); if (!match) throw new Error("Use owner/repo format, for example vercel/next.js");
  if (els.tokenInput.value.trim()) localStorage.setItem("repoverse.githubToken", els.tokenInput.value.trim());
  const [, owner, repo] = match; setStatus(`Loading ${owner}/${repo} from GitHub...`);
  const [repoData, contributors, pulls, commits, languages] = await Promise.all([
    github(`/repos/${owner}/${repo}`), github(`/repos/${owner}/${repo}/contributors?per_page=8`), github(`/repos/${owner}/${repo}/pulls?state=open&per_page=20`), github(`/repos/${owner}/${repo}/commits?per_page=20`), github(`/repos/${owner}/${repo}/languages`)
  ]);
  const people = contributors.slice(0, 8).map((c) => {
    const commit = commits.find((item) => item.author && item.author.login === c.login) || commits.find((item) => item.commit.author && item.commit.author.name === c.login);
    const pr = pulls.find((item) => item.user && item.user.login === c.login);
    const title = pr ? `Open PR: ${pr.title}` : commit ? commit.commit.message.split("\n")[0] : "Recent contribution activity detected";
    return { login: c.login, name: c.login, avatar: c.avatar_url, count: c.contributions, summary: title, detail: `${c.login} has ${c.contributions} public contributions in this repository snapshot.`, activity: [pr ? `PR #${pr.number} is open` : "No open PR in the first page", commit ? `Latest commit: ${commit.commit.message.split("\n")[0]}` : "No recent commit in the first page", `GitHub profile: ${c.html_url}`] };
  });
  render({ name: repoData.full_name, description: repoData.description || "No repository description provided.", stars: formatNumber(repoData.stargazers_count), forks: formatNumber(repoData.forks_count), issues: formatNumber(repoData.open_issues_count), language: repoData.language || "Mixed", subtitle: `${repoData.default_branch} branch live`, languages, people });
  setStatus(`Loaded ${repoData.full_name}. Showing top ${people.length} contributors, recent commits, and open PR context.`);
}
function render(data) {
  els.repoName.textContent = data.name; els.repoDescription.textContent = data.description; els.starsMetric.textContent = data.stars; els.forksMetric.textContent = data.forks; els.issuesMetric.textContent = data.issues; els.languageMetric.textContent = data.language; els.coreTitle.textContent = data.name; els.coreSubtitle.textContent = data.subtitle;
  renderLanguages(data.languages); renderConnections(data.people.length); renderContributors(data.people); focusPerson(data.people[0]);
}
function renderLanguages(languages) {
  const total = Object.values(languages || {}).reduce((sum, value) => sum + value, 0) || 1;
  els.languageStrip.innerHTML = Object.entries(languages || {}).slice(0, 6).map(([name, value], index) => `<span title="${escapeHtml(name)}" style="width:${(value / total) * 100}%;background:${COLORS[index % COLORS.length]}"></span>`).join("");
}
function renderConnections(count) {
  els.connections.innerHTML = `<defs><linearGradient id="lineA" x1="0%" x2="100%"><stop offset="0%" stop-color="#58a6ff"/><stop offset="54%" stop-color="#3fb950"/><stop offset="100%" stop-color="#db61a2"/></linearGradient><filter id="glow"><feGaussianBlur stdDeviation="3" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>` + ORBIT_POSITIONS.slice(0, count).map((pos, index) => `<path data-index="${index}" d="M500 360 C${pos.c1[0]} ${pos.c1[1]} ${pos.c2[0]} ${pos.c2[1]} ${pos.end[0]} ${pos.end[1]}"/>`).join("");
}
function renderContributors(people) {
  els.contributorsLayer.innerHTML = people.map((person, index) => { const pos = ORBIT_POSITIONS[index]; const color = COLORS[index % COLORS.length]; const avatar = person.avatar ? `<img src="${escapeHtml(person.avatar)}" alt=""/>` : `<span class="avatar-fallback">${escapeHtml(person.name.slice(0, 1).toUpperCase())}</span>`; return `<article class="contributor" data-index="${index}" tabindex="0" style="left:${pos.x}%;top:${pos.y}%;--shirt:${color}"><div class="avatar">${avatar}</div><div class="bubble"><strong>${escapeHtml(person.name)}</strong><p>${escapeHtml(person.summary)}</p><small>${escapeHtml(person.count)} contributions</small></div></article>`; }).join("");
  document.querySelectorAll(".contributor").forEach((node) => { const index = Number(node.dataset.index); node.addEventListener("mouseenter", () => focusPerson(people[index], index)); node.addEventListener("focus", () => focusPerson(people[index], index)); node.addEventListener("mouseleave", resetLines); node.addEventListener("blur", resetLines); });
}
function focusPerson(person, index = 0) { if (!person) return; els.detailName.textContent = person.name; els.detailSummary.textContent = person.detail; els.activityList.innerHTML = person.activity.map((item) => `<div><span></span>${escapeHtml(item)}</div>`).join(""); document.querySelectorAll(".connections path").forEach((line) => { const focused = Number(line.dataset.index) === index; line.style.opacity = focused ? "1" : "0.2"; line.style.strokeWidth = focused ? "4" : "2.5"; }); }
function resetLines() { document.querySelectorAll(".connections path").forEach((line) => { line.style.opacity = "0.82"; line.style.strokeWidth = "2.5"; }); }
els.repoForm.addEventListener("submit", async (event) => { event.preventDefault(); try { await loadGithubRepo(els.repoInput.value); } catch (error) { setStatus(`GitHub load failed: ${error.message}`, true); } });
els.demoButton.addEventListener("click", () => { render(demoRepo); setStatus("Demo mode is loaded. Enter any public GitHub repo to map real contributors."); });
render(demoRepo);
