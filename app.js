require('dotenv').config();
const express = require('express')
const app = express();
const path = require('path');

const verifyDirs = require('./helpers/verifyDirs');
const port = process.env.PORT_S || '3001';
const host = process.env.HOST_S || 'localhost';

// Verificação se a pasta de armazenamento está criada.
verifyDirs(__dirname);
// Rotas Gerais da API 
app.use(require('./router'));
// Acesso a arquivos por URI
app.use(
    "/files",
    express.static(path.resolve(__dirname, "tmp", "files_output"))
)
// Inicialização do servidor!
app.listen(port,host, () =>{
    console.log(`Server running! http://${host}:${port}`);
})

