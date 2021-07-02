var Utilities = require("../Utilities");
var Encoder = require("../Encoder");

class MINFORecord {

    data = { responsibleMailbox: "", errorMailbox: "" };

    constructor(data){
        if(!data) return;

        this.data.responsibleMailbox = data.responsibleMailbox;
        this.data.errorMailbox = data.errorMailbox;

    }

    decode = function(consumer){

        this.data.responsibleMailbox = consumer.name();
        this.data.errorMailbox = consumer.name();
        return this.data;
    }

    encode = function(){

        let _responsibleMailbox = Encoder.name(this.data.responsibleMailbox);
        let _errorMailbox = Encoder.name(this.data.errorMailbox);

        return Buffer.concat([_responsibleMailbox, _errorMailbox]);

    }

}

module.exports = MINFORecord;