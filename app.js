const express = require('express')
const app = express();
const fs = require('fs')
const router = require('./router');
const decode = require('./rotas/decode');
const port = 3001;

require('dotenv').config();

app.use(router);
app.use('/upload', decode);

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

app.listen(port, () =>{
    console.log(`Server running! http://localhost:${port}`);
})

