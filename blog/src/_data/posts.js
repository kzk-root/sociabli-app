const EleventyFetch = require('@11ty/eleventy-fetch')

module.exports = async function () {
  const data = await EleventyFetch('https://konzentrik.de/sociabli-blogposts', {
    duration: '1h',
    type: 'json',
  })

  return data.map((post) => ({
    ...post,
    date: new Date(post.date),
  }))
}
