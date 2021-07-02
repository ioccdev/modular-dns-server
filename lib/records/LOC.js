const Utilities = require("../Utilities");

class LOCRecord {

    LOC_EQUATOR = Math.pow(2, 31);
    LOC_PRIMERIDIAN = Math.pow(2, 31);
    LOC_HOURS = 60 * 1000;
    LOC_DEGREES = 60 * this.LOC_HOURS;
    LOC_ALTITUDEBADE = 100000;

    decode = function(consumer){

        let version = consumer.byte();

        let size = Utilities.buffer2Hex(consumer.slice(1));
        let sizeBase = Utilities.hex2Dec(size[0]);
        let sizeExponent = Utilities.hex2Dec(size[1]);

        let horizontalPrecision = Utilities.buffer2Hex(consumer.slice(1));
        let horizontalPrecisionBase = Utilities.hex2Dec(horizontalPrecision[0]);
        let horizontalPrecisionExponent = Utilities.hex2Dec(horizontalPrecision[1]);

        let verticalPrecision = Utilities.buffer2Hex(consumer.slice(1));
        let verticalPrecisionBase = Utilities.hex2Dec(verticalPrecision[0]);
        let verticalPrecisionExponent = Utilities.hex2Dec(verticalPrecision[1]);


        let latitude = consumer.long();
        let longitude = consumer.long();
        let altitude = consumer.long();

        //calculate altitude
        //received in cm + 10.000.000 cm (100.000m under sea level)
        altitude -= 10000000;

        //calculate precision in cm
        verticalPrecision = verticalPrecisionBase * Math.pow(10, verticalPrecisionExponent)
        horizontalPrecision = horizontalPrecisionBase * Math.pow(10, horizontalPrecisionExponent)

        //size in cm
        size = sizeBase * Math.pow(10, sizeExponent);

        //calc latitude
        let northOrSouth = "N";
        if(latitude > this.LOC_EQUATOR){
            latitude = latitude - this.LOC_EQUATOR;
        } else {
            northOrSouth = "S";
            latitude = this.LOC_EQUATOR - latitude;
        }

        let latitudeDeg = Math.floor(latitude / this.LOC_DEGREES);
        latitude = latitude % this.LOC_DEGREES;
        let latitudeMinutes = Math.floor(latitude / this.LOC_HOURS);
        latitude = latitude % this.LOC_HOURS;

        latitude = latitudeDeg + "° " + latitudeMinutes + "' " + parseFloat(latitude) / 1000 + "'' " + northOrSouth;

        //calc longitude
        let eastOrWest = "E";
        if(longitude > this.LOC_PRIMERIDIAN){
            longitude = longitude - this.LOC_PRIMERIDIAN;
        } else {
            eastOrWest = "W";
            longitude = this.LOC_PRIMERIDIAN - longitude;
        }

        let longitudeDeg = Math.floor(longitude / this.LOC_DEGREES);
        longitude = longitude % this.LOC_DEGREES;
        let longitudeMinutes = Math.floor(longitude / this.LOC_HOURS);
        longitude = longitude % this.LOC_HOURS;

        longitude = longitudeDeg + "° " + longitudeMinutes + "' " + parseFloat(longitude) / 1000 + "'' " + eastOrWest;

        return { version: version, size: size, horizontalPrecision: horizontalPrecision, verticalPrecision: verticalPrecision, latitude: latitude, longitude: longitude, altitude: altitude };
    }

}

module.exports = LOCRecord;