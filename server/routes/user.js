const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const _ = require('underscore');
const User = require('../models/user');

app.get('/', (req, res) => {
  res.json({
    mensaje: 'Hello World'
  })
});

app.get('/user', (req, res) => {

  let from = req.query.from || 0;
  from = Number(from);

  let limit = req.query.limit || 5;
  limit = Number(limit);

  User.find({status : true}, 'name email status role img google')
    .skip(from)
    .limit(limit)
    .exec((err, users) => {
      if (err) {
        return res.status(400).json({
          ok: false,
          err
        });
      }
      User.count({status : true}, (err, count) => {
        res.json({
          ok: true,
          users,
          nRegisters: count
        });
      });

    });
});

app.post('/user', (req, res) => {
  let body = req.body;

  let user = new User({
    name: body.name,
    email: body.email,
    password: bcrypt.hashSync(body.password, 10),
    role: body.role
  });

  user.save((err, userDB) => {

    if (err) {
      return res.status(400).json({
        ok: false,
        err
      });
    }

    res.json({
      ok: true,
      user: userDB
    });
  });

});

app.put('/user/:id_user', (req, res) => {
  let id = req.params.id_user;
  let body = _.pick(req.body, ['name', 'email', 'img', 'role', 'status']);

  User.findByIdAndUpdate(id, body, {
    new: true,
    runValidators: true
  }, (err, userDB) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        err
      });
    }

    res.json({
      ok: true,
      user: userDB
    });
  });
});

app.delete('/user/:id_user', (req, res) => {

  let id_user = req.params.id_user;
  //let body = _.pick(req.body, ['status']);
  let changeStatus = {
    status: false
  }
  User.findByIdAndUpdate(id_user, changeStatus, {
    new: true
  }, (err, userDB) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        err
      });
    }

    if (!userDB) {
      return res.status(400).json({
        ok: false,
        err: {
          message: 'User not found'
        }
      });
    }

    res.json({
      ok: true,
      user: userDB
    });
  });

});

module.exports = app;