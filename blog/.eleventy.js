const markdownIt = require('markdown-it')
const { DateTime } = require('luxon')
const { feedPlugin } = require('@11ty/eleventy-plugin-rss')

module.exports = function (eleventyConfig) {
  const md = new markdownIt()
  eleventyConfig.addFilter('markdown', (content) => {
    return md.render(content)
  })

  eleventyConfig.addFilter('date', (value, format = 'yyyy') => {
    return DateTime.fromJSDate(value).toFormat(format)
  })

  eleventyConfig.addFilter('toRFC3339', (dateInput) => {
    // Handles JS Date object or date string
    return DateTime.fromJSDate(
      typeof dateInput === 'string' ? new Date(dateInput) : dateInput
    ).toISO() // ISO 8601 matches RFC 3339
  })
  // eleventyConfig.addPlugin(feedPlugin)

  return {
    dir: {
      input: 'src',
      output: 'dist',
    },
  }
}
