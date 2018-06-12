const PORT = process.env.PORT || 8000

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

app.listen(PORT, function () {
    console.log('Server listens on port 8000.');
})