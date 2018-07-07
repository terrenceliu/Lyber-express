var mongoose = require('mongoose');
var Schema = mongoose.Schema

var EstimateSchema = new Schema({
    deparLat: Schema.Types.Number,
    deparLng: Schema.Types.Number,
    destLat: Schema.Types.Number,
    destLng: Schema.Types.Number,
    usrLat: Schema.Types.Number,
    usrLng: Schema.Types.Number,
    timestamp: {
        type: Date,
        default: Date.now
    },
    estData: [Schema.Types.Mixed]
}, {
    versionKey: false, 
    minimize: false
});

module.exports = mongoose.model('Estimate', EstimateSchema);