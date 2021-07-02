var Utilities = require("./Utilities");

module.exports = {
    byte: function(data){

        //convert number to hex
        let number2Hex = Utilities.dec2Hex(data);

        //pad to 4hex (2byte)
        let paddedHex = number2Hex.padStart(2, 0);

        //return buffer
        return Buffer.from(paddedHex, "hex");

    },

    string: function(data){

        //convert string to buffer
        let string2HexBuffer = Buffer.from(data);

        //length
        let length = module.exports.byte(string2HexBuffer.length);

        //create tmp buffer for length
        let _a = Buffer.from(length, "hex");

        //paddedlength hex
        let padded = Buffer.concat([_a, string2HexBuffer]);

        //return buffer
        return { rawBuffer: string2HexBuffer, length: length, data: padded };

    },

    short: function(data){

        //convert number to hex
        let number2Hex = Utilities.dec2Hex(data);

        //pad to 4hex (2byte)
        let paddedHex = number2Hex.padStart(4, 0);

        //return buffer
        return Buffer.from(paddedHex, "hex");

    },

    long: function(data){

        //convert number to hex
        let number2Hex = Utilities.dec2Hex(data);

        //pad to 4hex (2byte)
        let paddedHex = number2Hex.padStart(8, 0);

        //return buffer
        return Buffer.from(paddedHex, "hex");

    },

    raw: function(data){
        return Buffer.from(data, "hex");
    },

    name: function(data){
        //return qname
        return Utilities.domainToQname(data);
    }
}