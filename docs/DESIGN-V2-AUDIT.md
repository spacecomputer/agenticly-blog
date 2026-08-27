# Design V2 branch audit — `design/v2-align`

Date: 2026-08-27 (chrome rebuilt against agenticly-design skill)  
Repo: [spacecomputer/agenticly-blog](https://github.com/spacecomputer/agenticly-blog)  
Branch: `design/v2-align`

---

## 1. How blog posts are made (publishing pipeline)

### Source of posts

Posts are **not** written in the product monorepo. They are generated and opened as PRs by an external agent:

| Piece | Detail |
|-------|--------|
| Author bot | GitHub App **`okara-coding-agent`** (Okara CMO Agent) |
| Commit author | `Okara CMO Agent <agent+…@okara.ai>` |
| Branch pattern | `AI-cmo/article/<id>-<timestamp>` |
| PR body | “Opened by Okara CMO Agent — review the post before merging.” |

Each PR typically adds:

1. `_posts/YYYY-MM-DD-slug.md` — Markdown with Jekyll front matter  
2. `assets/img/<slug>.png` — hero / OG-style image  

### Deploy path (after merge)

```
Okara CMO Agent → PR → merge to main
  → GitHub Actions jekyll-gh-pages.yml
  → GitHub Pages
  → Cloudflare Worker proxies agenticly.app/blog*
```

---

## 2. Design source of truth (this branch)

**Chrome is rebuilt from the `agenticly-design` skill — Design System v2 (White), marketing kit.**

| Skill source | Used for |
|--------------|----------|
| `tokens/colors.css` | Ink `#26262B`, text `#202024`, primary green `#2E8B62`, borders `#E4E4E8`, dark `[data-theme]` equivalent via `prefers-color-scheme` |
| `tokens/fonts.css` / `typography.css` | **Geist**, **Newsreader**, **Geist Mono** |
| `assets/logo-mark.svg` | Orbit mark (copied to `assets/img/logo-mark.svg` + favicon) |
| `ui_kits/marketing_site/` | Sticky blurred nav, serif wordmark, ink primary CTA, green accent CTAs, bordered cards |

Earlier commits on this branch that used product LaunchDarkly “colorsV2” / Inter Tight were **replaced** — that experiment is not the skill system.

### Files touched (chrome)

| File | Change |
|------|--------|
| `assets/css/agenticly.css` | Full rewrite to skill tokens + marketing patterns |
| `_layouts/default.html` | Skill fonts; sticky nav; logo-mark + Newsreader wordmark; Sign in / Get started |
| `_layouts/home.html` | Serif masthead with italic clause; featured + capability cards |
| `_layouts/post.html` | Green “Start free trial” CTA band |
| `_includes/logo.html` | Skill orbit paths, `currentColor` |
| `assets/img/logo-mark.svg` | Copied from skill |
| `assets/img/agenticly-mark.svg` | Same mark for favicon |
| `docs/DESIGN-V2-AUDIT.md` | This file |

### Explicitly **not** changed

- `_posts/**` content  
- Hero PNGs / Okara workflow  
- Cloudflare Worker / Pages workflow / `_config.yml`

---

## 3. Preview

```bash
cd agenticly-blog
bundle exec jekyll serve
# http://127.0.0.1:4000/blog/
```
