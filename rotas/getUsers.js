const get = require('express').Router();
const usuario = require('../models/usuario');

get.get('/', (req, res) => {
    usuario.findAll()
        .then(users => {
            if (users.length > 0) {
                return res.json({ data: users })
            } else {
                return res.json({ data: "Nenhum usuario cadastrado!" })
            }
        }).catch(err => console.log(err))
});

module.exports = get;