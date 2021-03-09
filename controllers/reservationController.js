const ReservationRepository = require('../repository/mysql2/ReservationRepository');
const ClientRepository = require('../repository/mysql2/ClientRepository');
const RoomRepository = require('../repository/mysql2/RoomRepository');
const { boolean } = require('joi');
const { pause } = require('../config/mysql2/db');
const e = require('express');

exports.showReservationList = (req, res, next) => {
    //res.render('pages/reservation/rezerwacje', { navLocation: 'reservation' });
    ReservationRepository.getReservations()
    .then(reservations => {
        res.render('pages/reservation/rezerwacje', { reservations: reservations, navLocation: 'reservation' });
    });
}
exports.showAddReservationFrom = (req, res, next) => {
    let allRooms;
    RoomRepository.getRooms()
        .then(rooms => {
            allRooms = rooms;
            res.render('pages/reservation/rezerwacja', {
                reservation: { client: {}, room: {} },
                formMode: 'createNew',
                pageTitle: 'Nowe rezerwacja',
                btnLabel: 'Dodaj rezerwacje',
                allRooms: allRooms,
                formAction: '/reservation/add',
                navLocation: 'reservation',
                validationErrors: []
            });
        }
        );
}
exports.showAddSimpleReservationFrom = (req, res, next) => {
    let allRooms, allClients;
    ClientRepository.getClients().then(clients => {
        allClients = clients;
        RoomRepository.getRooms()
        .then(rooms => {
            allRooms = rooms;
            res.render('pages/reservation/rezerwacjaProsta', {
                reservation: { client: {}, room: {} },
                formMode: 'createNew',
                pageTitle: 'Nowe rezerwacja',
                btnLabel: 'Dodaj rezerwacje',
                allRooms: allRooms,
                allClients: allClients,
                formAction: '/reservation/addSimpleReservation',
                navLocation: 'reservation',
                validationErrors: []
            });
        }
        );
    })
    
}

exports.addSimpleReservation = (req, res, next) => {
    const reservationData = { ...req.body };
    const reservation = {
        dateFrom: reservationData.dateFrom,
        dateTo: reservationData.dateTo,
        visitors: reservationData.visitors,
        spendDays: reservationData.spendDays,
        client: {},
        room: {}
    }

    let allClients, allRooms;

    ClientRepository.getClientId(reservationData.visitor)
        .then(clients => {
            RoomRepository.getRoomId(reservationData.numberRoom)
            .then(rooms => {
                    reservation.client = clients;
                    reservation.room = rooms;
                    ReservationRepository.createReservation(reservation)
                        .then( result => {
                            res.redirect('/reservation');
                        })
                        .catch(err => {
                            if(reservation.dateFrom != ''){
                                reservation.dateFrom = new Date(reservationData.dateFrom)
                            }
                            else{
                                reservation.dateFrom = null
                            }
                            if(reservation.dateTo != ''){
                                reservation.dateTo = new Date(reservationData.dateTo)
                            }
                            else{
                                reservation.dateTo = null
                            }
                            ClientRepository.getClients().then(clients => {
                                allClients = clients;
                                RoomRepository.getRooms().then(rooms => {
                                    allRooms = rooms
                                    res.render('pages/reservation/rezerwacjaProsta', {
                                        reservation: reservation,
                                        formMode: 'createNew',
                                        pageTitle: 'Nowe rezerwacja',
                                        btnLabel: 'Dodaj rezerwacje',
                                        allRooms: allRooms,
                                        allClients: allClients,
                                        formAction: '/reservation/addSimpleReservation',
                                        navLocation: 'reservation',
                                        validationErrors: err.details
                                    })
                                })
                        });
                    });
            });
            });
        
};

