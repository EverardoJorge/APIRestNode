require('./settings/settings');
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
 
// parse application/json
app.use(bodyParser.json())

app.use( require('./routes/user') );
 


/**
 * CONECTION TO DB
 */
mongoose.connect(process.env.URLDB, 
                {useNewUrlParser: true, useCreateIndex: true},
                (err, res)=>{
  if (err) throw err;
  console.log('*******************Conection Succeful************');
  
});

app.listen(process.env.PORT, () => {
    console.log(`Escuchando en el puerto ${process.env.PORT}`);
});