var Utilities = require("../Utilities");
var Encoder = require("../Encoder");

class SRVRecord {

    data = { priority: "", weight: "", port: "", target: "" };

    constructor(data){
        if(!data) return;

        this.data.priority = data.priority;
        this.data.weight = data.weight;
        this.data.port = data.port;
        this.data.target = data.target;

    }

    decode = function(consumer){

        this.data.priority = consumer.short();
        this.data.weight = consumer.short();
        this.data.port = consumer.short();
        this.data.target = consumer.name();
        return this.data;
    }

    encode = function(){

        let _prio = Encoder.short(this.data.priority);
        let _weight = Encoder.short(this.data.weight);
        let _port = Encoder.short(this.data.port);
        let _target = Encoder.name(this.data.target);

        return Buffer.concat([_prio, _weight, _port, _target]);

    }

}

module.exports = SRVRecord;