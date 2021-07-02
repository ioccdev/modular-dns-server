var Utilities = require("../Utilities");
var Encoder = require("../Encoder");

class ISDNRecord {

    data = { isdnAdress: "", subadress: "" };

    constructor(data){
        if(!data) return;

        this.data.isdnAdress = data.isdnAdress;
        this.data.subadress = data.subadress;

    }

    decode = function(consumer){

        let isdnAdressLength = consumer.byte();
        this.data.isdnAdress = consumer.string("utf8", isdnAdressLength);
        let subadressLength = consumer.byte();
        this.data.subadress = consumer.string("utf8", subadressLength);

        return this.data;
    }
    

    encode = function(){

        let _isdnAdress = Encoder.string(this.data.isdnAdress).data;
        let _subadress = Encoder.string(this.data.subadress).data;

        return Buffer.concat([_isdnAdress, _subadress]);

    }

}

module.exports = ISDNRecord;