var Utilities = require("../Utilities");
var Encoder = require("../Encoder");

class SOARecord {

    data = { primaryNS: "", hostmaster: "", serial: "", refresh: "", retry: "", expire: "", minttl: "" };

    constructor(data){
        if(!data) return;

        this.data.primaryNS = data.primaryNS;
        this.data.hostmaster = data.hostmaster;
        this.data.serial = data.serial;
        this.data.refresh = data.refresh;
        this.data.retry = data.retry;
        this.data.expire = data.expire;
        this.data.minttl = data.minttl;

    }

    decode = function(consumer){

        this.data.primaryNS = consumer.name();
        this.data.hostmaster = consumer.name();
        this.data.serial = consumer.long();
        this.data.refresh = consumer.long();
        this.data.retry = consumer.long();
        this.data.expire = consumer.long();
        this.data.minttl = consumer.long();
        return this.data;
    }

    encode = function(){

        let _prim = Encoder.name(this.data.primaryNS);
        let _hostmaster = Encoder.name(this.data.hostmaster);
        let _serial = Encoder.long(this.data.serial);
        let _refresh = Encoder.long(this.data.refresh);
        let _retry = Encoder.long(this.data.retry);
        let _expire = Encoder.long(this.data.expire);
        let _minttl = Encoder.long(this.data.minttl);

        return Buffer.concat([_prim, _hostmaster, _serial, _refresh, _retry, _expire, _minttl]);

    }

}

module.exports = SOARecord;