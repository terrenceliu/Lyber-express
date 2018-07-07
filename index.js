// Library
var express = require('express');
var db = require('./db');
var cors = require('cors');
var bodyParser = require('body-parser');

app = express();

var uberController = require('./controllers/uber-controller');
var lyftController = require('./controllers/lyft-controller');
var estimateController = require('./controllers/estimate-controller');
var authController = require('./controllers/auth-controller');
var logController = require('./controllers/log-controller');


// Middlewares
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api/uber', uberController);
app.use('/api/lyft', lyftController);
app.use('/api/estimate', estimateController);
app.use('/auth', authController);
app.use('/log', logController);

// Routers
app.get('/', function (req, res) {
    res.status(200).send("Lyber server. Repo link: https://github.com/terrenceliu/Lyber-express");
})

var port = process.env.PORT || 8000
app.listen(port, function () {
    console.log('Server listens on port ' + port + '.');
})