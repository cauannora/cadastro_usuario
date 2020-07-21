const post = require('express').Router();
const usuario = require('../models/usuario')
const { body,validationResult } = require('express-validator')
const bc = require('bcrypt');

post.post('/', [
    body('name')
        .escape()
        .isLength({ max: 20 }).withMessage("O nome deve conter até 20 caracteres!")
        .notEmpty().withMessage("O nome não pode estar vazio!"),
    body('email')
        .notEmpty().withMessage("O email não pode estar vazio!")
        .escape().withMessage("Caracteres Invalidos!")
        .isEmail().withMessage("Email invalido!")
        .trim()
        .custom(reqemail => {
            return usuario.findOne({where: {email: reqemail}})
                .then(user => {
                    if(user) {
                        return Promise.reject();
                    } else {
						return Promise.resolve();
					}
				});
        }).withMessage("Email ja cadastrado!"),
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
        bc.hash(req.body.password, 10, (err, hash) =>{
            if(err) {
                console.log(err)
            } else {
                usuario.create({
                    name: req.body.name,
                    email: req.body.email,
                    password: hash
                }).then(result => {
                    if(result.email){
                        res.status(201).json({
                            error: false,
                            msg: "Usuario cadastrado com sucesso!"
                        })
                    }
                }).catch(err => {
                    console.log(err)
                    res.status(500).json({
                        error: [
                            {
                                error: true,
                                mgs: "Falha ao comunicar com o SGBD."
                            }
                        ]
                    })
                })
            }
        })
    } else if (!errors.isEmpty()) {
        console.log(errors);
        return res.status(422).json(errors);
    } else {
        res.status(500).json({
            error: [
                {
                    error: true,
                    mgs: "Falha ao comunicar com o SGBD."
                }
            ]
        })
    }
});
module.exports = post;