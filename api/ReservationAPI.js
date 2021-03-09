const ReservationRepository = require('../repository/mysql2/ReservationRepository');

exports.getReservations = (req, res, next) => {
    ReservationRepository.getReservations()
        .then(reservations => {
            res.status(200).json(reservations);
        })
        .catch(err => {
           console.log(err);
        });
};

exports.getReservationById = (req, res, next) => {
    const reservationId = req.params.reservationId;
    ReservationRepository.getReservation(reservationId)
        .then(reservation => {
            if(!reservation) {
                res.status(404).json({
                    message: 'Reservation with id: '+reservationId+' not found'
                })
            } else {
                res.status(200).json(reservation);
            }
        });
};

exports.createReservation = (req, res, next) => {
    ReservationRepository.createReservation(req.body)
        .then(newObj => {
           res.status(201).json(newObj);
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
};

exports.updateReservation = (req, res, next) => {
    const reservationId = req.params.reservationId;
    ReservationRepository.updateReservation(reservationId, req.body)
        .then(result => {
           res.status(200).json({message: 'Reservation updated!', reservation: result});
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });

};

exports.deleteReservation = (req, res, next) => {
    const reservationId = req.params.reservationId;
    ReservationRepository.deleteReservation(reservationId)
        .then(result => {
            res.status(200).json({message: 'Removed reservation', reservation: result});
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
};