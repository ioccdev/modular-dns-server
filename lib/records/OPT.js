var Utilities = require("../Utilities");
var Encoder = require("../Encoder");

class OPTRecord {

    data = {
        udpPayloadSize: "",
        higherBitsInRCODE: "",
        version: "",
        z: "",
        dataLength: "",
        data: ""
    };

    constructor(data){
        if(!data) return;

        this.data.udpPayloadSize = data.udpPayloadSize;
        this.data.higherBitsInRCODE = data.higherBitsInRCODE;
        this.data.version = data.version;
        this.data.z = data.z;
        this.data.dataLength = data.dataLength;
        this.data.data = data.data;
    }

    decode = function(consumer){
        this.data.udpPayloadSize = consumer.short();
        this.data.higherBitsInRCODE = consumer.byte();
        this.data.version = consumer.byte();
        this.data.z = consumer.short();
        this.data.dataLength = consumer.short();
        this.data.data = consumer.slice(this.data.length).toString("hex");
        return this.data;
   
    }

    encode = function(){

        let _udp = Encoder.short(this.data.udpPayloadSize);
        let _hbr = Encoder.byte(this.data.higherBitsInRCODE);
        let _ver = Encoder.byte(this.data.version);
        let _z = Encoder.short(this.data.z);
        let _dl = Encoder.short(this.data.dataLength);
        let _d = Encoder.raw(this.data.data);

        return Buffer.concat([_udp, _hbr, _ver, _z, _dl, _d]);
    }

}

module.exports = OPTRecord;