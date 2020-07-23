require('dotenv').config()
const fs = require('fs')

module.exports = function verifyDirs(dirname){
    console.log("Verificando diretorios...")
    fs.access(dirname+"/tmp/", fs.constants.F_OK, (err) => {
        if(!err){
            fs.stat(dirname+"/tmp/", (err, stats) => {
                if(err) throw err;
                if(!stats.isDirectory()) {
                    throw new Error(`tmp existe e não é um diretório!`)
                }
            })
            fs.stat(dirname+"/tmp/"+process.env.UPDIR, (err, stats) => {
                if(err) {
                    createDir(dirname+"/tmp/"+process.env.UPDIR, process.env.UPDIR)
                } else 
                if(!stats.isDirectory()) {
                    throw new Error(`${process.env.UPDIR} existe e não é um diretório!`)
                }
            })
            fs.stat(dirname+"/tmp/"+process.env.OUTDIR, (err, stats) => {
                if(err) {
                    createDir(dirname+"/tmp/"+process.env.OUTDIR, process.env.OUTDIR)
                } else 
                if(!stats.isDirectory()) {
                    throw new Error(`${process.env.OUTDIR} existe e não é um diretório!`)
                }
            })
        } else {
            createDir(dirname+"/tmp/", 'tmp')
            createDir(dirname+"/tmp/"+process.env.UPDIR, process.env.UPDIR)
            createDir(dirname+"/tmp/"+process.env.OUTDIR, process.env.OUTDIR)
        }
        console.log("Todos diretorios necessarios presentes!")
    })



    // fs.access(dirname+"/tmp/"+process.env.UPDIR, fs.constants.F_OK, (err) => {
    //     if(!err){
    //         fs.stat(process.env.UPDIR, (err, stats) => {
    //             if(err) throw err;
    //             if(!stats.isDirectory()) {
    //                 throw new Error(`${process.env.UPDIR} existe e não é um diretório!`)
    //             }
    //         })   
    //     } else {
    //         createDir(process.env.UPDIR)
    //     }
    // })
    // fs.access(process.env.OUTDIR, fs.constants.F_OK, (err) => {
    //     if(!err){
    //         fs.stat(__dirname+"/"+process.env.OUTDIR, (err, stats) => {
    //             if(err) throw err;
    //             if(!stats.isDirectory()) {
    //                 throw new Error(`${process.env.OUTDIR} existe e não é um diretório!`)
    //             }
    //         })
    //     } else {
    //         createDir(process.env.OUTDIR)
    //     }
    // })
}

function createDir(dir, name){
    fs.mkdir(dir, (err) =>{
        if(err) throw err;
        console.log(`${name} criado com sucesso!`);
    });
}