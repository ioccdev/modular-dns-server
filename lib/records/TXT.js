var Utilities = require("../Utilities");
var Encoder = require("../Encoder");

class TXTRecord {


    data = "";

    constructor(data){
        if(!data) return;

        this.data = data;
    }

    decode = function(consumer){
        var txtLength = consumer.byte();
        this.data = consumer.string("utf8", txtLength);
        return this.data;
    }

    encode = function(){

        let txt = Encoder.string(this.data);
        return txt.data;
    }

}

module.exports = TXTRecord;