var express = require('express');
var router = express.Router();
var fetch = require('node-fetch');

/**
 * 
 * @deprecated
 * Returns all requests
 */
router.get('/', function (req, response) {
    if (req.query.depar_lat && req.query.depar_lng && req.query.dest_lat && req.query.dest_lng) {
        const deparLat = req.query.depar_lat;
        const deparLng = req.query.depar_lng;
        const destLat = req.query.dest_lat;
        const destLng = req.query.dest_lng;
        
        const lyftAPI = `https://api.lyft.com/v1/cost?start_lat=${deparLat}&start_lng=${deparLng}&end_lat=${destLat}&end_lng=${destLng}`;
        
        // var lyftToken = "bearer " + process.env.lyftToken;
        var lyftToken = "bearer ";
        if (process.env.lyftToken) {
            lyftToken += process.env.lyftToken;
        } else {
            var config = require("../config.json");
            lyftToken += config.lyftToken;
        }
        
        const lyftData = fetch(lyftAPI, {
            headers: {
                'Authorization': lyftToken
            },
            method: 'GET'
        })
        .then(res => res.json())
        .then(data => response.json(data))
        .catch(e => console.log(e));
    } else {
        response.send("Lyft endpoint");
    }
})

module.exports = router;