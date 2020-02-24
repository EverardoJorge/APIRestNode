const express = require('express');
const _ = require('underscore');
let { verifyToken, verifyAdminRol } = require('../middleware/authentication')
let app = express();
let Category = require('../models/category');

// ===============================
// SHOW ALL CATEGORIES
// ===============================
app.get('/categories', (req, res) => {
    Category.find({})
        .sort('name')
        .populate('user', 'name email')
        .exec((err, categories) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            }
            res.json({
                ok: true,
                categories
            })
        })
})

// ===============================
// SHOW A CATEGORY
// ===============================
app.get('/category/:id_category', (req, res) => {
    let id_category = req.params.id_category;
    Category.findById(id_category, (err, categoryDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }
        if (!categoryDB) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        res.json({
            ok: true,
            categoryDB
        });
    });
});

// ===============================
// CREATE NEW CATEGORY
// ===============================
app.post('/category', [verifyToken, verifyAdminRol], (req, res) => {
    let body = req.body;

    let category = new Category({
        name: body.name,
        description: body.description,
        user: req.user._id
    });

    category.save((err, categoryDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }
        if (!categoryDB) {
            return res.status(400).json({
                ok: false,
                err
            })
        }
        res.json({
            ok: true,
            category: categoryDB
        })
    });
})

// ===============================
// UPDATE A CATEGORY
// ===============================
app.put('/category/:id_category', [verifyToken, verifyAdminRol], (req, res) => {
    let id_category = req.params.id_category;
    let body = _.pick(req.body, ['name', 'description'])

    Category.findByIdAndUpdate(id_category, body, {
        new: true,
        runValidators: true
    }, (err, categoryDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }
        if (!categoryDB) {
            return res.status(400).json({
                ok: false,
                err
            })
        }
        res.json({
            ok: true,
            category: categoryDB
        })
    })

})

// ===============================
// DELETE A CATEGORY
// ===============================
app.delete('/category/:id_category', [verifyToken, verifyAdminRol], (req, res) => {
    let id_category = req.params.id_category;
    Category.findByIdAndRemove(id_category, (err, categoryDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }
        if (!categoryDB) {
            return res.status(400).json({
                ok: false,
                err
            })
        }
        res.json({
            ok: true,
            message: 'Category Deleted :)'
        })
    })
})



module.exports = app;