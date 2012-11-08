var mongoose = require('mongoose')
    , Schema = mongoose.Schema;

var schema = new Schema({
    day: {
        default: Date.now,
        required: true,
        type: Date
    },
    color: {
        default: 'blue',
        enum: ['blue', 'white', 'red'],
        required: true,
        type: String
    }
});

mongoose.model('Tempo', schema);
module.exports = mongoose.model('Tempo');