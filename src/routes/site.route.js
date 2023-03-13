const express = require('express');
const router = express.Router();

const siteCotroller = require('../app/controllers/SiteControllers');

router.get('/search', siteCotroller.search);
router.get('/', siteCotroller.home);

module.exports = router;
