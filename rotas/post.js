const post = require('express').Router();
const usuario = require('../models/usuario')
const { body,validationResult } = require('express-validator')

post.post('/', [
    body('name')
        .escape()
        .isLength({ max: 20 }).withMessage("O nome deve conter até 20 caracteres!")
        .notEmpty().withMessage("O nome não pode estar vazio!"),
    body('email')
        .notEmpty().withMessage("O email não pode estar vazio!")
        .escape().withMessage("Caracteres Invalidos!")
        .isEmail().withMessage("Email invalido!")
        .trim(),
    body('password')
        .escape()
        .isLength({ min: 8, max: 25 }).withMessage("Senha deve conter de 8 a 25 caracteres de tamanho!")
        .notEmpty().withMessage("Senha não pode ser vazia!"),
    body('re_password')
        .custom((re_password, { req }) => {
            if (re_password !== req.body.password) throw new Error('Confirmação de senha nao corresponde ao campo Senha!');
            return true;
        })
    ], (req, res) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        usuario.create({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password
        }).then(result => {
            res.status(201).json({
                msg: "Usuario cadastrado com sucesso!",
                data: {
                    name: result.name,
                    email: result.email,
                    password: result.password
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