const express = require('express');
const { 
    createProduct, 
    getAllProducts
} = require('../controllers/productController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.post("/company/product",authMiddleware,createProduct);
router.get("/getAllProducts",authMiddleware,getAllProducts);

module.exports = router;