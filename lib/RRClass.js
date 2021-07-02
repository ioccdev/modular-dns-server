var Error = require("./Error");
var Utilities = require("./Utilities");

module.exports = {
    classes: {
        "INTERNET": 1,
        "CSNET": 2,
        "CHAOS": 3,
        "HESIOD": 4,
        "NONE": 254,
        "ALL": 255,
    },
    number2String: function(number, isHex){

        if(!isHex){ var isHex = false; }


        if(isHex){
            number = Utilities.hex2Dec(number);
        }

        let changed = false;
        let output = "ERROR";

        for(let key in this.classes){
            if(this.classes[key] == number){
                output = key;
                changed = true;
            }
        }

        if(changed === false){
            new Error("B-001");
        }

        return output;

    },

    string2Number: function(string){

        let changed = false;
        let output = "ERROR";

        if(this.classes[string]){
            output = this.classes[string];
            changed = true;
        }

        if(changed === false){
            new Error("B-002");
        }

        return output;

    }
}