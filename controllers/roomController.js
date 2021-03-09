const RoomRepository = require('../repository/mysql2/RoomRepository');

exports.showRoomList = (req, res, next) => {
    RoomRepository.getRooms()
        .then(rooms => {
            res.render('pages/rooms/pokoje', { rooms: rooms, navLocation: 'rooms' });
        });
}

exports.addRoom = (req, res, next) => {
    const roomData = { ...req.body };
    RoomRepository.createRoom(roomData)
        .then( result => {
            res.redirect('/rooms');
        })
        .catch(err => {
            res.render('pages/rooms/dodaniePokoju', {
                room: roomData,
                pageTitle: 'Dodawanie pokoju',
                formMode: 'createNew',
                btnLabel: 'Dodaj pokój',
                formAction: '/rooms/add',
                navLocation: 'rooms',
                validationErrors: err.details
            });
        });
};

exports.deleteRoom = (req, res, next) => {
    const roomId = req.params.roomId;
    RoomRepository.deleteRoom(roomId)
        .then( result => {
            res.redirect('/rooms');
    })
};

exports.updateRoom = (req, res, next) => {
    const roomData = { ...req.body };
    RoomRepository.updateRoom(roomData._id, roomData)
        .then( result => {
            res.redirect('/rooms');
        })
        .catch(err => {
            RoomRepository.getRoomById(roomData._id)
            .then(room => {
                res.render('pages/rooms/dodaniePokoju', {
                    room: room,
                    pageTitle: 'Edytuj pokóju',
                    formMode: 'edit',
                    btnLabel: 'Edytuj pokój',
                    formAction: '/rooms/edit',
                    navLocation: 'rooms',
                    validationErrors: err.details
                });
            });
        });
};

exports.showRoomDetails = (req, res, next) => {
    const roomId = req.params.roomId;
    RoomRepository.getRoomById(roomId)
        .then(room => {
            res.render('pages/rooms/dodaniePokoju', {
                room: room,
                formMode: 'showDetails',
                pageTitle: 'Szczegóły pokoju',
                formAction: '',
                navLocation: 'rooms',
                validationErrors: []
            });
        });
}

exports.showAddRoomForm = (req, res, next) => {
    res.render('pages/rooms/dodaniePokoju', {
        room: {},
        pageTitle: 'Dodaj pokój',
        formMode: 'createNew',
        btnLabel: 'Dodaj pokój',
        formAction: '/rooms/add',
        navLocation: 'rooms',
        validationErrors: []
    });
}

exports.showEditRoomForm = (req, res, next) => {
    const roomId = req.params.roomId;

    RoomRepository.getRoomById(roomId)
        .then(room => {
            res.render('pages/rooms/dodaniePokoju', {
                room: room,
                formMode: 'edit',
                pageTitle: 'Edytuj pokój',
                btnLabel: 'Edytuj pokój',
                formAction: '/rooms/edit',
                navLocation: 'rooms',
                validationErrors: []
            });
    });
}