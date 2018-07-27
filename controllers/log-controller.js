var express = require('express');
var router = express.Router();

// Model
var Request = require('../models/request');
var Feedback = require('../models/feedback');

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

router.post('/feedback', function(req, response) {
    var data = req.body;
    var instance = new Feedback();
    
    instance.name = data.name ? data.name : "";
    instance.email = data.email ? data.email : "";
    instance.star = data.star ? data.star : -1;
    instance.comment = data.comment ? data.comment : "";

    instance.save(function(err) {
        if (err) {
            console.log("[ReqModel][Feedback]", err);
            response.status(500);
            response.send("interval server error");
        }
    })

    response.send("saved feedback");
});

module.exports = router;