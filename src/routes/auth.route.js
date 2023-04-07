const express = require('express');
const router = express.Router();

const authControllers = require('../app/controllers/authControllers');
const authMiddleware = require('../middleware/auth.middleware');

const isAuth = authMiddleware.isAuth;

router.post('/login', authControllers.login);
router.post('/register', authControllers.register);
router.post('/refresh', authControllers.refreshToken);
router.get('/user', isAuth ,authControllers.user);
router.get('/', authControllers.home);

module.exports = router;
