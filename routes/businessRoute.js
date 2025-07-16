const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const { showAllBusiness, addBusiness, editBusiness } = require('../controllers/businessController');

const router = express.Router();

router.post('/add-business',authMiddleware,addBusiness);
router.put('/update-business',authMiddleware,editBusiness);
router.get('/getAllBusiness',authMiddleware,showAllBusiness);

module.exports = router;