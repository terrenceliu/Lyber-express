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
app.get('/api', function (req, res) {
    console.log("New connection");
    
    res.status(200).send("Lyber server. Repo link: https://github.com/terrenceliu/Lyber-express");
})

app.get('*', function (req, res) {
    var fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
    console.log("[FallBack]", fullUrl);
    res.status(200).send("Fall back endpoint. Request full url: " + fullUrl);
})

var port = process.env.PORT || 8000
app.listen(port, function () {
    console.log('Server listens on port ' + port + '.');
})