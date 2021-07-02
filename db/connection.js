var mongoose = require("mongoose");
var path = require("path");

var option = {
    useNewUrlParser: true,
    useUnifiedTopology: true
};

module.exports = mongoose.createConnection("mongodb://localhost/dns", option);
