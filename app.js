const express = require('express')
const app = express();
const fs = require('fs')
const router = require('./router');
const login = require('./rotas/login');
const decode = require('./rotas/decode');
const verifyJWT = require('./middleware')
const port = process.env.PORT_S || '3001';
const host = process.env.HOST_S || 'localhost';

require('dotenv').config();
app.use(require('cors')())
app.use('/login', login);
app.use(router);
app.use(verifyJWT);
app.use('/decode',  decode);

// Verificação se a pasta para os arquivos de output está criada.
fs.access(process.env.OUTDIR, fs.constants.F_OK, (err) => {
    if(err) {
        fs.mkdir(process.env.OUTDIR, (err) =>{
            if(err) throw err;
            console.log(`${process.env.OUTDIR} criado com sucesso!`)
        });
    } else {
        fs.stat(process.env.OUTDIR, (err, stats) => {
            if(err) throw err;
            if(!stats.isDirectory()) {
                throw new Error(`${process.env.OUTDIR} existe e não é um diretório!`)
            }
        })
    }
})

app.listen(port,host, () =>{
    console.log(`Server running! http://${host}:${port}`);
})

