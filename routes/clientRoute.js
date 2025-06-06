const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const { 
    addClient,
    getClientByName
} = require('../controllers/clientsController');

const router = express.Router();

router.post('/addClient',authMiddleware,addClient);
router.get('/getClientByName/:name',getClientByName);

module.exports = router;