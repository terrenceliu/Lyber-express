var express = require('express');
var router = express.Router();

// Model
var Request = require('../models/request');

router.post('/request', function(req, response) {
    var data = req.body;
    var instance = new Request();
    
    instance.id = data.id;
    instance.deparLat = data.deparLat;
    instance.deparLng = data.deparLng;
    instance.destLat = data.destLat;
    instance.destLng = data.destLng;
    instance.company = data.company;
    instance.productName = data.productName;
    instance.priceMin = data.priceMin;
    instance.priceMax = data.priceMax;
    instance.eta = data.eta;
    instance.priority = data.priority;
    
    instance.save(function(err) {
        if (err) {
            console.log("[ReqModel]", err);
            response.status(500)
            response.send("internal server error");
        }
    });
    
    response.send("logged");
});

module.exports = router;