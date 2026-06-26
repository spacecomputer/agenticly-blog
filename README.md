# agenticly-blog

The **Agenticly** blog — a [Jekyll](https://jekyllrb.com) site hosted on
GitHub Pages and served publicly at **https://agenticly.app/blog** through a
small Cloudflare Worker.

## How it fits together

```
visitor → agenticly.app/blog/...  →  Cloudflare Worker  →  spacecomputer.github.io/agenticly-blog/...
                                       (worker/)              (GitHub Pages native Jekyll build)
```

- GitHub Pages builds the Jekyll site natively on every push to `main` and
  serves it at `https://spacecomputer.github.io/agenticly-blog/`.
- Jekyll's `baseurl` is set to `/blog`, so every generated link and asset URL
  already points at `/blog/...` — matching the public path.
- The Cloudflare Worker (`worker/`) catches `agenticly.app/blog*` and proxies it
  to the GitHub Pages origin, swapping the `/blog` prefix for `/agenticly-blog`.

## Writing posts

Add a Markdown file to `_posts/` named `YYYY-MM-DD-title.md` with front matter:

```markdown
---
layout: post
title: "My post title"
date: 2026-06-26 09:00:00 -0000
categories: some-category
---

Post body in Markdown.
```

Commit and push to `main`; GitHub Pages rebuilds automatically.

## Local preview (optional)

Requires Ruby + Bundler:

```bash
bundle install
bundle exec jekyll serve
# preview at http://127.0.0.1:4000/blog/
```

## One-time setup

### 1. Enable GitHub Pages
Repo **Settings → Pages → Build and deployment**:
- **Source:** Deploy from a branch
- **Branch:** `main` / `/ (root)`

Leave the **Custom domain** field blank — the site stays on `github.io`; the
Worker handles the public domain. After the first build, confirm
`https://spacecomputer.github.io/agenticly-blog/` loads.

### 2. Deploy the Cloudflare Worker

```bash
cd worker
npm install
npx wrangler login      # one-time browser auth
npx wrangler deploy
```

The `routes` in `worker/wrangler.toml` bind the Worker to `agenticly.app/blog`
and `agenticly.app/blog/*` on the existing `agenticly.app` zone.

> **Note:** Wrangler needs Node.js 18+. Your default `node` is older —
> use `nvm use 18` (or newer) in the `worker/` directory before installing.

### 3. Verify
Visit **https://agenticly.app/blog** — it should redirect to `/blog/` and show
the blog index.
