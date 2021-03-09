const express = require('express');
const router = express.Router();

const roomController = require('../controllers/roomController');
const authUtil = require('../util/authUtils')

router.get('/', roomController.showRoomList);
router.get('/add', authUtil.permitAuthenticatedUser, roomController.showAddRoomForm);
router.post('/add', authUtil.permitAuthenticatedUser, roomController.addRoom);
router.get('/edit/:roomId', authUtil.permitAuthenticatedUser, roomController.showEditRoomForm);
router.post('/edit', authUtil.permitAuthenticatedUser, roomController.updateRoom);
router.get('/details/:roomId', roomController.showRoomDetails);
router.get('/delete/:roomId', authUtil.permitAuthenticatedUser, roomController.deleteRoom);

module.exports = router;
