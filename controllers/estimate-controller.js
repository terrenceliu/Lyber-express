var express = require('express');
var router = express.Router();
var fetch = require('node-fetch');

var uberToken = "Token ";
var lyftToken = "bearer ";
var uberAccessToken = undefined;

const LyftPrice = require('../assets/constant');

var Estimate = require('../models/estimate');

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
 */
router.get('/beta', function (req, response) {

    if (req.query.depar_lat && req.query.depar_lng && req.query.dest_lat && req.query.dest_lng && req.query.dest_ref) {
        const deparLat = req.query.depar_lat;
        const deparLng = req.query.depar_lng;
        const destLat = req.query.dest_lat;
        const destLng = req.query.dest_lng;

        const deparRef = req.query.depar_ref;
        const destRef = req.query.dest_ref;

        const uberPriceURL = 'https://api.uber.com' + `/v1.2/estimates/price?start_latitude=${deparLat}&start_longitude=${deparLng}&end_latitude=${destLat}&end_longitude=${destLng}`;
        const uberTimeURL = 'https://api.uber.com' + `/v1.2/estimates/time?start_latitude=${deparLat}&start_longitude=${deparLng}`;

        const uberQuery = `?pickupLat=${deparLat}&pickupLng=${deparLng}&destinationRef=${destRef}&destinationRefType=google_places`
        
        const uberBetaURL = "https://www.uber.com/api/fare-estimate-beta" + uberQuery;

        const lyftPriceURL = 'https://api.lyft.com' + `/v1/cost?start_lat=${deparLat}&start_lng=${deparLng}&end_lat=${destLat}&end_lng=${destLng}`;
        const lyftTimeURL = 'https://api.lyft.com' + `/v1/eta?lat=${deparLat}&lng=${deparLng}`;
        
        var uberPricePromise = getUberPrice(uberPriceURL);
        var uberTimePromise = getUberTime(uberTimeURL);
        var uberBetaPromise = getUberBeta(uberBetaURL);

        var lyftPricePromise = getLyftPrice(lyftPriceURL);
        var lyftTimePromise = getLyftTime(lyftTimeURL);

        // Test code

        Promise.all([uberPricePromise, uberTimePromise, uberBetaPromise, lyftPricePromise, lyftTimePromise])
        .then(([uberPrice, uberTime, uberFare, lyftPrice, lyftTime]) => {
            if (!uberPrice || !uberTime || !uberFare || !lyftPrice || !lyftTime) {
                console.log("missing");
                // console.log()
            }

            
            var uberData = uberPrice;
            var lyftData = lyftPrice;

            for (var i = 0; i < uberData.length; i++) {
                for (var j = 0; j < uberTime.length; j++) {
                    
                    if (uberData[i].display_name == uberTime[j].display_name) {
                        uberData[i].eta = uberTime[j].eta
                    }
                }
            }
            
            // Add beta fare estimate
            for (var i = 0; i < uberData.length; i++) {
                for (var j = 0; j < uberFare.length; j++) {
                    if (uberData[i].display_name == uberFare[j].display_name) {
                        uberData[i].fare_estimate = uberFare[j].fare_estimate;
                    }
                }
            }

            console.log(uberData);

            for (var i = 0; i < lyftData.length; i++) {
                for (var j = 0; j < lyftTime.length; j++) {
                    if (lyftData[i].display_name == lyftTime[j].display_name) {
                        lyftData[i].eta = lyftTime[j].eta
                        
                    }
                }
            }
            
            /**
             * Send back response
             */
            Promise.all([uberData, lyftData]).then(([uber, lyft]) => {
                
                /**
                * Log into database
                */
                var instance = new Estimate();

                // console.log("[Estimate] New Estimate. ObjectID: ", instance._id);
                var data = {
                    "prices": uber.concat(lyft),
                    "id": instance._id
                };

                instance.deparLat = deparLat;
                instance.deparLng = deparLng;
                instance.destLat = destLat;
                instance.destLng = destLng;
                instance.estData = data.prices;
                
                instance.save(function (err) {
                    if (err) {
                        console.log('[EstModel] Save error.', err);
                    }
                });
                
                // console.log("instance id: ", instance._id);
                response.json(data);
            });
            
        }).catch((e) => {
            response.send(404, "Failed to fetch data");
        });
    } else {
        response.send("Estimate endpoint.");
    }
});


/**
 * Returns uber beta test
 */
