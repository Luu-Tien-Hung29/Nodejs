const express = require('express');
const router = express.Router();

const authControllers = require('../app/controllers/authControllers');

router.post('/login', authControllers.login);
router.post('/register', authControllers.register);
router.post('/refresh', authControllers.refreshToken);
router.get('/', authControllers.home);

module.exports = router;
