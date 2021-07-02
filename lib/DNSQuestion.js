var Utilities = require("./Utilities");
var RRClass = require("./RRClass");
var RRTypes = require("./RRTypes");
var Error = require("./Error");


class DNSQuestion {

    class = "";
    type = "";
    name = "";

    constructor(name, type, _class){
        this.name = name;
        this.type = type;
        this.class = _class;
    }


    setClassByString = function(_class){
        this.class = RRClass.number2String(_class);
    }

    setClassByDec = function(_class){
        this.class = RRClass.number2String(_class, false);
    }

    setClassByHex = function(_class){
        this.class = RRClass.number2String(_class, true);
    }


    setTypeByString = function(_type){
        this.type = RRTypes.number2String(_type);
    }

    setTypeByDec = function(_type){
        this.type = RRTypes.number2String(_type, false);
    }

    setTypeByHex = function(_type){
        this.type = RRTypes.number2String(_type, true);
    }

    setQName = function(_qname){
        this.name = Utilities.qnameToDomain(_qname);
    }

    setName = function(_name){
        this.name = _name;
    }
    

}

module.exports = DNSQuestion;