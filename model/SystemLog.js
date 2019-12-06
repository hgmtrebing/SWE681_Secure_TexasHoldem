const mongoose = require('mongoose');

let schema = mongoose.Schema;

let SystemLoggerSchema = new schema({
    type:{
        type: String,
        enum:["System", "Error"],
        default: "System"
    },
    Created_date: {
        type: Date,
        default: Date.now
      },
    message: {
        type: String
    }
});

module.exports = mongoose.model('SystemLog', SystemLoggerSchema);