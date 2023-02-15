const express = require('express')
const router = express.Router()

const siteCotroller = require('../app/controllers/SiteControllers')

router.use('/search', siteCotroller.search )
router.use('/', siteCotroller.home )


module.exports = router