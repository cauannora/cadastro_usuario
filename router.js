const express = require('express')
const bodyParser = require('body-parser')

const router = express.Router();

const verifyJWT = require('./middleware')

const getId = require('./rotas/getUser')
const get = require('./rotas/getUsers')
const put = require('./rotas/put')
const post = require('./rotas/post')
const delete_req = require('./rotas/delete')

router.use(require('cors')());

router.use(bodyParser.urlencoded({ extended: false }))
router.use(bodyParser.json())

//Rota: Criação de usuario
router.post('/',  post)
router.use(verifyJWT);
//Rota: Listar usuarios
router.get('/', get)
//Rota: Listar usuario pelo ID
router.get('/:id', getId)
//Rota: Atualizar usuario
router.put('/:id', put)
//Rota: Deletar usuario pelo ID
router.delete('/:id', delete_req)

module.exports = router;
