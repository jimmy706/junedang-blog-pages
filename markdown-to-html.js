const fs = require('fs');
const path = require('path');
const marked = require('marked');

const pagesLocation = path.join(__dirname, 'pages');
const htmlPagesLocation = path.join(__dirname, 'html-pages');
const mdFiles = fs.readdirSync(pagesLocation);

for (const fileName of mdFiles) {
    const filePath = path.join(pagesLocation, fileName);
    const content = fs.readFileSync(filePath, 'utf-8');
    const html = marked.parse(content);

    const htmlFileName = fileName.replace('.md', '.html');
    const htmlFilePath = path.join(htmlPagesLocation, htmlFileName);
    fs.writeFileSync(htmlFilePath, html);
}