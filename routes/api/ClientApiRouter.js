const express = require('express');
const router = express.Router();

const clientApiController = require('../../api/ClientAPI');

router.get('/', clientApiController.getClients);
router.get('/:clientId', clientApiController.getClientById);
router.post('/', clientApiController.createClient);
router.put('/:clientId', clientApiController.updateClient);
router.delete('/:clientId', clientApiController.deleteClient);

module.exports = router;