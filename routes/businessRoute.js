const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const { showAllBusiness } = require('../controllers/businessController');

const router = express.Router();

router.get('/getAllBusiness',authMiddleware,showAllBusiness);

module.exports = router;