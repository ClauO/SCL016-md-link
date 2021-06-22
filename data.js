const links = [
  {
    href: 'https://es.wikipedia.org/wiki/Markdown',
    text: 'Markdown',
    file: "C:/Users/cosse/OneDrive/Escritorio/SCL016-md-link/README2.md"
  },
  {
    href: 'https://nodejs.org/',
    text: 'Node.js',
    file: "C:/Users/cosse/OneDrive/Escritorio/SCL016-md-link/README2.md"
  },
  {
    href: 'https://user-images.githubusercontent.com/110297/42118443-b7a5f1f0-7bc8-11e8-96ad-9cc5593715a6.jpg',
    text: 'md-links',
    file: "C:/Users/cosse/OneDrive/Escritorio/SCL016-md-link/README2.md"
  }
]

const dirPath = "C:/Users/cosse/OneDrive/Escritorio/SCL016-md-link/README2.md";

const wrongDirPath = "C:/Users/cosse/OneDrive/Escritorio/SCL016-md-link/README2.m";

const options = {
validate: false,
stats: false
};


module.exports = { links, dirPath, wrongDirPath, options };