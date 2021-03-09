const express = require('express');
const router = express.Router();

const reservationController = require('../controllers/reservationController');
const authUtil = require('../util/authUtils')

router.get('/', reservationController.showReservationList);
router.get('/add', authUtil.permitAuthenticatedUser, reservationController.showAddReservationFrom);
router.get('/addSimpleReservation', authUtil.permitAuthenticatedUser, reservationController.showAddSimpleReservationFrom);
router.get('/addClientReservation/:clientId', authUtil.permitAuthenticatedUser, reservationController.showAddReservationFromClient)
router.get('/addRoomReservation/:roomId', reservationController.showAddReservationFromRoom)
router.get('/details/:reservationId', reservationController.showReservationDetails);
router.post('/add', authUtil.permitAuthenticatedUser, reservationController.addReservation);
router.post('/addSimpleReservation', authUtil.permitAuthenticatedUser, reservationController.addSimpleReservation);
router.post('/addReservationFromRoom', reservationController.addReservationFromRoom);
router.post('/addReservationFromClient', authUtil.permitAuthenticatedUser, reservationController.addReservationFromClient);
router.get('/edit/:reservationId', authUtil.permitAuthenticatedUser, reservationController.showEditReservation);
router.post('/edit/', authUtil.permitAuthenticatedUser, reservationController.updateReservation);
router.get('/delete/:reservationId', authUtil.permitAuthenticatedUser, reservationController.deleteReservation);

module.exports = router;
