const router = require('express').Router();
const usuario = require('../models/usuario');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const bodyParser = require('body-parser')
router.use(bodyParser.json())
router.post('/',[
    body('username', 'Informe o usuario corretamente!')
        .notEmpty()
        .trim()
        .escape(),
    body('password', 'Informe a senha corretamente!')
        .notEmpty()
        .trim()
        .escape()
], (req, res) => {
    const errors = validationResult(req);
    if(errors.isEmpty){
        usuario.findOne({
            where: {'email' : req.body.username}
        }).then(user => {
            bcrypt.compare(req.body.password, user.password, (err, result) => {
                if(err) {
                    console.log(err)
                } else if(result) {
                    const token = jwt.sign({id:user.id, username: user.name, email:user.email}, process.env.SECRET, {expiresIn: 60 * 60});
                    res.status(200).json({token: token})
                } else {
                    res.status(404).json({value: '', msg: 'Usuario não encontrado!'})
                }
            }) 
        })
    } else {
        res.status(422).json(errors);
    }
});
module.exports = router;