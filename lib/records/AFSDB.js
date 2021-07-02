var Utilities = require("../Utilities");
var Encoder = require("../Encoder");


var Utilities = require("../Utilities");
class AFSDBRecord {

    data = { subtype: "", hostname: "" };

    constructor(data){
        if(!data) return;

        this.data.subtype = data.subtype;
        this.data.hostname = data.hostname;

    }

    decode = function(consumer, dataSize){

        this.data.subtype = consumer.short();
        this.data.hostname = consumer.name();

        return this.data;
    }

    encode = function(){

        let _subtype = Encoder.short(this.data.subtype);
        let _hostname = Encoder.name(this.data.hostname);

        return Buffer.concat([_subtype, _hostname]);

    }

}

module.exports = AFSDBRecord;