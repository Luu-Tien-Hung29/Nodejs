const express = require('express')
const router = express.Router()

const newCotroller = require('../app/controllers/NewControllers')

router.use('/:slug', newCotroller.show )
router.use('/', newCotroller.index )


module.exports = router