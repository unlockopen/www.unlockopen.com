const markdownIt = require("markdown-it");

let mdIt = markdownIt({
    html: false,
    breaks: false,
    typographer:  true,
    quotes: '“”‘’'
});

const render = prop => mdIt.render(prop || "").trim().slice(3, -4)

module.exports = {
  eleventyComputed: {
    html: {
        legend: (data) => render(data.legend),
        title: (data) => render(data.title),
        lead: (data) => render(data.lead),
        disclosure: (data) => render(data.disclosure)
    }
  }
};