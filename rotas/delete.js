const delete_req = require('express').Router();
const usuario = require('../models/usuario');
const { check, body,validationResult } = require('express-validator')

delete_req.delete('/:id', [
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
                return res.status(404).json({
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


module.exports = delete_req;