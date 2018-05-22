const express = require('express');
const passport = require('passport');
const cors = require('cors');
const path = require('path');
const mongoose = require('mongoose');
const config = require('./config/db');

mongoose.connect(config.database);

mongoose.connection.on('connected', () => {
    console.log('connect to db');
});

mongoose.connection.on('error', err => {
    console.log('connect to db is error: ' + err);
});

const app = express();
const port = 8085;
const users = require('./routes/users');

app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(passport.initialize());
app.use(passport.session());
require('./config/passport')(passport);
app.use('/', users);


app.listen(port, () => {
    console.log('server listen: ' + port);
});