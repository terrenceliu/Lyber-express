var express = require('express');
var router = express.Router();
var fetch = require("node-fetch");

/**
 * Returns all requests
 */
router.get('/', function (req, response) {
    if (req.query.depar_lat && req.query.depar_lng && req.query.dest_lat && req.query.dest_lng) {
        const deparLat = req.query.depar_lat;
        const deparLng = req.query.depar_lng;
        const destLat = req.query.dest_lat;
        const destLng = req.query.dest_lng;

        const uberAPI = `https://api.uber.com/v1.2/estimates/price?start_latitude=${deparLat}&start_longitude=${deparLng}&end_latitude=${destLat}&end_longitude=${destLng}`;

        var uberToken = "Token " + process.env.uberToken;
        // if (process.env.uberToken) {
        //     uberToken += process.env.uberToken;
        // } else {
        //     var config = require('../config.json');
        //     uberToken += config.uberToken;
        // }

        const uberData = fetch(uberAPI, {
            headers: {
                'Authorization': uberToken,
                'Accept-Language': 'en_US',
                'Content-Type': 'application/json'
            },
            method: 'GET'
        })
        .then(res => res.json())
        .then(res => response.send(res));
        
    } else {
        response.send("Uber endpoint");
    }
})

module.exports = router;