const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();
const User = require('../models/user')
const Product = require('../models/product')
const fs = require('fs')
const path = require('path')

app.use(fileUpload({ useTempFiles: true }));

app.put('/upload/:type/:id', (req, res) => {
    let type = req.params.type;
    let id = req.params.id;

    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'No files were uploaded.'
            }
        });
    }

    // Validate Extensions
    let validExtensions = ['png', 'jpg', 'gif', 'jpeg'];

    // Vilidate Types
    let validTypes = ['users', 'products'];

    if (validTypes.indexOf(type) < 0) {
        return res.status(400).json({
            ok: false,
            error: {
                message: 'The Type is not correct',
                type_Received: type,
                valid_Type: validTypes.join(', ')
            }
        })
    }

    // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
    let sampleFile = req.files.sampleFile;
    let cutName = sampleFile.name.split('.');
    let extension = cutName[cutName.length - 1];

    if (validExtensions.indexOf(extension) < 0) {
        return res.status(400).json({
            ok: false,
            error: {
                message: 'The file not have a valid extension',
                extensionReceived: extension,
                validExtensions: validExtensions.join(', ')
            }
        })
    }

    // CHANGE THE NAME TO FILE
    let newFileName = `${id}-${new Date().getMilliseconds()}.${extension}`;

    // Use the mv() method to place the file somewhere on your server
    sampleFile.mv(`uploads/${type}/${newFileName}`, (err) => {
        if (err)
            return res.status(500).json({
                ok: false,
                err
            });

        //imageUser(id, res, newFileName);
        if (type === validTypes[0]) {
            return imageUser(id, res, newFileName);
        }
        if (type === validTypes[1]) {
            return imageProduct(id, res, newFileName);
        }
    });
})


function imageUser(id, res, newFileName) {
    User.findById(id, (err, userDB) => {
        if (err) {
            deleteFile(newFileName, 'users')
            return res.status(500).json({
                ok: false,
                err
            })
        }
        if (!userDB) {
            deleteFile(newFileName, 'users')
            return res.status(400).json({
                ok: false,
                err
            })
        }

        deleteFile(userDB.img, 'users')

        userDB.img = newFileName;
        userDB.save((err, savedUser) => {
            res.status(200).json({
                ok: true,
                update_user: savedUser,
                file: newFileName
            })
        })
    })
}

function imageProduct(id, res, newFileName) {
    Product.findById(id, (err, productDB) => {
        if (err) {
            deleteFile(newFileName, 'products')
            return res.status(500).json({
                ok: false,
                err
            })
        }
        if (!productDB) {
            deleteFile(newFileName, 'products')
            return res.status(404).json({
                ok: false,
                message: 'Product Not Found'
            })
        }
        deleteFile(productDB.img, 'products')
        productDB.img = newFileName;
        productDB.save((err, productSaved) => {
            res.status(200).json({
                ok: true,
                productUpdated: productSaved,
                img: newFileName
            })
        })
    })
}

function deleteFile(fileName, type) {
    let pathUrlImage = path.resolve(__dirname, `../../uploads/${type}/${fileName}`);
    if (fs.existsSync(pathUrlImage)) {
        fs.unlinkSync(pathUrlImage);
    }
}


module.exports = app;