router.get('/uberBeta', function (req, response) {
    const deparRef = req.query.depar_ref;
    // const deparRefType = req.query.pickupRefType;
    const deparLat = req.query.depar_lat;
    const deparLng = req.query.depar_lng;
    const destRef = req.query.dest_ref;
    // const destRefType = req.query.destinationRefType;

    const uberQuery = `?pickupRef=${deparRef}&pickupRefType=google_places&pickupLat=${deparLat}&pickupLng=${deparLng}&destinationRef=${destRef}&destinationRefType=google_places`
    
    const uberBetaAPI = "https://www.uber.com/api/fare-estimate-beta" + uberQuery;

    fetch(uberBetaAPI, {
        method: 'GET'
    })
    .then(response => response.json())
    .then(data => {
        // console.log(data);
        response.json(data);
    })
    .catch(err => {
        response.send(404, "Failed to fetch data");
        console.log(err);
    })
});

/**
 * Return lyft beta test
 */
router.get('/lyftBeta', function(req, response) {
    const deparLat = req.query.depar_lat;
    const deparLng = req.query.depar_lng;
    const destLat = req.query.dest_lat;
    const destLng = req.query.dest_lng;

    // Reuse code maybe?
    const lyftAPI = `http://localhost:8000/api/lyft?depar_lat=${deparLat}&depar_lng=${deparLng}&dest_lat=${destLat}&dest_lng=${destLng}`;

    fetch(lyftAPI, {
        method: 'GET'
    })
    .then(response => response.json())
    .then(estimateLyft)
    .then(data => {
        response.json(data);
    })
    .catch(err => {
        console.log(err);
    })
});

/**
 * Returns both Uber & Lyft data
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

        var uberPricePromise = getUberPrice(uberPriceURL)
        var uberTimePromise = getUberTime(uberTimeURL)

        var lyftPricePromise = getLyftPrice(lyftPriceURL);
        var lyftTimePromise = getLyftTime(lyftTimeURL);

        Promise.all([uberPricePromise, uberTimePromise, lyftPricePromise, lyftTimePromise]).then(([uberPrice, uberTime, lyftPrice, lyftTime]) => {
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

            /**
             * Send back response
             */
            Promise.all([uberData, lyftData]).then(([uber, lyft]) => {
                
                /**
                * Log into database
                */
                var instance = new Estimate();

                // console.log("[Estimate] New Estimate. ObjectID: ", instance._id);
                var data = {
                    "prices": uber.concat(lyft),
                    "id": instance._id
                };

                instance.deparLat = deparLat;
                instance.deparLng = deparLng;
                instance.destLat = destLat;
                instance.destLng = destLng;
                instance.estData = data.prices;
                
                instance.save(function (err) {
                    if (err) {
                        console.log('[EstModel] Save error.', err);
                    }
                });
                
                // console.log("instance id: ", instance._id);
                
                response.json(data);
            });
            
        }).catch((e) => {
            response.send(404, null);
        });
    } else {
        response.send("Estimate endpoint.");
    }
});

/**
 * Price Range
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

getUberBeta = (uberBetaAPI) => {
    return fetch(uberBetaAPI, {
        method: 'GET'
    })
    .then(response => response.json())
    .then(estimateUber)
    .catch(err => {
        console.log(err);
    });
}

estimateUber = (estimates) => {
    if (estimates.prices) {
        let data = estimates.prices;
        res = [];
        for (var i = 0; i < data.length; i ++) {
            temp = {};
            temp.display_name = data[i].vehicleViewDisplayName;
            temp.fare_estimate = parseFloat(data[i].fareString.split("$")[1]);
            res.push(temp)
        }
        console.log(res);
        return res;
    } else {
        return estimates;
    }
}

estimateLyft = (estimates) => {
    let data = estimates.cost_estimates;
    for (var i = 0; i < data.length; i++) {
        miles = data[i].estimated_distance_miles;
        sec = data[i].estimated_duration_seconds;
        type = data[i].ride_type;

        price = LyftPrice[type];
        
        estimates = 1.0 * miles * price.cost_mile + 1.0 * sec / 60.0 * price.cost_min + price.base_fare + price.service_fee

        if (estimates < price.min_fare) {
            // TODO:
        }

        data[i].estimated_cost = estimates
    }
    return data;
};

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

        miles = item.estimated_distance_miles;
        sec = item.estimated_duration_seconds;
        type = item.ride_type;
        estimates = null;

        try {
            price = LyftPrice[type];
            // console.log(type);
            estimates = 1.0 * miles * price.cost_mile + 1.0 * sec / 60.0 * price.cost_min + price.base_fare + price.service_fee
        }
        catch(err) {
            console.log(err);
        }
        
        res.push({
            company: "lyft",
            display_name: item.display_name,
            product_id: item.ride_type,
            max_estimate: item.estimated_cost_cents_max * 1.0 / 100,
            min_estimate: item.estimated_cost_cents_min * 1.0 / 100,
            fare_estimate: estimates,
            distance: item.estimated_distance_miles,
            duration: item.estimated_duration_seconds,
            currency_code: item.currency
        });
    };

    return res;
}

module.exports = router;

