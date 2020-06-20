const put = require('express').Router();
const usuario = require('../models/usuario')
const { check, body,validationResult } = require('express-validator')

put.put('/:id', [
    check('id')
        .isNumeric().withMessage("ID deve ser um numero inteiro!")
        .notEmpty().withMessage("ID não pode estar vazio!")
        .toInt(),
    body('nome')
        .escape()
        .isLength({ max: 20 }).withMessage("O nome deve conter até 20 caracteres!")
        .notEmpty().withMessage("O nome não pode estar vazio!"),
    body('email')
        .notEmpty().withMessage("O email não pode estar vazio!")
        .escape().withMessage("Caracteres Invalidos!")
        .isEmail().withMessage("Email invalido!")
        .trim(),
    body('username')
        .escape()
        .isLength({ max: 15 }).withMessage("O nome de usuario deve conter até 15 caracteres!")
        .notEmpty().withMessage("O nome de usuario não pode estar vazio!")
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    } else {
        usuario.update({
            nome: req.body.nome,
            email: req.body.email,
            username: req.body.username
        }, {
            where: {
                id: req.params.id
            }
        }).then(rows => {
            if (rows[0] === 1) {
                return res.json({
                    data: { rows_updated: rows[0] }
                })
            } else if (rows[0] === 0) {
                return res.status(404).json({
                    rows_updated: rows[0],
                    msg: "Usuario não encontrado!"
                })
            } else {
                res.status(500).json({
                    error: [
                        {
                            value: {
                                id: req.params.id,
                                nome: req.body.nome,
                                email: req.body.email,
                                username: req.body.username
                            },
                            mgs: "Falha ao comunicar com o SGBD."
                        }
                    ]
                })
            }
        }).catch(err => {
            console.log(err)
            res.status(500).json({
                error: [
                    {
                        value: {
                            id: req.params.id,
                            nome: req.body.nome,
                            email: req.body.email,
                            username: req.body.username
                        },
                        mgs: "Falha ao comunicar com o SGBD."
                    }
                ]
            })
        })
    }
})


module.exports = put;