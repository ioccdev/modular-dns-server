var Utilities = require("../Utilities");
var Encoder = require("../Encoder");

class MXRecord {

    data = { priority: "", exchange: "" };

    constructor(data){
        if(!data) return;

        this.data.priority = data.priority;
        this.data.exchange = data.exchange;
    }

    decode = function(consumer){

        this.data.priority = consumer.short();
        this.data.exchange = consumer.name();

        return this.data;
    }

    encode = function(){

        let _priority = Encoder.short(this.data.priority);
        let _exchange = Encoder.name(this.data.exchange);

        return Buffer.concat([_priority, _exchange]);

    }

}

module.exports = MXRecord;