exports.updateReservation = (req, res, next) => {
    const reservationData = { ...req.body };

    let client, allRooms;

    ClientRepository.getClientId(reservationData.clientId)
        .then(clients => {
            client = { 
                _id: clients._id,
                firstName: clients.firstName,
                lastName: clients.lastName,
                email: clients.email,
                phone: clients.phone,
            }
            RoomRepository.getRoomId(reservationData.numberRoom)
        .then(rooms => {
            room = rooms;
            ReservationRepository.getReservationById(reservationData._id)
                 .then(reservation => {
                    reservation.client = client;
                    reservation.room = room;

                    if(reservationData.dateFrom == ''){
                        reservation.dateFrom = null
                    }else{
                        reservation.dateFrom = new Date(reservationData.dateFrom);
                    }
                    if(reservationData.dateTo == ''){
                        reservation.dateTo = null
                    }else{
                        reservation.dateTo = new Date(reservationData.dateTo);
                    }
                   
                    reservation.visitors =reservationData.visitors;
                    reservation.dateFrom

                    if(reservationData.spendDays == ''){
                        reservation.spendDays = 0
                    }else{
                        reservation.spendDays = reservationData.spendDays;
                    }
                    ReservationRepository.updateReservation(reservation._id, reservation)
                        .then( result => {
                            res.redirect('/reservation');
                        })
                        .catch(err => {
                            RoomRepository.getRooms().then(rooms => {
                                allRooms = rooms
                                res.render('pages/reservation/rezerwacja', {
                                    reservation: reservation,
                                    formMode: 'edit',
                                    pageTitle: 'Edytuj rezerwacje',
                                    btnLabel: 'Edytuj rezerwacje',
                                    allRooms: allRooms,
                                    formAction: '/reservation/edit',
                                    navLocation: 'reservation',
                                    validationErrors: err.details
                                });
                            })
                    });
                });
        });
        });
    
};
exports.addReservation = (req, res, next) => {
    const reservationData = { ...req.body };
    let client, data;
    const reservation = {
        dateFrom: reservationData.dateFrom,
        dateTo: reservationData.dateTo,
        visitors: reservationData.visitors,
        spendDays: reservationData.spendDays,
        client: {
            _id: '',
            firstName: '',
            lastName: '',
            email: '',
            phone: '',
        },
        room: {
            _id: '',
            numberRoom: '',
            numberOfSpace: '',
        }
    }
    data = checkClient(reservationData);
    client = data.client;

    reservation.client.firstName = client.firstName
    reservation.client.lastName = client.lastName
    reservation.client.email = client.email
    reservation.client.phone = client.phone
    ClientRepository.createClient(clientData).then(client =>
        {
        ClientRepository.findClient(reservation.client)
            .then(cli => {
                reservation.client._id = cli._id;

                reservation.room._id = data.room._id
                reservation.room.numberRoom = data.room.numberRoom
                reservation.room.numberOfSpace = data.room.numberOfSpace
                
                ReservationRepository.createReservation(reservation)
                    .then( result => {
                        res.redirect('/reservation');
                    }).catch(err => {
                    RoomRepository.getRooms()
                    .then(rooms => {
                        allRooms = rooms;
                        ClientRepository.deleteClient(reservation.client._id)
                        if(reservation.dateFrom != '' && reservationData.dateFrom != ''){
                            reservation.dateFrom = new Date(reservationData.dateFrom);
                        }
                        if(reservation.dateTo != '' && reservationData.dateTo != ''){
                            reservation.dateTo = new Date(reservationData.dateTo);
                        }
                        res.render('pages/reservation/rezerwacja', {
                            reservation: reservation,
                            formMode: 'createNew',
                            pageTitle: 'Nowe rezerwacja',
                            btnLabel: 'Dodaj rezerwacje',
                            allRooms: allRooms,
                            formAction: '/reservation/add',
                            navLocation: 'reservation',
                            validationErrors: err.details
                        });
                 });
            });
        });

        }).catch(err => {
            if(reservation.dateFrom != '' && reservationData.dateFrom != ''){
                reservation.dateFrom = new Date(reservationData.dateFrom);
            }
            if(reservation.dateTo != '' && reservationData.dateTo != ''){
                reservation.dateTo = new Date(reservationData.dateTo);
            }
            RoomRepository.getRooms()
            .then(rooms => {
                allRooms = rooms;
                res.render('pages/reservation/rezerwacja', {
                    reservation: reservation,
                    formMode: 'createNew',
                    pageTitle: 'Nowe rezerwacja',
                    btnLabel: 'Dodaj rezerwacje',
                    allRooms: allRooms,
                    formAction: '/reservation/add',
                    navLocation: 'reservation',
                    validationErrors: err.details
                });
        }
        );
    })
    ;  
};
exports.addReservationFromRoom = (req, res, next) => {
    const reservationData = { ...req.body };
    let client, data;
    const reservation = {
        dateFrom: reservationData.dateFrom,
        dateTo: reservationData.dateTo,
        visitors: reservationData.visitors,
        spendDays: reservationData.spendDays,
        client: {
            _id: '',
            firstName: '',
            lastName: '',
            email: '',
            phone: '',
        },
        room: {
            _id: '',
            numberRoom: '',
            numberOfSpace: '',
        }
    }
    data = checkClient(reservationData);
    client = data.client;

    reservation.client.firstName = client.firstName
    reservation.client.lastName = client.lastName
    reservation.client.email = client.email
    reservation.client.phone = client.phone
    
    RoomRepository.getRoomId(reservationData.roomId).then(
        rooms => {
            reservation.room._id = rooms._id;
            reservation.room.numberOfSpace = rooms.numberOfSpace;
            reservation.room.numberRoom = rooms.numberRoom;
        ClientRepository.createClient(clientData).then(client =>
            {
            ClientRepository.findClient(reservation.client)
                .then(cli => {
                    reservation.client._id = cli._id;
                        ReservationRepository.createReservation(reservation)
                            .then( result => {
                                res.redirect('/reservation');
                            })
                            .catch(err => {
                                ClientRepository.deleteClient(reservation.client._id)
                                if(reservation.dateFrom != '' && reservationData.dateFrom != ''){
                                    reservation.dateFrom = new Date(reservationData.dateFrom);
                                }
                                if(reservation.dateTo != '' && reservationData.dateTo != ''){
                                    reservation.dateTo = new Date(reservationData.dateTo);
                                }
                               
                                res.render('pages/reservation/rezerwacja', {
                                    reservation: reservation,
                                    formMode: 'createNewFromRoom',
                                    pageTitle: 'Nowe rezerwacja',
                                    btnLabel: 'Dodaj rezerwacje',
                                    formAction: '/reservation/addReservationFromRoom',
                                    navLocation: 'reservation',
                                    validationErrors: err.details
                                });
                        })
                    });
            }).catch(err => {
                if(reservation.dateFrom != '' && reservationData.dateFrom != ''){
                    reservation.dateFrom = new Date(reservationData.dateFrom);
                }
                if(reservation.dateTo != '' && reservationData.dateTo != ''){
                    reservation.dateTo = new Date(reservationData.dateTo);
                }
                    res.render('pages/reservation/rezerwacja', {
                        reservation: reservation,
                        formMode: 'createNewFromRoom',
                        pageTitle: 'Nowe rezerwacja',
                        btnLabel: 'Dodaj rezerwacje',
                        formAction: '/reservation/addReservationFromRoom',
                        navLocation: 'reservation',
                        validationErrors: err.details
            });
        });
    });
};
exports.addReservationFromClient = (req, res, next) => {
    const reservationData = { ...req.body };
    let client, data;
    const reservation = {
        dateFrom: reservationData.dateFrom,
        dateTo: reservationData.dateTo,
        visitors: reservationData.visitors,
        spendDays: reservationData.spendDays,
        client: {
            _id: '',
            firstName: '',
            lastName: '',
            email: '',
            phone: '',
        },
        room: {
            _id: '',
            numberRoom: '',
            numberOfSpace: '',
        }
    }
    data = checkRoom(reservationData);
    reservation.client._id = reservationData.clientId
    reservation.client.firstName = reservationData.firstName
    reservation.client.lastName = reservationData.lastName
    reservation.client.email = reservationData.email
    reservation.client.phone = reservationData.phone

    RoomRepository.getRoomId(reservationData.numberRoom)
    .then(rooms => {
        reservation.room._id = rooms._id
        reservation.room.numberRoom = rooms.numberRoom
        reservation.room.numberOfSpace = rooms.numberOfSpace
        ReservationRepository.createReservation(reservation)
            .then( result => {
            res.redirect('/reservation');
        }).catch(err => {
            if(reservation.dateFrom != '' && reservationData.dateFrom != ''){
                reservation.dateFrom = new Date(reservationData.dateFrom);
            }
            if(reservation.dateTo != '' && reservationData.dateTo != ''){
                reservation.dateTo = new Date(reservationData.dateTo);
            }
            RoomRepository.getRooms()
            .then(rooms => {
                allRooms = rooms;
                res.render('pages/reservation/rezerwacja', {
                    reservation: reservation,
                    formMode: 'createNewFromClient',
                    pageTitle: 'Nowe rezerwacja',
                    btnLabel: 'Dodaj rezerwacje',
                    allRooms: allRooms,
                    formAction: '/reservation/addReservationFromClient',
                    navLocation: 'reservation',
                    validationErrors: err.details
                }
                );
            });
        });
    }); 
};
exports.deleteReservation = (req, res, next) => {
    const reservationId = req.params.reservationId;
    ReservationRepository.deleteReservation(reservationId)
        .then( result => {
            res.redirect('/reservation');
    })
};

