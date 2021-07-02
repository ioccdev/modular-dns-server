var Utilities = require("../Utilities");
var Encoder = require("../Encoder");

class CERTRecord {

    data = { type: "", keyTag: "", algorithm: "", certificate: "" };

    types = {
        1: "PKIX",
        2: "SPKI",
        3: "PGP",
        4: "IPKIX",
        5: "ISPKI",
        6: "IPGP",
        7: "ACPKIX",
        8: "IACPKIX",
        253: "URI",
        254: "OID",
    }

    algorithms = {
        1: "RSA/MD5",
        2: "Diffie-Hellman",
        3: "DSA/SHA-1",
        4: "Elliptic Curve",
        5: "RSA/SHA-1",
        6: "DSA/SHA-1 NSEC3",
        7: "RSA/SHA-1 NSEC3",
        252: "Indirect",
        253: "Private",
        254: "Private",
    }

    constructor(data){
        if(!data) return;

        this.data.type = data.type;
        this.data.keyTag = data.keyTag;
        this.data.algorithm = data.algorithm;
        this.data.certificate = data.certificate;
    }


    decode = function(consumer, size){

        this.data.type = consumer.short();
        this.data.keyTag = consumer.short();
        this.data.algorithm = consumer.byte();
        this.data.certificate = consumer.string("base64", size - 5);

        if(this.types[this.data.type]){
            this.data.type = this.types[this.data.type];
        } else {
            this.data.type = "UNKNOWN";
        }

        if(this.algorithms[this.data.algorithm]){
            this.data.algorithm = this.algorithms[this.data.algorithm];
        } else {
            this.data.algorithm = "UNKNOWN";
        }

        return this.data;
    }

    encode = function(){

        let _type = Encoder.short(255);
        for(let key in this.types){
            if(this.types[key] === this.data.type){
                _type = Encoder.short(key);
            }
        }

        let _keyTag = Encoder.short(this.data.keyTag);

        let _algorithm = Encoder.byte(255);
        for(let key in this.algorithms){
            if(this.algorithms[key] === this.data.algorithm){
                _algorithm = Encoder.byte(key);
            }
        }

        let _cert = Buffer.from(this.data.certificate, "base64");

        return Buffer.concat([_type, _keyTag, _algorithm, _cert]);

    }

}

module.exports = CERTRecord;