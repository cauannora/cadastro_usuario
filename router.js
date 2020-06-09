const express = require('express')
const bodyParser = require('body-parser')
const { check, body, validationResult } = require('express-validator')

const usuario = require('./models/usuario')
const router = express.Router();

router.use(require('cors')());
router.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET", "PUT", "POST", "DELETE", "OPTIONS");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
router.use(bodyParser.urlencoded({ extended: false }))
router.use(bodyParser.json())

//Rota: Listar usuarios
router.get('/', (req, res) => {
    usuario.findAll()
        .then(users => {
            if (users.length > 0) {
                return res.json({ data: users })
            } else {
                return res.json({ data: "Nenhum usuario cadastrado!" })
            }
        }).catch(err => console.log(err))
});
//Rota: Listar usuario pelo ID
router.get('/:id', [
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
                res.json({ data: "Usuario não encontrado!" })
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
//Rota: Atualizar usuario
router.put('/:id', [
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
//Rota: Criação de usuario
router.post('/', [
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
})
//Rota: Deletar usuario pelo ID
router.delete('/:id', [
    check('id', "ID não pode ser vazio e deve ser um numero inteiro!")
        .isNumeric()
        .notEmpty()
        .toInt()
], (req, res) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        usuario.destroy({
            where: {
                id: req.params.id
            }
        }).then(rows => {
            if (rows === 1) {
                return res.json({
                    rows_deleted: rows,
                    msg: "Usuario deletado com sucesso!"
                })
            } else if (rows === 0) {
                return res.json({
                    rows_deleted: rows,
                    msg: "Usuario não encontrado!" 
                })
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
    }
})

module.exports = router;