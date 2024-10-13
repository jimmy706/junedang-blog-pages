const fs = require("fs");
const axios = require("axios");
const path = require("path");
const marked = require("marked");

const pagesLocation = path.join(__dirname, "docs");
const htmlPagesLocation = path.join(__dirname, "html-pages");
const devToUrl = "https://dev.to/api/articles?username=junedang";
const API_KEY = process.env.API_KEY;
axios
  .get(devToUrl, {
    headers: {
      "api-key": API_KEY,
    },
  })
  .then((response) => {
    const articles = response.data;
    console.info(`Getting ${articles.length} articles`);
    for (const article of articles) {
      const { slug } = article;

      fetchArticle(slug);
    }
  })
  .catch((error) => {
    console.error(error);
  });

async function fetchArticle(slug) {
  try {
    console.info(`Fetching article ${slug}`);
    const articleDetails = `https://dev.to/api/articles/junedang/${slug}`;

    const response = await axios.get(articleDetails);
    const { body_html, body_markdown } = response.data;
    saveArticle(slug, String(body_markdown), "md");
    saveArticle(slug, String(body_html), "html");
  } catch (error) {
    console.log(error);
  }
}

function saveArticle(articleName, content, file_type) {
    try {
        console.info(`Saving article ${articleName} with type ${file_type}`);
        const filePath =
          file_type === "md"
            ? path.join(pagesLocation, articleName + ".md")
            : path.join(htmlPagesLocation, articleName + ".html");
        fs.writeFileSync(filePath, content);
    } catch(error) {
        console.log(error)
    }
}
