var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express', navLocation: 'main' });
});

const AuthController = require('../controllers/authController');
router.post('/login', AuthController.login);
router.get('/logout', AuthController.logout);
router.get('/register', AuthController.showRegisterForm);
router.post('/register', AuthController.register);

module.exports = router;
