var express = require('express');
var router = express.Router();
var fetch = require('node-fetch');

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


/**
 * Returns both Uber & Lyft data
 *   
 * 
 * 
 */
router.get('/', function (req, response) {
    if (req.query.depar_lat && req.query.depar_lng && req.query.dest_lat && req.query.dest_lng) {
        const deparLat = req.query.depar_lat;
        const deparLng = req.query.depar_lng;
        const destLat = req.query.dest_lat;
        const destLng = req.query.dest_lng;

        const uberPriceURL = 'https://api.uber.com' + `/v1.2/estimates/price?start_latitude=${deparLat}&start_longitude=${deparLng}&end_latitude=${destLat}&end_longitude=${destLng}`;
        const uberTimeURL = 'https://api.uber.com' + `/v1.2/estimates/time?start_latitude=${deparLat}&start_longitude=${deparLng}`;

        const lyftPriceURL = 'https://api.lyft.com' + `/v1/cost?start_lat=${deparLat}&start_lng=${deparLng}&end_lat=${destLat}&end_lng=${destLng}`;
        const lyftTimeURL = 'https://api.lyft.com' + `/v1/eta?lat=${deparLat}&lng=${deparLng}`;

        var uberPrice = getUberPrice(uberPriceURL)
        var uberTime = getUberTime(uberTimeURL)

        var lyftPrice = getLyftPrice(lyftPriceURL);
        var lyftTime = getLyftTime(lyftTimeURL);

        Promise.all([uberPrice, uberTime, lyftPrice, lyftTime]).then((val) => {
            var uberData = uberPrice;
            var lyftData = lyftPrice;

            for (var i = 0; i < uberData.length; i++) {
                for (var j = 0; j < uberTime.length; j++) {
                    if (uberData[i].display_name == uberTime[j].display_name) {
                        uberData[i].eta = uberTime[j].eta
                    }
                }
            }
            
            for (var i = 0; i < lyftData.length; i++) {
                for (var j = 0; j < lyftTime.length; j++) {
                    if (lyftData[i].display_name == lyftTime[j].display_name) {
                        lyftData[i].eta = lyftTime[j].eta
                        
                    }
                }
            }

            
            Promise.all([uberData, lyftData]).then(([uber, lyft]) => {
                data = {
                    "prices": uber.concat(lyft)
                };
                // console.log(data);
                response.json(data);
            });
        }).catch((e) => {
            response.send(404, "Failed to fetch data");
        });;
    } else {
        response.send("Estimate endpoint.");
    }
});

/**
 * 
 */
getUberPrice = (url) => {
    return fetch(url, {
        headers: {
            'Authorization': uberToken,
            'Accept-Language': 'en_US',
            'Content-Type': 'application/json'
        },
        method: 'GET'
    })
    .then(res => res.json())
    .then(data => parseUberPrice(data))
    .catch(e => console.log(e));
}

getUberTime = (url) => {
    return fetch(url, {
        headers: {
            'Authorization': uberToken,
            'Accept-Language': 'en_US',
            'Content-Type': 'application/json',
        },
        method: 'GET'
    })
    .then(res => res.json())
    .then(data => parseUberTime(data))
    .catch(e => console.log(e))
}

getLyftPrice = (url) => {
    return fetch(url, {
        headers: {
            'Authorization': lyftToken
        },
        method: 'GET'
    })
    .then(res => res.json())
    .then(data => parseLyftPrice(data))
    .catch(e => console.log(e));
}

getLyftTime = (url) => {
    return fetch(url, {
        headers: {
            'Authorization': lyftToken
        },
        method: 'GET'
    })
    .then(res => res.json())
    .then(data => parseLyftTime(data))
    .catch(e => console.log(e));
}

/**
 * 
 */
parseUberTime = (e) => {
    var res = [];

    var data = e.times;

    var n = data.length;

    for (var i = 0; i < n; i++) {
        const item = data[i];
        res.push({
            display_name: item.display_name,
            product_id: item.product_id,
            eta: item.estimate
        })
    }

    return res;
}

/**
 * 
 */
parseLyftTime = (e) => {
    var res = [];

    var data = e.eta_estimates;

    var n = data.length;

    for (var i = 0; i < n; i++) {
        const item = data[i];
        res.push({
            display_name: item.display_name,
            product_id: item.ride_type,
            eta: item.eta_seconds
        })
    }

    return res;
}

/**
 * 
 */
parseUberPrice = (e) => {
    var res = [];
    
    var data = e.prices;
    
    var n = data.length;
    
    for(var i = 0; i < n; i++) {
        const item = data[i];
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
    }
    return res;
}

/**
 * 
 */
parseLyftPrice = (e) => {
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

