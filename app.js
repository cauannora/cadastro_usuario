const express = require('express')
const app = express();
const router = require('./router');
const port = 3001;

app.use(router);

app.listen(port, () =>{
    console.log("Server running!");
})

