var Utilities = require("../Utilities");
var Encoder = require("../Encoder");

class X25Record {

    data = "";

    constructor(data){
        if(!data) return;

        this.data = data;
    }

    decode = function(consumer){
        let length = consumer.byte();
        this.data = consumer.string("utf8", length);
        return this.data;
    }

    encode = function(){
        var x25 = Encoder.string(this.data);
        return x25.data;
    }

}

module.exports = X25Record;