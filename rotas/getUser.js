const get = require('express').Router();
const usuario = require('../models/usuario');
const { check, validationResult } = require('express-validator');

get.get('/:id', [
    check('id', "ID não pode ser vazio e deve ser um numero inteiro!")
        .isNumeric()
        .notEmpty()
        .toInt()
], (req, res) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        usuario.findOne({
            where: {
                id: req.params.id
            }
        }).then(users => {
            if (users == null) {
                res.status(404).json({ data: "Usuario não encontrado!" })
            } else {
                return res.json({ data: users })
            }
        }).catch(err => console.log(err))

    } else if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    } else {
        res.status(500).json({
            error: [
                {
                    value: req.params.id,
                    mgs: "Falha ao comunicar com o SGBD."
                }
            ]
        })
    }
});

module.exports = get;