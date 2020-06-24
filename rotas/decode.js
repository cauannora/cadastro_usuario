const decode = require('express').Router();
const multer = require('multer');
const fs = require('fs');
const readline = require('readline');

// Definição do arquivo que pode ser enviado via post
const upload = multer({
    dest: 'upload_files/',
    fileFilter: (req, file, cb) =>{
        if(file.mimetype != 'text/plain'){
            return cb(new Error('Formato de arquivo inválido!'))
        }
        cb(null, true);
    }
}).single('attachment');

decode.post('/', (req, res) => {
    upload(req, res, (err) => {
        if(err){
            console.log(err)
            res.status(422).send();
        } else {
            let file = req.file;
            processFile(file);
            res.send();
        }

    })
});

// Função para ler lina a linha o arquivo
function processFile(file){
    var input = "";
    const readInterface = readline.createInterface({
        input: fs.createReadStream(file.path)
    });
    readInterface.on('line', (line) => {
        console.log(line)
    })
}

module.exports = decode;