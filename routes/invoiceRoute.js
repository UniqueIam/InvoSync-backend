const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const upload = require('../middleware/multer');
const {createInvoice} = require('../controllers/invoiceController');

const router = express.Router();

router.post("/createInvoice",authMiddleware,upload.single('logo'),createInvoice);

module.exports = router;