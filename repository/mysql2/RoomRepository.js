const db = require('../../config/mysql2/db');
const roomSchema = require('../../model/joi/Room');

exports.getRooms = () => {
    return db.promise().query('SELECT * FROM Rooms')
    .then( (results, fields) => {
        return results[0];
    })
    .catch(err => {
        console.log(err);
        throw err;
    });
};

exports.getRoomById = (roomId) => {
    const query = `SELECT r._id as _id, r.numberRoom, r.numberOfSpace, 
        res._id as res_id, res.dateFrom, res.dateTo, res.visitors, res.spendDays, 
        c._id as c_id, c.firstName, c.lastName, c.email, c.phone
    FROM Rooms r 
    left join Reservation res on res.rooms_id = r._id 
    left join Client c on c._id = res.client_id 
    WHERE r._id = ?`
    return db.promise().query(query, [roomId])

    .then( (results, fields) => {
        const firstRow = results[0][0];
        if(!firstRow) {
            return {};
        }
        const room = {
            _id: parseInt(roomId),
            numberRoom: firstRow.numberRoom,
            numberOfSpace: firstRow.numberOfSpace,
            reservations: []
        }
        for( let i=0; i<results[0].length; i++ ) {
            const row = results[0][i];
            if(row.res_id) {
                const reservation = {
                    _id: row.res_id,
                    dateFrom: row.dateFrom,
                    dateTo: row.dateTo,
                    visitors: row.visitors,
                    spendDays: row.spendDays,
                    client: {
                        _id: row.c_id,
                        firstName: row.firstName,
                        lastName: row.lastName
                    }
                };
                room.reservations.push(reservation);
            }
        }
        return room;
    })
    .catch(err => {
        console.log(err);
        throw err;
    });
};
exports.getRoomId = (roomId) => {
    const query = `SELECT r._id as _id, r.numberRoom, r.numberOfSpace
    FROM Rooms r 
    WHERE r._id = ?`
    return db.promise().query(query, [roomId])

    .then( (results, fields) => {
        const firstRow = results[0][0];
        if(!firstRow) {
            return {};
        }
        const room = {
            _id: parseInt(roomId),
            numberRoom: firstRow.numberRoom,
            numberOfSpace: firstRow.numberOfSpace
        }
        return room;
    })
    .catch(err => {
        console.log(err);
        throw err;
    });
};
exports.createRoom = (newRoomData) => {
    
    const vRes = roomSchema.validate(newRoomData, {abortEarly: false} );
    if(vRes.error){
        return Promise.reject(vRes.error);
    }
    return checkRoomNumber(newRoomData.numberRoom)
        .then(numberErr => {
            if(numberErr) {
                return Promise.reject(numberErr);
            } else {
                const numberRoom = newRoomData.numberRoom;
                const numberOfSpace = newRoomData.numberOfSpace;

                const sql = 'INSERT into Rooms (numberRoom, numberOfSpace) VALUES (?, ?)'
                return db.promise().execute(sql, [numberRoom, numberOfSpace]);
                
            }
        }).catch(err => {
            return Promise.reject(err);
        });
};

exports.updateRoom = (roomId, roomData) => {
    const vRes = roomSchema.validate(roomData, {abortEarly: false} );
    if(vRes.error){
        return Promise.reject(vRes.error);
    }
    return checkRoomNumber(roomData.numberRoom, roomId)
        .then(numberErr => {
            if(numberErr) {
                return Promise.reject(numberErr);
            } else {
                const numberRoom = roomData.numberRoom;
                const numberOfSpace = roomData.numberOfSpace;

                const sql = 'UPDATE Rooms SET numberRoom = ?, numberOfSpace = ? WHERE _id = ?'
                return db.promise().execute(sql, [numberRoom, numberOfSpace, roomId]);
            }
        }).catch(err => {
            return Promise.reject(err);
        });
};

exports.deleteRoom = (roomId) => {
    const sql1 = 'DELETE FROM Reservation where rooms_id = ?'
    const sql2 = 'DELETE FROM Rooms where _id = ?'
    
    return db.promise().execute(sql1, [roomId])
        .then(() => {
            return db.promise().execute(sql2, [roomId])
    });
};

checkRoomNumber = (numberRoom, roomId) => {
    let sql, promise;
    if(roomId) {
        sql = `SELECT COUNT(1) as c FROM Rooms where numberRoom = ? and _id != ?`;
        promise = db.promise().query(sql, [numberRoom, roomId]);
    } else{
        sql = `SELECT COUNT(1) as c FROM Rooms where numberRoom = ?`;
        promise = db.promise().query(sql, [numberRoom]);
    }
    return promise.then( (results, fields) => {
        const count = results[0][0].c;
        let err;
        if(count > 0) {
            err = {
                details: [{
                    path: ['numberRoom'],
                    message: 'Podany numer pokoju już istnieje'
                }]
            };
        }
        return err;
    });
}