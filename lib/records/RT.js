var Utilities = require("../Utilities");
var Encoder = require("../Encoder");

class RTRecord {

    data = { preference: "", intermediateHostname: "" };

    constructor(data){
        if(!data) return;

        this.data.preference = data.preference;
        this.data.intermediateHostname = data.intermediateHostname;

    }

    decode = function(consumer){

        this.data.preference = consumer.short();
        this.data.intermediateHostname = consumer.name();

        return this.data;
    }

    encode = function(){

        let _preference = Encoder.short(this.data.preference);
        let _intermediateHostname = Encoder.name(this.data.intermediateHostname);

        return Buffer.concat([_preference, _intermediateHostname]);

    }

}

module.exports = RTRecord;