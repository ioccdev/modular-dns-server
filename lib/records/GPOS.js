var Utilities = require("../Utilities");
var Encoder = require("../Encoder");

class GPOSRecord {

    data = { longitude: "", latitude: "", altitude: "" };

    constructor(data){
        if(!data) return;

        this.data.longitude = data.longitude;
        this.data.latitude = data.latitude;
        this.data.altitude = data.altitude;

    }

    decode = function(consumer){

        let longitudeLength = consumer.byte();
        this.data.longitude = consumer.string("utf8", longitudeLength);

        let latitudeLength = consumer.byte();
        this.data.latitude = consumer.string("utf8", latitudeLength);

        let altitudeLength = consumer.byte();
        this.data.altitude = consumer.string("utf8", altitudeLength);

        return this.data;
    }

    encode = function(){

        let _longitude = Encoder.string(this.data.longitude).data;
        let _latitude = Encoder.string(this.data.latitude).data;
        let _altitude = Encoder.string(this.data.altitude).data;

        return Buffer.concat([_longitude, _latitude, _altitude]);

    }

}

module.exports = GPOSRecord;