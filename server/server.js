require('./settings/settings');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
 
// parse application/json
app.use(bodyParser.json())

 
app.get('/', (req, res) => {
  res.json('Hello World')
});

app.get('/user', (req, res) => {
  res.json('Get User');
});

app.post('/user', (req, res) => {
  let body = req.body;

  if (body.name === undefined) {
    res.status(400).json({
      ok : false,
      mensaje : 'Te falta incluir el nombre'
    });
  } else {
    res.json({ user : body }); 
  }
});

app.put('/user/:id_user', (req, res) => {
  let id = req.params.id_user;
  res.json({
    id
  });
});

app.delete('/user', (req, res) => {
  res.json('Delete User');
});
 
app.listen(process.env.PORT, () => {
    console.log(`Escuchando en el puerto ${process.env.PORT}`);
});