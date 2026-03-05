const express = require('express');
const router = express.Router();
const path = require('path');
const registerController = require(path.join('..','..','controllers','registerController'));

router.post('/', registerController.handleNewUser);

module.exports = router;