const express = require('express');
const router = express.Router();
const path = require('path');
const refreshTokenController = require(path.join('..','controllers','refreshTokenController'));

router.get('/', refreshTokenController.handleRefreshToken);

module.exports = router;