const post = require('express').Router();
const usuario = require('../models/usuario')
const { body,validationResult } = require('express-validator')

post.post('/', [
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
    if (errors.isEmpty()) {
        usuario.create({
            nome: req.body.nome,
            email: req.body.email,
            username: req.body.username
        }).then(result => {
            res.status(201).json({
                msg: "Usuario cadastrado com sucesso!",
                data: {
                    nome: result.nome,
                    email: result.email,
                    username: result.username
                }
            })
        }).catch(err => {
            console.log(err)
            res.status(500).json({
                error: [
                    {
                        value: req.params.id,
                        mgs: "Falha ao comunicar com o SGBD."
                    }
                ]
            })
        })
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
module.exports = post;