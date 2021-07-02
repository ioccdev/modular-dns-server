var Utilities = require("../Utilities");
var Encoder = require("../Encoder");

class AAAARecord {

    data = "";

    constructor(data){
        if(!data) return;

        this.data = data;
    }

    decode = function(consumer){
        this.data = consumer.short().toString(16) + ":" + consumer.short().toString(16) + ":" + consumer.short().toString(16) + ":" + consumer.short().toString(16) + ":" + consumer.short().toString(16) + ":" + consumer.short().toString(16) + ":" + consumer.short().toString(16) + ":" + consumer.short().toString(16);
        return this.data;
    }

    encode = function(){

        let encoded = Buffer.from("");

        let aParts = Utilities.expandIPv6(this.data).split(":");
        for(let i = 0; i < 8; i++){
            encoded = Buffer.concat([encoded, Buffer.from(aParts[i].padStart(4, 0), "hex")]);
        }

        return encoded;

    }

}

module.exports = AAAARecord;