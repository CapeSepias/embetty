const { BadRequest } = require('../../lib/exceptions')
const express = require('express')

const router = express.Router()

router.param('id', async (req, res, next, id) => {
  try {
    if (!/^[\w-]+$/.test(id)) throw BadRequest
    req.video = await req.app.get('embetty').loadYoutubeVideo(id)
    next()
  } catch (e) {
    next(e)
  }
})

router.get('/:id-poster-image', async (req, res, next) => {
  try {
    const { data, type } = await req.video.getPosterImage()
    if (!data) return next()
    res.type(type)
    res.send(data)
  } catch (e) {
    next(e)
  }
})

router.get('/:id.amp', (req, res) => {
  const attributes = { ...req.query }
  res.render('video.html', { video: req.video, attributes })
})

router.get('/:id', (req, res) => {
  res.send(req.video)
})

module.exports = router
