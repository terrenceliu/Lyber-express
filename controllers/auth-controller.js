var express = require('express');
var router = express.Router();
var fetch = require('node-fetch');
var FormData = require('form-data');

/**
 * 
 */
router.get('/login', function (req, response) {
    const authURL = "https://login.uber.com/oauth/v2/authorize?response_type=code&client_id=jOOUs484dDpd5ZtVxT5A8cp9CEknN5sz&scope=profile&redirect_uri=https://lyber-server.herokuapp.com/auth/redirect"
    response.redirect(authURL);
});

/**
 * 
 * 
 * 
 */
router.get('/redirect', function (req, response) {
    const redirect_uri = "https://lyber.co/auth/redirect";
    // const redirect_uri = "http://localhost:8000/auth/redirect";
    
    // Get auth code
    const authCode = req.query.code;
    
    console.log("Query: ", req.query);

    // Exchange token
    const tokenURL = "https://login.uber.com/oauth/v2/token";

    var uberSecret = undefined;
    var uberID = undefined;

    if (process.env.uberToken) {
        uberSecret = process.env.uberSecret;
        uberID = process.env.uberID;
    } else {
        var config = require('../config.json');
        uberSecret = config.uberSecret;
        uberID = config.uberID;

    }
    
    var formData = new FormData();

    formData.append('client_id', uberID);
    formData.append('client_secret', uberSecret);
    formData.append('grant_type', 'authorization_code');
    formData.append('redirect_uri', redirect_uri);
    formData.append('code', authCode);
    formData.append('scope', 'profile');
    
    console.log("FormData ", formData);
    
    // Exchange access token
    // TODO: Fix redirect uri here.
    const accessToken = fetch(tokenURL, {
        method: "POST",
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        console.log("Access response", data);
        response.redirect("https://lyber.co?access_token="+ data.access_token);
    })
    .catch(e => console.log(e));
});

module.exports = router;