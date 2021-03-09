const ClientRepository = require('../repository/mysql2/ClientRepository');
const authUtil = require('../util/authUtils')

exports.login = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    ClientRepository.findByEmail(email)
        .then(visitor => {
            if(Object.values( visitor ).every( val => val == null )) {
                res.render('index', {
                    navLocation: 'main',
                    loginError: "Nieprawidłowy adres email lub hasło"
                })
            } else if(authUtil.comparePasswords(password, visitor.password) === true) {
                req.session.loggedUser = visitor;
                res.redirect('/');
            } 
            else {
                res.render('index', {
                    navLocation: 'main',
                    loginError: "Nieprawidłowy adres email lub hasło"
                })
            }
        })
        .catch(err => {
            console.log(err);
        });

}

exports.logout = (req, res, next) => {
    req.session.loggedUser = undefined;
    res.redirect('/');
}

exports.register= (req, res, next) => {
    const employeeData = { ...req.body };
    ClientRepository.createEmployee(employeeData)
    .then( result => {
        res.redirect('/');
    })
    .catch(err => {
        res.render('pages/register', {
            visitor: employeeData,
            navLocation: 'main',
            validationErrors: err.details
        });
        console.log(err.details);
    });
}

exports.showRegisterForm = (req, res, next) => {
    res.render('pages/register', {
        visitor: {},
        navLocation: 'main',
        validationErrors: []
    });
}