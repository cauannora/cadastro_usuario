const decode = require('express').Router();
const bodyParser = require('body-parser')
const multer = require('multer');
const readline = require('readline')
const fs = require('fs')

const { body,validationResult } = require('express-validator')

decode.use(bodyParser.json())

const asciiChar = require('../encodes/asciiChar')
const hexaChar = require('../encodes/hexaChar')
const HtmlEntitiesAmpersand = require('../encodes/htmlEntitiesAmpersand')
const HtmlEntitiesPercent = require('../encodes/htmlEntitiesPercent')

// Definição do arquivo que pode ser enviado via post
const upload = multer({
    dest: 'upload_files/',
    fileFilter: (req, file, cb) =>{
        if(file.mimetype != 'text/plain' && !file.mimetype.includes('log')){
            return cb(new Error('Formato de arquivo inválido!'))
        }
        cb(null, true);
    }
}).single('attachment');

decode.post('/file', (req, res) => {
    upload(req, res, async (err) => {
        if(err) {
            console.log(err)
            res.status(422).send();
        } else {
            const file = req.file;
            const asdas = processFile(file);
            console.log(file)    
        }
    })
});

// Função para ler lina a linha o arquivo
function processFile(file){
    const outpath = `${process.env.OUTDIR}/${file.filename}`;
    const writeStream = fs.createWriteStream(outpath, {flags: 'a'});

    writeStream.on('error', (err) =>{
        console.log(err);
    })

    const readInterface = readline.createInterface({
        input: fs.createReadStream(file.path)
    });
    readInterface.on('line', (line) => {
        var result = HtmlEntitiesPercent.decode(line)
        result = asciiChar.decode(result)
        result = hexaChar.decode(result)
        result = HtmlEntitiesAmpersand.decode(result)
        writeStream.write(`${result}\n`);
    })
}


decode.post('/texto', [
    body('texto').notEmpty().withMessage("O campo Texto não pode estar vazio!")
], (req, res) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        var inputText = req.body.texto;
        var result = HtmlEntitiesPercent.decode(inputText)
        result = asciiChar.decode(result)
        result = hexaChar.decode(result)
        result = HtmlEntitiesAmpersand.decode(result)
        res.status(200).json({
            msg: "Desofuscado com sucesso!",
            data: result
        });
    } else if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
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
});

module.exports = decode;