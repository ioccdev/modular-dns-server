class DNSAnswer {

    name = "";
    type = "";
    class = "INTERNET";
    ttl = 60;
    data = "";
    rawData = "";

    constructor(name, _class, ttl, RR){
        this.name = name;
        this.class = _class;
        this.type = RR.constructor.name.replace("Record", "");
        this.ttl = ttl;
        this.rawData = RR;
        this.data = RR.data;
    }

}

module.exports = DNSAnswer;