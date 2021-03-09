const db = require('../../config/mysql2/db');
const reservationSchema = require('../../model/joi/Reservation');
const reservationUpdateSchema = require('../../model/joi/ReservationUpdate');

exports.getReservations = () => {
    return db.promise().query(`SELECT 
    r._id as r_id, r.numberRoom, r.numberOfSpace,
    res._id as _id, res.dateFrom, res.dateTo, res.visitors, res.spendDays, 
    c._id as c_id, c.firstName, c.lastName, c.email, c.phone
    
    FROM Reservation res 
    left join Client c on c._id = res.client_id 
    left join Rooms r on r._id = res.rooms_id 
`)
    .then( (results, fields) => {
        return results[0];
    })
    .catch(err => {
        console.log(err);
        throw err;
    });
};

exports.getReservationById = (reservationId) => {
    const query = `SELECT 
        r._id as r_id, r.numberRoom, r.numberOfSpace,
        res._id as _id, res.dateFrom, res.dateTo, res.visitors, res.spendDays, 
        c._id as c_id, c.firstName, c.lastName, c.email, c.phone
    FROM Reservation res 
        left join Client c on c._id = res.client_id 
        left join Rooms r on r._id = res.rooms_id 
    WHERE res._id = ?`
    return db.promise().query(query, [reservationId])
    .then( (results, fields) => {
        const firstRow = results[0][0];
        if(!firstRow) {
            return {};
        }
        const reservation = {
            _id: parseInt(reservationId),
            dateFrom: firstRow.dateFrom,
            dateTo: firstRow.dateTo,
            visitors: firstRow.visitors,
            spendDays: firstRow.spendDays,
            client: {
                _id: firstRow.c_id,
                firstName: firstRow.firstName,
                lastName: firstRow.lastName,
                email: firstRow.email,
                phone: firstRow.phone,
            },
            room: {
                numberRoom: firstRow.numberRoom,
                numberOfSpace: firstRow.numberOfSpace,
                _id: firstRow.r_id
            }
        }
        return reservation;
    })
    .catch(err => {
        console.log(err);
        throw err;
    });
};

exports.createReservation = (newReservationData) => {
    const vRes = reservationSchema.validate(newReservationData, { abortEarly: false} );
    
    if(vRes.error) {
        return Promise.reject(vRes.error);
    }
    dateErr = checkDate(newReservationData.dateFrom, newReservationData.dateTo)
    if(dateErr) {
        return Promise.reject(dateErr);
    } else {
         dataErr = checkData(newReservationData.client, newReservationData.room)
    
        if(dataErr) {
            return Promise.reject(dataErr);
        } else {
            return checkDataFromoUnique(newReservationData.dateFrom, newReservationData.dateTo).then(
                dateFromErr => {
                    if(dateFromErr){
                        return Promise.reject(dateFromErr);
                    }
                    else{
                        return checkDataToUnique(newReservationData.dateFrom, newReservationData.dateTo).then(
                            dateToErr => {
                                if(dateToErr){
                                    return Promise.reject(dateToErr);
                                }
                                else{
                                    const dateFrom = newReservationData.dateFrom;
                                    const dateTo = newReservationData.dateTo;
                                    const visitors = newReservationData.visitors;
                                    
                                    const client_id = newReservationData.client._id;
                                    const rooms_id = newReservationData.room._id;

                                    const sql = 'INSERT into Reservation (dateFrom, dateTo, visitors, client_id, rooms_id) VALUES (?, ?, ?, ?, ?)'
                                    return db.promise().execute(sql, [dateFrom, dateTo, visitors, client_id, rooms_id]);
                                }
                            }
                        )
                    }
                }
            )
        }
    }
     
};

exports.updateReservation = (reservationId, reservationData) => {
    const vRes = reservationUpdateSchema.validate(reservationData, { abortEarly: false} );
    
    if(vRes.error) {
        return Promise.reject(vRes.error);
    }
    if(reservationData.spendDays == 0){
        reservationData.spendDays = null;
    }
    dateErr = checkDate(reservationData.dateFrom, reservationData.dateTo)
    if(dateErr) {
        return Promise.reject(dateErr);
    } else {
        return checkDataFromoUnique(reservationData.dateFrom, reservationData.dateTo).then(
            dateFromErr => {
                if(dateFromErr){
                    return Promise.reject(dateFromErr);
                }
                else{
                    return checkDataToUnique(reservationData.dateFrom, reservationData.dateTo).then(
                        dateToErr => {
                            if(dateToErr){
                                return Promise.reject(dateToErr);
                            }
                            else{
                                const dateFrom = reservationData.dateFrom;
                                const dateTo = reservationData.dateTo;
                                const visitors = reservationData.visitors;
                                const spendDays = reservationData.spendDays;
                                const client_id = reservationData.client._id;
                                const rooms_id = reservationData.room._id;

                                const sql = 'UPDATE Reservation SET dateFrom = ?, dateTo = ?, visitors = ?, spendDays = ?, client_id = ?, rooms_id = ? WHERE _id = ?'
                                return db.promise().execute(sql, [dateFrom, dateTo, visitors, spendDays, client_id, rooms_id, reservationId]);
                            }
                        }
                    )
                }
            }
        )
        
    }
};

exports.deleteReservation = (reservationId) => {
    const sql = 'DELETE FROM Reservation where _id = ?'
    return db.promise().execute(sql, [reservationId]);
};

checkData = (client, room) => {
    let err, cli, ro;
    
    cli = Object.values( client ).every( val => val == null )
    ro = Object.values( room ).every( val => val == null )
    if(cli && ro)  {
        err = {
            details: [{
                path: ['client'],
                message: 'Nie wybrano klienta'
            },
            {
                path: ['numberRoom'],
                message: 'Nie wybrano pokoju'
            }
            ]
        };
        return err;
    }
    else if(ro)  {
        err = {
            details: [{
                path: ['numberRoom'],
                message: 'Nie wybrano pokoju'
            }]
        };
        return err;
    }
    
    else if(cli) {
        err = {
            details: [{
                path: ['client'],
                message: 'Nie wybrano klienta'
            }]
        };
        return err;
    }
}

checkDate = (dateFrom, dateTo) => {
    if(dateTo < dateFrom)  {
        let err;
        err = {
            details: [{
                path: ['dateTo'],
                message: 'Data końca rezerwacji musi być późniejsza niż data początku rezerwacji'
            }
            ]
        };
        return err;
    }
}

checkDataFromoUnique = (dateFrom, dateTo) => {
    let sql, promise;
    
    sql = `SELECT COUNT(1) as res FROM Reservation where dateFrom BETWEEN ? AND ?`;
    promise = db.promise().query(sql, [dateFrom, dateTo]);
    
    return promise.then( (results, fields) => {
        const count = results[0][0].res;
        let err;
        if(count > 0) {
            err = {
                details: [{
                    path: ['dateFrom'],
                    message: 'W podanym okresie jest już rezerwacja na ten pokój'
                }]
            };
        }
        return err;
    });
}

checkDataToUnique = (dateFrom, dateTo) => {
    let sql, promise;
    
    sql = `SELECT COUNT(1) as res FROM Reservation where dateTo BETWEEN ? AND ?`;
    promise = db.promise().query(sql, [dateFrom, dateTo]);
    
    return promise.then( (results, fields) => {
        const count = results[0][0].res;
        let err;
        if(count > 0) {
            err = {
                details: [{
                    path: ['dateTo'],
                    message: 'W podanym okresie jest już rezerwacja na ten pokój'
                }]
            };
        }
        return err;
    });
}