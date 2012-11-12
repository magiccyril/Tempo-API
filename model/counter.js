var mongoose = require('mongoose');

/**
 * Schema
 */
var schema = new mongoose.Schema({
  currentValue: {
    min: 0,
    required: true,
    type: Number
  },
  name: {
    required: true,
    type: String
  },
  startMonth: {
    max: 12,
    min: 1,
    required: true,
    type: Number
  },
  startDay: {
    max: 31,
    min: 1,
    required: true,
    type: Number
  },
  startValue: {
    max: 31,
    min: 0,
    required: true,
    type: Number
  }
});


schema.pre('save', function (next) {
  if (this.currentValue > this.startValue) {
    var err = new Error('Invalid current value, must be lower than start value');
    next(err);
  }

  next();
});

/**
 * Methods
 */
schema.method({
  decrease: function () {
    this.currentValue = this.currentValue - 1;
  },
  reset: function () {
    this.currentValue = this.startValue;
  }
});

/**
 * Model
 */
var Counter = mongoose.model('Counter', schema);
module.exports = Counter;