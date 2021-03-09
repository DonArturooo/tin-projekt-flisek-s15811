const express = require('express');
const router = express.Router();

const reservationApiController = require('../../api/ReservationAPI');

router.get('/', reservationApiController.getReservations);
router.get('/:reservationId', reservationApiController.getReservationById);
router.post('/', reservationApiController.createReservation);
router.put('/:reservationId', reservationApiController.updateReservation);
router.delete('/:reservationId', reservationApiController.deleteReservation);

module.exports = router;