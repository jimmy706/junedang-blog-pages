# Agent Instructions for junedang-blog-pages

## Project Overview

This is a **Jekyll-based GitHub Pages blog** that publishes technical articles on software engineering, AI, and system design. All articles live in `jekyll/` as individual Markdown files with YAML front matter. The site uses the `architect` remote theme and is built/deployed automatically by GitHub Pages.

## Architecture

- **Content**: `jekyll/*.md` - Each file is a self-contained blog post
- **Configuration**: `jekyll/_config.yml` - Jekyll settings, plugins, and theme config
- **Build System**: GitHub Pages (automatic on push to `master`)
- **Theme**: `pages-themes/architect@v0.2.0` (remote theme, no local template files)
- **Dependencies**: Ruby gems managed via `Gemfile` (Jekyll + GitHub Pages plugins)

## Critical Workflows

### Creating New Articles

1. **File location**: Always save to `jekyll/<slugified-topic>.md`
2. **Slug format**: Use lowercase, hyphens only (e.g., `api-gateway-design-and-key-components.md`)
3. **Required front matter** (see examples in `jekyll/api-gateway-design-and-key-components.md`):
   ```yaml
   ---
   title: "Title Case Topic"
   description: "One clear sentence describing the article"
   tags: [<key-topics>]
   image: https://storage.googleapis.com/junedang_blog_images/<slug>/<image>.webp
   date: YYYY-MM-DD
   ---
   ```
4. **Date format**: Use ISO format `YYYY-MM-DD` (e.g., `2025-11-14`)

### Article Structure (see `.github/copilot-instructions.md`)

- **3–5 H2 sections** covering the most relevant subtopics
- **Natural tone**: Blog-style, not academic or overly technical
- **Code examples**: Use fenced code blocks with language hints
- **Tables**: For comparisons in "Design and trade-offs" section
- **Questions section**: 1–2 knowledge reminder questions at end
- **Internal links**: Link related concepts to existing articles using `/posts/<slug>` format

**Example internal link pattern**:
```markdown
For more on [API design](/posts/api-gateway-design-and-key-components), see our architecture guide.
```

### Building & Testing Locally

While GitHub Pages auto-builds on push, you can test locally:

```powershell
# Install dependencies
bundle install

# Serve locally (navigate to http://localhost:4000)
cd jekyll
bundle exec jekyll serve
```

**No build artifacts are committed** - GitHub Pages handles compilation.

## Project-Specific Conventions

### Naming Patterns
- **Files**: Use the exact slug from the topic (e.g., topic "API Gateway Design" → `api-gateway-design.md`)
- **No dev.to artifacts**: Some files have legacy suffixes like `-2hoc.md` from migrations; new articles should NOT include these

### Front Matter Rules
- **Always include `image`** pointing to Google Cloud Storage bucket
- **Tags**: First tag should be `research`, followed by 2–4 specific keywords
- **Title**: Use title case, wrap in quotes to escape colons
- **Description**: Single sentence, no period at end

### Content Style (Discovered from Existing Articles)
- **Active voice, direct statements** (see `five-patterns-for-web-communication-that-actually-ship.md`)
- **Visual hierarchy**: Use H2 for major sections, H3 for details
- **Real examples**: Include runnable code or clear pseudocode, never "TBD" or placeholders
- **Comparisons**: Use tables with columns: Option | Pros | Cons | Use when
- **Closing section**: "Closing Thoughts" (2–3 sentences wrapping up)

### Internal Linking Strategy
Cross-reference existing articles when concepts overlap. Check `jekyll/` directory for related topics and link using:
```markdown
[concept name](/posts/<article-slug>)
```

## External Dependencies

- **GitHub Pages**: Auto-builds and deploys from `master` branch
- **Remote Theme**: `architect` theme (no local customization)
- **Plugins**: `jekyll-paginate`, `jekyll-relative-links`, `jekyll-github-metadata`
- **Image CDN**: Google Cloud Storage at `https://storage.googleapis.com/junedang_blog_images/`

## Common Pitfalls to Avoid

1. **Don't create files outside `jekyll/`** - Articles must be in the Jekyll source directory
2. **Don't skip front matter validation** - Missing fields break rendering
3. **Don't use placeholder content** - Every article must be complete and factual
4. **Don't hardcode dates in content** - Use front matter `date` field only
5. **Don't create TODO sections** - Research thoroughly and deliver complete content

## Quality Checklist (from `.github/copilot-instructions.md`)

Before finalizing any article:
- [ ] Front matter has all required fields
- [ ] 3–5 H2 subtopics (no more, no less)
- [ ] All claims with numbers/assertions have references
- [ ] Code examples compile or marked as pseudocode
- [ ] No TODOs or "TBD" placeholders
- [ ] Questions section included
- [ ] Internal links added where relevant

## Example Article Structure

See `jekyll/api-gateway-design-and-key-components.md` or `jekyll/five-patterns-for-web-communication-that-actually-ship.md` for reference implementations that follow all conventions correctly.
