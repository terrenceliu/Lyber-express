// Library
var express = require('express');
var cors = require('cors');

app = express();

var uberController = require('./controllers/uber-controller');
var lyftController = require('./controllers/lyft-controller');

// Middlewares
app.use(cors());
app.use('/api/uber', uberController);
app.use('/api/lyft', lyftController);

// Routers
app.get('/', function (req, res) {
    res.status(200).send("Hello, World.");
})

var port = process.env.PORT || 8000
app.listen(port, function () {
    console.log('Server listens on port ' + port + '.');
})