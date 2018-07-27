var mongoose = require('mongoose');
var Schema = mongoose.Schema

var FeedbackSchema = new Schema({
    name: Schema.Types.String,
    email: Schema.Types.String,
    star: Schema.Types.Number,
    comment: Schema.Types.String,
    timestamp: {
        type: Date,
        default: Date.now
    },
}, {
    versionKey: false, 
    minimize: false
});

module.exports = mongoose.model('Feedback', FeedbackSchema);