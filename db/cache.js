var connection = require("./connection");
var mongoose = require("mongoose");

var Schema = mongoose.Schema;
var mySchema = new Schema({
    date: { type: Date, trim: true },
    domain: { type: String, trim: true },
    type: { type: String, trim: true },
    data: Object
}, { strict: false });

module.exports = connection.model("cache", mySchema, "cache");