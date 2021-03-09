const express = require('express');
const router = express.Router();

const clientController = require('../controllers/clientController');
const authUtil = require('../util/authUtils')

router.get('/', clientController.showClientList);
router.get('/add', authUtil.permitAuthenticatedUser, clientController.showAddClientForm);
router.post('/add', authUtil.permitAuthenticatedUser, clientController.addClient);
router.get('/edit/:clientId', authUtil.permitAuthenticatedUser, clientController.showEditClientForm);
router.post('/edit', authUtil.permitAuthenticatedUser, clientController.updateClient);
router.get('/details/:clientId', clientController.showClientDetails);
router.get('/delete/:clientId', authUtil.permitAuthenticatedUser, clientController.deleteClient);

module.exports = router;
