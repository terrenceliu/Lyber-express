var express = require('express');
var router = express.Router();

var uberAccessToken = undefined;
if (process.env.uberAccessToken) {
    uberAccessToken = process.env.uberAccessToken;
} else {
    var config = require('../config.json');
    uberAccessToken = config.uberAccessToken;
}

router.post('/estimate', function(req, response) {
    var data = req.body;

    const deparLat = data.depar_lat;
    const deparLng = data.depar_lng;
    const destLat = data.dest_lat;
    const destLng = data.dest_lng;
    const uberID = data.uber_id;
    // const lyftID = data.lyft_id;
    
    var uberData = {
        product_id: uberID,
        start_latitude: deparLat,
        start_longitude: deparLng,
        end_latitude: destLat,
        end_longitude: destLng
    };

    console.log(uberData);

    // var uberPrice = getUberPrice(deparLat, dep)


});