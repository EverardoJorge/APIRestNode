const express = require('express')
const fs = require('fs')
const path = require('path')
const { veryfyTokeImg } = require('../middleware/authentication')


let app = express()

app.get('/image/:type/:img', veryfyTokeImg, (req, res) => {
    let type = req.params.type;
    let img = req.params.img;

    let pathUrlImage = path.resolve(__dirname, `../../uploads/${type}/${img}`);
    let noImage = path.resolve(__dirname, '../assets/no-image.jpg')
    if (fs.existsSync(pathUrlImage)) {
        res.sendFile(pathUrlImage)
    } else {
        res.sendFile(noImage);
    }
})

module.exports = app;