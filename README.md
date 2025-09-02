# Junedang Blog Pages

A Jekyll-based technical blog featuring articles about software development, containerization, version control, and web technologies. This repository contains markdown articles that are automatically built and deployed to GitHub Pages.

## What this project is about

This project is a technical blog that covers various aspects of software development and engineering. The blog features in-depth articles about:

- **Docker and Containerization**: Getting started guides, deployment strategies, and system architecture
- **Version Control**: Git fundamentals, best practices, and workflow patterns  
- **Web Technologies**: HTTP evolution, API design, browser rendering, and web protocols
- **Developer Tools**: Visual Studio Code extensions, productivity tips, and development workflows
- **Software Engineering**: Clean code practices, testing methodologies (TDD/DDD/BDD), and deployment strategies
- **System Architecture**: Microservices, API gateways, authentication protocols, and scalable system design

The content is designed for developers who want to deepen their understanding of modern software development practices and technologies.

## Project Structure

```
.
├── README.md                   # Project documentation
├── Gemfile                     # Ruby dependencies for Jekyll
├── .gitignore                 # Git ignore rules
├── .github/
│   └── workflows/
│       └── jekyll-gh-pages.yml # GitHub Actions workflow for auto-deployment
└── jekyll/                    # Main Jekyll site directory
    ├── _config.yml            # Jekyll configuration
    ├── _includes/             # Reusable template components
    │   ├── header.html        # Site header
    │   └── footer.html        # Site footer
    ├── api/
    │   └── pages.json         # JSON API endpoint for page metadata
    └── *.md                   # Blog articles (30+ technical articles)
```

### Key Components

- **Jekyll Site (`/jekyll/`)**: Contains the main Jekyll static site generator files
- **Blog Articles**: Individual markdown files with YAML front matter containing technical content
- **GitHub Actions**: Automated CI/CD pipeline that builds and deploys the site to GitHub Pages
- **API Endpoint**: JSON endpoint at `/api/pages/` that provides metadata about all articles
- **Templates**: Minimal header and footer includes for site structure

## How to Start

### Prerequisites

- Ruby (version 2.5 or higher)
- RubyGems
- Git

### Local Development Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/jimmy706/junedang-blog-pages.git
   cd junedang-blog-pages
   ```

2. **Install dependencies**
   ```bash
   # Install bundler if you don't have it
   gem install bundler
   
   # Install Jekyll and dependencies
   bundle install
   ```

3. **Run the site locally**
   ```bash
   # Navigate to Jekyll directory
   cd jekyll
   
   # Start the Jekyll development server
   bundle exec jekyll serve
   ```

4. **View the site**
   - Open your browser and go to `http://localhost:4000`
   - The site will automatically reload when you make changes to files

### Deployment

The site is automatically deployed to GitHub Pages using GitHub Actions:

- **Trigger**: Push to the `master` branch
- **Build**: Jekyll builds the site from the `/jekyll/` directory
- **Deploy**: Automatically deploys to GitHub Pages
- **URL**: The live site will be available at your GitHub Pages URL

### Adding New Articles

1. Create a new markdown file in the `/jekyll/` directory
2. Add YAML front matter with required fields:
   ```yaml
   ---
   title: "Your Article Title"
   description: "Brief description of the article"
   date: YYYY-MM-DD
   image: "optional-image-url"
   ---
   ```
3. Write your content in Markdown format
4. Commit and push to `master` branch for automatic deployment

### Development Commands

```bash
# Build the site without serving
bundle exec jekyll build

# Serve with draft posts
bundle exec jekyll serve --drafts

# Serve with incremental builds
bundle exec jekyll serve --incremental

# Build for production
JEKYLL_ENV=production bundle exec jekyll build
```

## Contributing

1. Fork the repository
2. Create a feature branch for your article or improvement
3. Add your content following the existing article format
4. Test locally using `bundle exec jekyll serve`
5. Submit a pull request

## License

This project contains technical articles and educational content. Please respect the author's work when referencing or sharing content.