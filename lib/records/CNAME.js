var Utilities = require("../Utilities");
var Encoder = require("../Encoder");

class CNAMERecord {

    data = "";

    constructor(data){
        if(!data) return;

        this.data = data;
    }

    decode = function(consumer){
        this.data = consumer.name();
        return this.data;
    }

    encode = function(){
        return Encoder.name(this.data);
    }

}

module.exports = CNAMERecord;