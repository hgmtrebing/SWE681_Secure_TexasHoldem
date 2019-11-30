const mongoose = require('mongoose');

let schema = mongoose.Schema;

let SystemLoggerSchema = new schema({
    type:{
        type: String,
        enum:["System", "Error"],
        default: "System"
    },
    message: {
        type: String
    }
}, { timestamps: true });

module.exports = mongoose.model('SystemLog', SystemLoggerSchema);