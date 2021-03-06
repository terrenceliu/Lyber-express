var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var RequestSchema = new Schema({
    id: Schema.Types.String,
    deparLat: Schema.Types.Number,
    deparLng: Schema.Types.Number,
    destLat: Schema.Types.Number,
    destLng: Schema.Types.Number,
    timestamp: {
        type: Date,
        default: Date.now
    },
    company: Schema.Types.String,
    productName: Schema.Types.String,
    priceMin: Schema.Types.Number,
    priceMax: Schema.Types.Number,
    eta: Schema.Types.Number,
    priority: Schema.Types.String
}, { 
    versionKey: false, 
    minimize: false
});

module.exports = mongoose.model('Request', RequestSchema);