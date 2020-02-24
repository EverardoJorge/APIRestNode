const express = require('express');
const _ = require('underscore');
let { verifyToken, verifyAdminRol } = require('../middleware/authentication')

let app = express();
let Product = require('../models/product');

// ==================================
// SHOW PRODUCTS
// ==================================
app.get('/products', (req, res) => {
    let from = req.query.from || 0;
    from = Number(from);
    let limit = req.query.limit || 5;
    limit = Number(limit);
    Product.find({ available: true })
        .sort('name')
        .skip(from)
        .limit(limit)
        .populate('category', 'name description')
        .populate('user', 'name email')
        .exec((err, products) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    message: 'There is a error',
                    err
                })
            }
            if (!products) {
                return res.status(400).json({
                    ok: false,
                    err
                })
            }
            res.json({
                ok: true,
                message: 'Correct Request',
                products
            })
        })
});


// ==================================
// SHOW A PRODUCT
// ==================================
app.get('/product/:id_product', (req, res) => {
    let id_product = req.params.id_product;
    Product.findById(id_product)
        .populate('category', 'name description')
        .populate('user', 'name email')
        .exec((err, product) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            }
            if (!product) {
                return res.status(400).json({
                    ok: false,
                    err
                })
            }
            res.json({
                ok: true,
                message: 'This is the product',
                product
            })
        })
});

// ==================================
// SEARCH PRODUCTS BY COINCIDENCE
// ==================================
app.get('/products/search/:term', verifyToken, (req, res) => {
    let term = req.params.term;
    let regexp = new RegExp(term, 'i');
    Product.find({ name: regexp })
        .populate('category', 'name description')
        .exec((err, resultSearch) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            }
            if (!resultSearch) {
                return res.status(400).json({
                    ok: false,
                    err
                })
            }
            res.json({
                ok: true,
                resultSearch
            })
        })
})

// ==================================
// CREATE A NEW PRODUCT
// ==================================
app.post('/product', [verifyToken, verifyAdminRol], (req, res) => {
    let body = req.body;

    let product = new Product({
        name: body.name,
        unitPrice: body.unitPrice,
        description: body.description,
        available: body.available,
        category: body.category,
        user: req.user._id
    })
    product.save((e, productDB) => {
        if (e) {
            return res.status(500).json({
                ok: false,
                e
            })
        }
        if (!productDB) {
            return res.status(400).json({
                ok: false,
                e
            })
        }
        res.json({
            ok: true,
            productDB
        })
    })

});

// ==================================
// DELETE A NEW PRODUCT
// ==================================
app.delete('/product/:id_product', [verifyToken, verifyAdminRol], (req, res) => {
    let id_product = req.params.id_product;
    let changeAvailable = {
        available: false
    }
    Product.findByIdAndUpdate(id_product, changeAvailable, { new: true }, (err, productDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }
        if (!productDB) {
            return res.status(400).json({
                ok: false,
                err
            })
        }
        res.json({
            ok: true,
            productDB
        })
    })
});

// ==================================
// UPDATE A NEW PRODUCT
// ==================================
app.put('/product/:id_product', [verifyToken, verifyAdminRol], (req, res) => {
    let id_product = req.params.id_product;
    let body = _.pick(req.body, ['name', 'unitPrice', 'available', 'category'])
    Product.findByIdAndUpdate(id_product, body, {
        new: true,
        runValidators: true
    }, (err, productDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }
        if (!productDB) {
            return res.status(400).json({
                ok: false,
                err
            })
        }
        res.json({
            ok: true,
            message: 'Updated Product',
            productDB
        })
    })

});

module.exports = app;