var connection = require("./connection");
var mongoose = require("mongoose");

var Schema = mongoose.Schema;
var mySchema = new Schema({
    total: { type: Number, trim: true },
    blocked: { type: Number, trim: true }
}, { strict: false });

module.exports = connection.model("stats", mySchema, "stats");