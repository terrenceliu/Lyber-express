var express = require('express');
var router = express.Router();
var fetch = require("node-fetch");
const uberAPI = 'https://api.uber.com';

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
        
        const url = uberAPI + `/v1.2/estimates/price?start_latitude=${deparLat}&start_longitude=${deparLng}&end_latitude=${destLat}&end_longitude=${destLng}`;
        
        var uberToken = "Token ";
        // var uberToken = "Token " + process.env.uberToken;
        if (process.env.uberToken) {
            uberToken += process.env.uberToken;
        } else {
            var config = require('../config.json');
            uberToken += config.uberToken;
        }

        console.log(uberToken);
        
        const uberData = fetch(url, {
            headers: {
                'Authorization': uberToken,
                'Accept-Language': 'en_US',
                'Content-Type': 'application/json'
            },
            method: 'GET'
        })
        .then(res => res.json())
        .then(data => response.json(data))
        .catch(e => console.log(e));

    } else {
        response.send("Uber endpoint");
    }
});

/**
 * Estimate upfront fare given start/end position and a product id.
 */
router.post('/estimate', (req, response) => {
    
});

/**
 * 'POST /v1.2/requests/estimate'
 * Ref: https://developer.uber.com/docs/riders/references/api/v1.2/requests-estimate-post
 * 
 * Estimate a ride given the product id, start and end locations.
 */
router.post('/', function (req, response) {
    
});


module.exports = router;