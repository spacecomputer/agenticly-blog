source "https://rubygems.org"

# Use the github-pages gem so local builds match GitHub's native Pages build
# exactly (it pins Jekyll, the supported themes, and the plugin allowlist).
gem "github-pages", group: :jekyll_plugins

# Plugins used by the site (also bundled via github-pages, listed for clarity)
group :jekyll_plugins do
  gem "jekyll-feed"
  gem "jekyll-seo-tag"
  gem "jekyll-sitemap"
end

# Windows / JRuby compatibility shims (harmless elsewhere)
platforms :mingw, :x64_mingw, :mswin, :jruby do
  gem "tzinfo", ">= 1", "< 3"
  gem "tzinfo-data"
end

gem "wdm", "~> 0.1.1", platforms: [:mingw, :x64_mingw, :mswin]
gem "http_parser.rb", "~> 0.6.0", platforms: [:jruby]
