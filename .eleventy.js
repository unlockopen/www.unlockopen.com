const markdownIt = require("markdown-it");
const moment = require('moment');
moment.locale('en');
const readingTime = require('eleventy-plugin-reading-time');

module.exports = function(eleventyConfig) {
    let mdIt = markdownIt({
        html: true,
        breaks: false,
        linkify: true,
        typographer:  true,
        quotes: '“”‘’',
    });
    eleventyConfig.setLibrary("md", mdIt);

    eleventyConfig.addPairedShortcode("markdown", function(content) {
        return mdIt.render(content);
    });

    eleventyConfig.addFilter('dateIso', date => {
        return moment(date).toISOString();
    });
     
    eleventyConfig.addFilter('dateFormated', date => {
       return moment(date).format('LL'); // E.g. May 31, 2019
    });

    eleventyConfig.addPlugin(readingTime);

    eleventyConfig.addPassthroughCopy("_src/articles/img");

    return {
        markdownTemplateEngine: "njk",
        dir: {
            input: "_src",
            includes: "_includes",
            layouts: "_layouts"
        }
        // Your normal return options
    };
};


