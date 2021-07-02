var Utilities = require("../Utilities");
var Encoder = require("../Encoder");

class HINFORecord {

    data = { cpu: "", os: "" };

    constructor(data){
        if(!data) return;

        this.data.cpu = data.cpu;
        this.data.os = data.os;
    }

    decode = function(consumer){

        let cpuLength = consumer.byte();
        let cpu = consumer.string("utf8", cpuLength);
        let osLength = consumer.byte();
        let os = consumer.string("utf8", osLength);

        this.data.cpu = cpu;
        this.data.os = os;


        return this.data;
    }

    encode = function(){

        let os = Encoder.string(this.data.os).data;
        let cpu = Encoder.string(this.data.cpu).data;

        return Buffer.concat([cpu, os]);

    }

}

module.exports = HINFORecord;