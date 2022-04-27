const express = require("express");
const router = express.Router();
const controller = require('./users.controller');
// GET users listing request
router.get('/', controller.users);

module.exports = router;