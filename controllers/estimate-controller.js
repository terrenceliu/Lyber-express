var express = require('express');
var router = express.Router();
var fetch = require('node-fetch');

/**
 * Returns both Uber & Lyft data
 * 
 * 
 * 
 */
router.get('/', function (req, response) {
    var uberData = {};
    var lyftData = {};


    if (req.query.depar_lat && req.query.depar_lng && req.query.dest_lat && req.query.dest_lng) {
        const deparLat = req.query.depar_lat;
        const deparLng = req.query.depar_lng;
        const destLat = req.query.dest_lat;
        const destLng = req.query.dest_lng;

        const uberURL = 'https://api.uber.com' + `/v1.2/estimates/price?start_latitude=${deparLat}&start_longitude=${deparLng}&end_latitude=${destLat}&end_longitude=${destLng}`;
        const lyftURL = 'https://api.lyft.com' + `/v1/cost?start_lat=${deparLat}&start_lng=${deparLng}&end_lat=${destLat}&end_lng=${destLng}`;


        var uberToken = "Token ";
        var lyftToken = "bearer ";
        if (process.env.uberToken) {
            uberToken += process.env.uberToken;
        } else {
            var config = require('../config.json');
            uberToken += config.uberToken;
        }

        if (process.env.lyftToken) {
            lyftToken += process.env.lyftToken;
        } else {
            var config = require("../config.json");
            lyftToken += config.lyftToken;
        }

        var uberPromise = fetch(uberURL, {
            headers: {
                'Authorization': uberToken,
                'Accept-Language': 'en_US',
                'Content-Type': 'application/json'
            },
            method: 'GET'
        })
        .then(res => res.json())
        .then(data => {
            uberData = parseUberData(data)
        })
        .catch(e => console.log(e));

        var lyftPromise = fetch(lyftURL, {
            headers: {
                'Authorization': lyftToken
            },
            method: 'GET'
        })
        .then(res => res.json())
        .then(data => lyftData = parseLyftData(data))
        .catch(e => console.log(e));

        Promise.all([uberPromise, lyftPromise]).then((val) => {
            data = {
                "prices": uberData.concat(lyftData)
            };
            response.json(data);
        });
    } else {
        response.send("Estimate endpoint.");
    }
});

parseUberData = (e) => {
    var res = [];
    
    var data = e.prices;
    
    var n = data.length;

    console.log(n);
    
    for(var i = 0; i < n; i++) {
        const item = data[i];
        console.log(item);
        res.push({
            company: "uber",
            display_name: item.display_name,
            product_id: item.product_id,
            max_estimate: item.high_estimate,
            min_estimate: item.low_estimate,
            distance: item.distance,
            duration: item.duration,
            currency_code: item.currency_code   
        });
        console.log(i, data[i])   
    }
    return res;
}

parseLyftData = (e) => {
    var data = e.cost_estimates;
    var res = [];
    for(var i = 0; i < data.length; i++) {
        item = data[i];
        res.push({
            company: "lyft",
            display_name: item.display_name,
            product_id: item.ride_type,
            max_estimate: item.estimated_cost_cents_max * 1.0 / 100,
            min_estimate: item.estimated_cost_cents_min * 1.0 / 100,
            distance: item.estimated_distance_miles,
            duration: item.estimated_duration_seconds,
            currency_code: item.currency
        });
    };

    return res;
}

module.exports = router;

