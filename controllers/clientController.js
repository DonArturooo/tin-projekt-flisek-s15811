const ClientRepository = require('../repository/mysql2/ClientRepository');

exports.showClientList = (req, res, next) => {
    //res.render('pages/clients/listaGosci', { navLocation: 'client' });
    ClientRepository.getClients()
    .then(clients => {
        res.render('pages/clients/listaGosci', { clients: clients, navLocation: 'client' });
    });
}
exports.addClient = (req, res, next) => {
    const clientData = { ...req.body };
    ClientRepository.createClient(clientData)
        .then( result => {
            res.redirect('/clients');
        })
        .catch(err => {
            res.render('pages/clients/dodajGoscia', {
                visitor: clientData,
                pageTitle: 'Dodaj gościa',
                formMode: 'createNew',
                btnLabel: 'Dodaj gościa',
                formAction: '/clients/add',
                navLocation: 'client',
                validationErrors: err.details
            });
        });
};

exports.deleteClient = (req, res, next) => {
    const clientId = req.params.clientId;
    ClientRepository.deleteClient(clientId)
        .then( result => {
            res.redirect('/clients');
    })
};

exports.updateClient = (req, res, next) => {
    const clientData = { ...req.body };
    ClientRepository.updateClient(clientData._id, clientData)
        .then( result => {
            res.redirect('/clients');
        })
        .catch(err => {
            ClientRepository.getClientById(clientData._id)
            .then(visitor => {
                res.render('pages/clients/dodajGoscia', {
                    visitor: visitor,
                    formMode: 'edit',
                    pageTitle: 'Edytuj gościa',
                    btnLabel: 'Edytuj gościa',
                    formAction: '/clients/edit',
                    navLocation: 'client',
                    validationErrors: err.details
                });
            });
        });
};

exports.showAddClientForm = (req, res, next) => {
    //res.render('pages/clients/dodajGoscia', { navLocation: 'client' });
    res.render('pages/clients/dodajGoscia', {
        visitor: {},
        pageTitle: 'Dodaj gościa',
        formMode: 'createNew',
        btnLabel: 'Dodaj gościa',
        formAction: '/clients/add',
        navLocation: 'client',
        validationErrors: []
    });
    console.log(res)
}
exports.showClientDetails = (req, res, next) => {
    const clientId = req.params.clientId;
    ClientRepository.getClientById(clientId)
        .then(visitor => {
            res.render('pages/clients/dodajGoscia', {
                visitor: visitor,
                formMode: 'showDetails',
                pageTitle: 'Szczegóły gościa',
                formAction: '',
                navLocation: 'client',
                validationErrors: []
        });
    });
}
exports.showEditClientForm = (req, res, next) => {
    const clientId = req.params.clientId;

    ClientRepository.getClientById(clientId)
        .then(visitor => {
            res.render('pages/clients/dodajGoscia', {
                visitor: visitor,
                formMode: 'edit',
                pageTitle: 'Edytuj gościa',
                btnLabel: 'Edytuj gościa',
                formAction: '/clients/edit',
                navLocation: 'client',
                validationErrors: []
        });
    });
}