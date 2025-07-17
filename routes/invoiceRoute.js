const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const upload = require('../middleware/multer');
const {createInvoice, shouldShowLogoUpload, getAllInvoices, getAllInvoicesByDate, getInvoiceByNumber} = require('../controllers/invoiceController');

const router = express.Router();

router.post("/createInvoice",authMiddleware,upload.single('logo'),createInvoice);
router.get('/checkLogo',authMiddleware,shouldShowLogoUpload);   
router.get('/getAllInvoices',authMiddleware,getAllInvoices);
router.get('/getInvoice/:invoiceNumber',authMiddleware,getInvoiceByNumber);
router.get('/getAllInvoices/date',authMiddleware,getAllInvoicesByDate);

module.exports = router;