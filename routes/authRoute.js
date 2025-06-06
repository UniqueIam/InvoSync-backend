const express = require('express');
const { 
    registerCompany, 
    companyLogin, 
    adminLogin, 
    editCompanyDetails
} = require('../controllers/authController');
const authMidleware = require('../middleware/authMiddleware')

const router = express.Router();

router.post('/registerCompany',registerCompany);
router.post('/loginCompany',companyLogin);
router.post('/loginAdmin',adminLogin);
router.put('/edit/company/details',authMidleware, editCompanyDetails); 

module.exports = router;