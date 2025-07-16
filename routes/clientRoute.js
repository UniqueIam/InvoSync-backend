const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const { 
    addClient,
    getClientByName,
    getAllClients
} = require('../controllers/clientsController');

const router = express.Router();

router.post('/addClient',authMiddleware,addClient);
router.get('/getAllClients',authMiddleware,getAllClients);
router.get('/getClientByName/:name',getClientByName);

module.exports = router;