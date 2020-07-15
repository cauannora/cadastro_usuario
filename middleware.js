const jwt = require('jsonwebtoken');
require('dotenv').config();

function verifyJWT (req, res, next){
    var token = req.headers['authorization'];

    if(!token){
        res.status(401).json({auth: false , msg: "Token nao informado!"})
    } 
    jwt.verify(token.split(" ").pop(), process.env.SECRET, (err, decoded) => {
        if(err) 
            return res.status(500).json({auth: false , msg: "Token invalido!"})
        
            console.log(`Acesso autorizado => Usuario: ${decoded.username}`)
        next();
    })
}

module.exports = verifyJWT;