exports.showAddReservationFromClient = (req, res, next) => {
    let allRooms;
    let client;
    ClientRepository.getClientId(req.params.clientId)
        .then(clients => {
            client = { 
                _id: clients._id,
                firstName: clients.firstName,
                lastName: clients.lastName,
                email: clients.email,
                phone: clients.phone,
            }
            RoomRepository.getRooms()
            .then(rooms => {
                allRooms = rooms;
                res.render('pages/reservation/rezerwacja', {
                    reservation: { client, room: {} },
                    formMode: 'createNewFromClient',
                    pageTitle: 'Nowe rezerwacja',
                    btnLabel: 'Dodaj rezerwacje',
                    allRooms: allRooms,
                    formAction: '/reservation/addReservationFromClient',
                    navLocation: 'reservation',
                    validationErrors: []
                });
            });
        });
   
}
exports.showAddReservationFromRoom = (req, res, next) => {
    let room;
    RoomRepository.getRoomId(req.params.roomId)
        .then(rooms => {
            room = {
                _id: rooms._id,
                numberRoom: rooms.numberRoom,
                numberOfSpace: rooms.numberOfSpace
            }
            RoomRepository.getRoomId()
            .then(rooms => {
                allRooms = rooms;
                res.render('pages/reservation/rezerwacja', {
                    reservation: { client: {}, room },
                    formMode: 'createNewFromRoom',
                    pageTitle: 'Nowe rezerwacja',
                    btnLabel: 'Dodaj rezerwacje',
                    formAction: '/reservation/addReservationFromRoom',
                    navLocation: 'reservation',
                    validationErrors: []
                }
                );
        
            });
        });

   
}
exports.showReservationDetails = (req, res, next) => {
    const reservationId = req.params.reservationId;
    ReservationRepository.getReservationById(reservationId)
        .then(reservation => {
            res.render('pages/reservation/rezerwacja', {
                reservation: reservation,
                formMode: 'showDetails',
                pageTitle: 'Szczegóły rezerwacji',
                formAction: '',
                navLocation: 'reservation',
                validationErrors: []
            } 
        );
    });
}
exports.showEditReservation = (req, res, next) => {
    let allRooms;
    const reservationId = req.params.reservationId;

    RoomRepository.getRooms()
        .then(rooms => {
            allRooms = rooms;
            ReservationRepository.getReservationById(reservationId) 
            .then(reservation => {
                res.render('pages/reservation/rezerwacja', {
                    reservation: reservation,
                    allRooms: allRooms,
                    formMode: 'edit',
                    pageTitle: 'Edytuj rezerwacje',
                    btnLabel: 'Edytuj rezerwacje',
                    formAction: '/reservation/edit',
                    navLocation: 'reservation',
                    validationErrors: []
                    
            });
        });
        });

}

