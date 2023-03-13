const express = require('express');
const router = express.Router();

const newCotroller = require('../app/controllers/NewControllers');

router.get('/:slug', newCotroller.show);
router.get('/', newCotroller.index);

module.exports = router;
