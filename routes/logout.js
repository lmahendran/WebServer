const express = require('express');
const router = express.Router();
const path = require('path');
const logoutController = require(path.join('..','controllers','logoutController'));

router.get('/', logoutController.handleLogout);

module.exports = router;