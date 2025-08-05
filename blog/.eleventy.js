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

  eleventyConfig.addPlugin(feedPlugin, {
    type: 'rss', // or "atom", "json"
    outputPath: '/feed.xml',
    collection: {
      name: 'posts', // your collection name
      limit: 10, // number of items in the feed
    },
    metadata: {
      language: 'en',
      title: 'Sociabli Blog',
      subtitle:
        'Sociabli helps you to share your content online. Post once and let Sociabli sync to other services and platforms.',
      base: 'https://sociab.li/',
      author: {
        name: 'Maurice Renck',
      },
    },
  })

  return {
    dir: {
      input: 'src',
      output: 'dist',
    },
  }
}
