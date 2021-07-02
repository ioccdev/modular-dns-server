var Error = require("./Error");
var Utilities = require("./Utilities");

module.exports = {
    types: {
        "A": 1,
        "AAAA": 28,
        "HINFO": 13,
        "SRV": 33,
        "SOA": 6,
        "CNAME": 5,
        "NS": 2,
        "MX": 15,
        "TXT": 16,
        "PTR": 12,
        "NAPTR": 35,
        "ANY": 255,
        "LOC": 29,
        "MINFO": 14,
        "ISDN": 20,
        "MG": 8,
        "OPT": 41,
        "MB": 7,
        "RP": 17,
        "MR": 9,
        "RT": 21,
        "GPOS": 27,
        "CAA": 257,
        "AFSDB": 18,
        "DNAME": 39,
        "X25": 19,
        "CERT": 37,
    },
    number2String: function(number, isHex){

        if(!isHex){ var isHex = false; }


        if(isHex){
            number = Utilities.hex2Dec(number);
        }

        let changed = false;
        let output = "ERROR";

        for(let key in this.types){
            if(this.types[key] == number){
                output = key;
                changed = true;
            }
        }

        if(changed === false){
            //console.log("E: " + number);
            //new Error("C-001");
        }

        return output;

    },

    string2Number: function(string){

        let changed = false;
        let output = "ERROR";

        if(this.types[string]){
            output = this.types[string];
            changed = true;
        }

        if(changed === false){
            //new Error("C-002");
        }

        return output;

    }
}