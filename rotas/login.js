const router = require('express').Router();
const usuario = require('../models/usuario');

const { body, validationResult } = require('express-validator');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

router.use(require('cors')())
require('dotenv').config();
router.use(require('body-parser').json())

router.post('/',[
    body('username', 'Informe o usuario corretamente!')
        .notEmpty().withMessage('Este campo não pode estar vazio!')
        .trim(),
    body('password', 'Informe a senha corretamente!')
        .notEmpty().withMessage('Este campo não pode estar vazio!')
        .trim()
        .escape()
], (req, res) => {
    const error = validationResult(req);
    if(error.isEmpty()){
        usuario.findOne({
            where: {'email' : req.body.username}
        }).then(user => {
            if(user){
                bcrypt.compare(req.body.password, user.password, (err, result) => {
                    if(result) {
                        const token = jwt.sign({id:user.id, username: user.name, email:user.email}, process.env.SECRET, {expiresIn: 60*60});
                        console.log(`Acesso autorizado => Usuario: ${user.name}`)
                        res.status(200).json({token: token})
                    } else if(err) {
                        console.log(err)
                        res.status(404).json({error: true , msg: 'Nome de usuário ou senha errados. Por favor tente outra vez.'})
                    } else {
                        res.status(404).json({error: true , msg: 'Nome de usuário ou senha errados. Por favor tente outra vez.'})
                    }
                }) 
            } else {
                res.status(403).json({error: true , msg: 'Nome de usuário ou senha errados. Por favor tente outra vez.'})
            }
        })
    } else {
        res.status(422).json(error);
    }
});
module.exports = router;