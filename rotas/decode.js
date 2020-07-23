const decode = require('express').Router();
const bodyParser = require('body-parser')
const multer = require('multer');
const readline = require('readline')
const { once } = require('events');
const fs = require('fs')

const { body,validationResult } = require('express-validator')

decode.use(bodyParser.json())

const asciiChar = require('../encodes/asciiChar')
const hexaChar = require('../encodes/hexaChar')
const HtmlEntitiesAmpersand = require('../encodes/htmlEntitiesAmpersand')
const HtmlEntitiesPercent = require('../encodes/htmlEntitiesPercent');
const { MulterError } = require('multer');

const dirDest = `${__dirname.replace('\\rotas', '')}`
const uri_path = `${process.env.URI}:${process.env.PORT_S}`

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, `${dirDest}/tmp/${process.env.UPDIR}`)
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + '-' + file.originalname)
    }
  })
// Configurações do multer
const filter_multer = {
    fileFilter: (req, file, cb) =>{
        if(file){
            if(file.mimetype != 'text/plain' && !file.originalname.includes('.log')) {
                return cb({error:{msg_error:'Formato de arquivo inválido!'}}, false)
            } else {
                cb(null, true);
            }
        } else {
            cb({error: {msg: "Arquivo invalido!"}}, false);
        }
    },
    storage: storage
}

// Definição do arquivo que pode ser enviado via post
const upload = multer(filter_multer).single('attachment');

decode.post('/file', (req, res) => {
    upload(req, res, async (err) => {
        if(err instanceof MulterError) {
            console.log(err)
            res.status(400).send({error: {msg: "Arquivo invalido!"}});
        } else {
            if(req.file){
                const file = req.file;
                const path = await processFile(file);
                if(path){
                    console.log(`Arquivo Desofuscado: ${file.originalname} \nINPUT_PATH: ${file.filename} \nOUTPUT_PATH: ${path} \n`)
                    // res.download(path, file.originalname);
                    res.status(200).json({error: false, msg: "Desofuscado com sucesso", url: `${uri_path}/files/${path}`});
                } else {
                    console.log("Problema no desofuscamento")
                    res.status(500).json({error: true, msg: "Problema no desofuscamento"});
                }
            } else {
                res.status(400).json({error: {msg: "Arquivo invalido!"}})
            }
        }
    })
});

// Função para ler lina a linha o arquivo
async function processFile(file){
    const outpath = `${dirDest}/tmp/${process.env.OUTDIR}/${file.filename}`;
    const writeStream = fs.createWriteStream(outpath, {flags: 'a'});

    writeStream.on('error', (err) =>{
        console.log(err);
        return {error: {msg: "Algum erro ai", error: err}};
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

    readInterface.on('close', () =>{
        writeStream.end();
    });
    await once(writeStream, 'finish');
    return file.filename;
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
                    mgs: "Erro interno no sistema."
                }
            ]
        })
    }
});

module.exports = decode;