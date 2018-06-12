var express = require('express');
var router = express.Router();
var fetch = require('node-fetch');
var config = require('../config.json');

/**
 * Returns all requests
 */
router.get('/', function (req, response) {
    if (req.query.depar_lat && req.query.depar_lng && req.query.dest_lat && req.query.dest_lng) {
        const deparLat = req.query.depar_lat;
        const deparLng = req.query.depar_lng;
        const destLat = req.query.dest_lat;
        const destLng = req.query.dest_lng;
        
        const lyftAPI = `https://api.lyft.com/v1/cost?start_lat=${deparLat}&start_lng=${deparLng}&end_lat=${destLat}&end_lng=${destLng}`;

        const lyftToken = "bearer " + config.lyftToken;
        const lyftData = fetch(lyftAPI, {
            headers: {
                'Authorization': lyftToken
            },
            method: 'GET'
        })
        .then(res => res.json())
        .then(res => response.send(res))
        .catch(e => console.log(e));
    } else {
        response.send("Lyft endpoint");
    }
})

module.exports = router;