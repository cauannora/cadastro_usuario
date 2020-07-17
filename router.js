const express = require('express')
const bodyParser = require('body-parser')

const router = express.Router();

const verifyJWT = require('./middleware')
const get = require('./rotas/get')
const put = require('./rotas/put')
const post = require('./rotas/post')
const delete_req = require('./rotas/delete')
const decode = require('./rotas/decode')

router.use(require('cors')());

router.use(bodyParser.urlencoded({ extended: false }))
router.use(bodyParser.json())

//Rota: Listar usuarios
router.get('/', get)
//Rota: Criação de usuario
router.post('/',  post)
//Rota: Listar usuario pelo ID
router.get('/:id', get)
//Rota: Atualizar usuario
router.put('/:id', put)
//Rota: Deletar usuario pelo ID
router.delete('/:id', delete_req)

module.exports = router;
