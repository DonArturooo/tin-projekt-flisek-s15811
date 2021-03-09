const db = require('../../config/mysql2/db');
const clientSchema = require('../../model/joi/Client');
const employeeSchema = require('../../model/joi/Employee');
const authUtil = require('../../util/authUtils')

exports.getClients = () => {
    return db.promise().query('SELECT * FROM Client')
    .then( (results, fields) => {
        return results[0];
    })
    .catch(err => {
        console.log(err);
        throw err;
    });
};

exports.getClientById = (clientId) => {
    const query = `SELECT r._id as r_id, r.numberRoom,
        res._id as res_id, res.dateFrom, res.dateTo, res.visitors, res.spendDays, 
        c._id as _id, c.firstName, c.lastName, c.email, c.phone
    FROM Client c 
    left join Reservation res on res.client_id = c._id 
    left join Rooms r on r._id = res.rooms_id
    WHERE c._id = ?`
    return db.promise().query(query, [clientId])
    .then( (results, fields) => {
        const firstRow = results[0][0];
        if(!firstRow) {
            return {};
        }
        const visitor = {
            _id: parseInt(clientId),
            firstName: firstRow.firstName,
            lastName: firstRow.lastName,
            email: firstRow.email,
            phone: firstRow.phone,
            reservations: []
        }
        for( let i=0; i<results[0].length; i++ ) {
            const row = results[0][i];
            if(row.res_id) {
                const reservation = {
                    res_id: row.res_id,
                    dateFrom: row.dateFrom,
                    dateTo: row.dateTo,
                    visitors: row.visitors,
                    spendDays: row.spendDays,
                    numberRoom: row.numberRoom
                };
                visitor.reservations.push(reservation);
            }
        }
        return visitor;
    })
    .catch(err => {
        console.log(err);
        throw err;
    });
};

exports.findByEmail = (email) => {
    const query = `SELECT 
        e._id as _id, e.firstName, e.lastName, e.email, e.password
        FROM Employee e 
        WHERE e.email = ?`
    return db.promise().query(query, [email])
    .then( (results, fields) => {
        const firstRow = results[0][0];
        if(!firstRow) {
            return {};
        }
        const visitor = {
            _id: firstRow._id,
            firstName: firstRow.firstName,
            lastName: firstRow.lastName,
            email: email,
            password: firstRow.password
        }
        return visitor;
    })
    .catch(err => {
        console.log(err);
        throw err;
    });
}

exports.getClientId = (clientId) => {
    const query = `SELECT 
        c._id as _id, c.firstName, c.lastName, c.email, c.phone
    FROM Client c 
    WHERE c._id = ?`
    return db.promise().query(query, [clientId])
    .then( (results, fields) => {
        const firstRow = results[0][0];
        if(!firstRow) {
            return {};
        }
        const visitor = {
            _id: parseInt(clientId),
            firstName: firstRow.firstName,
            lastName: firstRow.lastName,
            email: firstRow.email,
            phone: firstRow.phone,
        }
        return visitor;
    })
    .catch(err => {
        console.log(err);
        throw err;
    });
};

exports.createClient = (newClientData) => {
    const vRes = clientSchema.validate(newClientData, { abortEarly: false} );
    
    if(vRes.error) {
        return Promise.reject(vRes.error);
    }
    return checkEmailUnique(newClientData.email)
        .then(emailErr => {
            if(emailErr) {
                return Promise.reject(emailErr);
            } else {
                const firstName = newClientData.firstName;
                const lastName = newClientData.lastName;
                const email = newClientData.email;
                const phone = newClientData.phone;
                const sql = 'INSERT into Client (firstName, lastName, email, phone) VALUES (?, ?, ?, ?)'
                return db.promise().execute(sql, [firstName, lastName, email, phone]);
            }
        })
        .catch(err => {
            
            return Promise.reject(err);
        });
};

exports.createEmployee = (employeeData) => {  
    const vRes = employeeSchema.validate(employeeData, { abortEarly: false} );
    
    if(vRes.error) {
        return Promise.reject(vRes.error);
    }
    
    return checkEmailEmployeeUnique(employeeData.email)
        .then(emailErr => {
            if(emailErr) {
                return Promise.reject(emailErr);
            } else {
                const firstName = employeeData.firstName;
                const lastName = employeeData.lastName;
                const email = employeeData.email;
                const password = authUtil.hashPassword(employeeData.password);
                const sql = 'INSERT into Employee (firstName, lastName, email, password) VALUES (?, ?, ?, ?)'
                return db.promise().execute(sql, [firstName, lastName, email, password]);
            }
        })
        .catch(err => {
            
            return Promise.reject(err);
        });
};

exports.findClient = (clientData) => {
    
    const query = `SELECT 
        _id
        FROM Client 
        WHERE firstName = ? and lastName = ? and email = ? and phone = ?`
    return db.promise().query(query, [clientData.firstName, clientData.lastName, clientData.email, clientData.phone])
    .then( (results, fields) => {
        const firstRow = results[0][0];
        if(!firstRow) {
            return {};
        }
        const visitor = {
            _id: firstRow._id,
        }
        return visitor;
    });
};

exports.updateClient = (clientId, clientData) => {
    const vRes = clientSchema.validate(clientData, { abortEarly: false} );
    
    if(vRes.error) {
        console.log(vRes.error)
        return Promise.reject(vRes.error);
    }
    
    return checkEmailUnique(clientData.email, clientData._id)
        .then(emailErr => {
            if(emailErr) {
                return Promise.reject(emailErr);
            } else {
                const firstName = clientData.firstName;
                const lastName = clientData.lastName;
                const email = clientData.email;
                const phone = clientData.phone;
                const sql = 'UPDATE Client SET firstName = ?, lastName = ?, email = ?, phone = ? WHERE _id = ?'
                return db.promise().execute(sql, [firstName, lastName, email, phone, clientId]);
            }
        })
        .catch(err => {
            return Promise.reject(err);
        });
};

exports.deleteClient = (clientId) => {
    const sql1 = 'DELETE FROM Reservation where client_id = ?'
    const sql2 = 'DELETE FROM Client where _id = ?'

    return db.promise().execute(sql1, [clientId])
        .then(() => {
            return db.promise().execute(sql2, [clientId])
    });
};

checkEmailUnique = (email, clientId) => {
    let sql, promise;
    if(clientId) {
        sql = `SELECT COUNT(1) as c FROM Client where _id != ? and email = ?`;
        promise = db.promise().query(sql, [clientId, email]);
    } else {
        sql = `SELECT COUNT(1) as c FROM Client where email = ?`;
        promise = db.promise().query(sql, [email]);
    }
    return promise.then( (results, fields) => {
        const count = results[0][0].c;
        let err;
        if(count > 0) {
            err = {
                details: [{
                    path: ['email'],
                    message: 'Podany adres email jest już używany'
                }]
            };
        }
        return err;
    });
}

checkEmailEmployeeUnique = (email) => {
    let sql, promise;

    sql = `SELECT COUNT(1) as e FROM Employee where email = ?`;
    promise = db.promise().query(sql, [email]);

    return promise.then( (results, fields) => {
        const count = results[0][0].e;
        let err;
        if(count > 0) {
            err = {
                details: [{
                    path: ['email'],
                    message: 'Podany adres email jest już używany'
                }]
            };
        }
        return err;
    });
}