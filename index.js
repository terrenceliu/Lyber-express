// Library
var express = require('express');
var cors = require('cors');

app = express();

var uberController = require('./controllers/uber-controller');
var lyftController = require('./controllers/lyft-controller');
var estimateController = require('./controllers/estimateController');

// Middlewares
app.use(cors());
app.use('/api/uber', uberController);
app.use('/api/lyft', lyftController);
app.use('/api/estimate', estimateController);
// Routers
app.get('/', function (req, res) {
    res.status(200).send("Lyber server. Repo link: https://github.com/terrenceliu/Lyber-express");
})

var port = process.env.PORT || 8000
app.listen(port, function () {
    console.log('Server listens on port ' + port + '.');
})