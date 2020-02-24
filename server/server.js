require('./settings/settings');
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');


// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));


// parse application/json
app.use(bodyParser.json());

/**
 * Enable public directory public
 */
app.use(express.static(path.resolve(__dirname, '../public')));


/**
 * SETTINGS TO GLOBAL ROUTEs
 */
app.use(require('./routes/index'));


/**
 * CONECTION TO DB
 */
mongoose.connect(process.env.URLDB, { useNewUrlParser: true, useCreateIndex: true },
    (err, res) => {
        if (err) throw err;
        console.log('*******************Conection Succeful************');

    });


/**
 * START SERVER
 */
app.listen(process.env.PORT, () => {
    console.log(`Running in the port ${process.env.PORT}`);
});