const checkClient = (reservationData) => {
    let room = checkRoom(reservationData);
    let client = { 
        _id: '',
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
    } 
    if(reservationData.clientId != ''){
                    client._id = reservationData.clientId,
                    client.firstName = reservationData.firstName;
                    client.lastName = reservationData.lastName;
                    client.email = reservationData.email;
                    client.phone = reservationData.phone;
    }else{
        clientData = {
            _id: '',
            firstName: reservationData.firstName,
            lastName: reservationData.lastName,
            email: reservationData.email,
            phone: reservationData.phone,
        }
        
       
                /*ClientRepository.findClient(clientData).then(client => {
                    clientData._id = client._id
                })*/
        client.firstName = clientData.firstName;
        client.lastName = clientData.lastName;
        client.email = clientData.email;
        client.phone = clientData.phone;
    }
    data ={
        room,
        client
    }
    return data;
}

const checkRoom = (reservationData) => {
    room = {
        _id: '',
        numberRoom: '',
        numberOfSpace: '',
    }

    if(reservationData.roomId != ''){
        
        RoomRepository.getRoomId(reservationData.roomId)
            .then(rooms => {
                room._id = rooms._id,
                room.numberRoom = rooms.numberRoom,
                room.numberOfSpace = rooms.numberOfSpace
                
                
        });
    }else{
        
        RoomRepository.getRoomId(reservationData.numberRoom)
            .then(rooms => {
                room._id = rooms._id,
                room.numberRoom = rooms.numberRoom,
                room.numberOfSpace = rooms.numberOfSpace
        });
    }
    return room
   
}