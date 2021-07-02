var Utilities = require("../Utilities");
var Encoder = require("../Encoder");

class MGRecord {

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

        let _data = Encoder.name(this.data);

        return _data;

    }

}

module.exports = MGRecord;