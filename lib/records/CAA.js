var Utilities = require("../Utilities");
var Encoder = require("../Encoder");

class CAARecord {

    data = { tag: "", value: "", IssuerCritical: "" };

    constructor(data){
        if(!data) return;

        this.data.tag = data.tag;
        this.data.value = data.value;
        this.data.IssuerCritical = data.IssuerCritical;
    }

    decode = function(consumer, dataSize){

        let flags = Utilities.dec2Bin(consumer.byte());
        this.data.IssuerCritical = false;
        
        if(flags[0] === "1"){
            this.data.IssuerCritical = true;
        }
        let tagLength = consumer.byte();
        this.data.tag = consumer.string("utf8", tagLength);
        this.data.value = consumer.string("utf8", dataSize - tagLength - 2);
        

        return this.data;
    }

    encode = function(){

        let _flags = Buffer.from("00", "hex");
        if(this.data.IssuerCritical === true){
            _flags = Buffer.from("80", "hex");
        }

        let _tag = Encoder.string(this.data.tag).data;
        let _value = Encoder.string(this.data.value).rawBuffer;

        return Buffer.concat([_flags, _tag, _value]);

    }

}

module.exports = CAARecord;