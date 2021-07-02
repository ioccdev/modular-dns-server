var Utilities = require("../Utilities");
var Encoder = require("../Encoder");

class ARecord {

    data = "";

    constructor(data){
        if(!data) return;

        this.data = data;
    }

    decode = function(consumer){
        this.data = consumer.byte() + "." + consumer.byte() + "." + consumer.byte() + "." + consumer.byte();
        return this.data;
    }

    encode = function(){

        let encoded = Buffer.from("");

        let aParts = this.data.split(".");
        for(let i = 0; i < 4; i++){
            encoded = Buffer.concat([encoded, Encoder.byte(aParts[i])]);
        }

        return encoded;

    }

}

module.exports = ARecord;