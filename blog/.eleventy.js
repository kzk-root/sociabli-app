const markdownIt = require("markdown-it");
const { DateTime } = require("luxon");

module.exports = function (eleventyConfig) {
  const md = new markdownIt();
  eleventyConfig.addFilter("markdown", (content) => {
    return md.render(content);
  });

  eleventyConfig.addFilter("date", (value, format = "yyyy") => {
    return DateTime.fromJSDate(value).toFormat(format);
  });

  return {
    dir: {
      input: "src",
      output: "dist",
    },
  };
};
