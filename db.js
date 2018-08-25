var mongoose = require('mongoose');
var config = require('./config.json');
var db_uri = (config.mongoUserName && config.mongoPwd) ? `mongodb://${config.mongoUserName}:${config.mongoPwd}@localhost/lyber-server` : "mongodb://localhost/lyber-server"

var port = process.env.PORT || 27017

mongoose.connect(db_uri, (err, res) => {
    if (err) {
        console.log("[DB][Error] Failed to connect to: " + db_uri + ". " + err);
    } else {
        console.log("[DB][Success] Connected to: " + db_uri);
    }
});

