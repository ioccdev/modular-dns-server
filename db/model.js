var connection = require("./connection");
var mongoose = require("mongoose");

var Schema = mongoose.Schema;
var mySchema = new Schema({
    domain: { type: String, trim: true },
}, { strict: false });

module.exports = connection.model("list", mySchema, "list");