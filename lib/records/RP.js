var Utilities = require("../Utilities");
var Encoder = require("../Encoder");

class RPRecord {

    data = { mailbox: "", txtRR: "" };

    constructor(data){
        if(!data) return;

        this.data.mailbox = data.mailbox;
        this.data.txtRR = data.txtRR;

    }

    decode = function(consumer){

        this.data.mailbox = consumer.name();
        this.data.txtRR = consumer.name();
        return this.data;
    }

    encode = function(){

        let _mailbox = Encoder.name(this.data.mailbox);
        let _txtRR = Encoder.name(this.data.txtRR);

        return Buffer.concat([_mailbox, _txtRR]);

    }

}

module.exports = RPRecord;