const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const { showAllBusiness, addBusiness } = require('../controllers/businessController');

const router = express.Router();

router.post('/add-business',authMiddleware,addBusiness);
router.get('/getAllBusiness',authMiddleware,showAllBusiness);

module.exports = router;