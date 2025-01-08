// routes/users.js
const express = require('express');
const router = express.Router();
const usersController = require('../controllers/usersController');

router.get('/', usersController.getUsers);
router.put('/:id', usersController.updateUser);
router.delete('/:id', usersController.deleteUser);
router.post('/register', usersController.registerUser);
router.post('/login', usersController.loginUser);

module.exports = router;
