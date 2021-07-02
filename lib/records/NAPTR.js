var Utilities = require("../Utilities");
var Encoder = require("../Encoder");

class NAPTRRecord {

    data = { order: "", priority: "", flags: "", service: "", regex: "", replacement: "" };

    constructor(data){
        if(!data) return;

        this.data.order = data.order;
        this.data.priority = data.priority;
        this.data.flags = data.flags;
        this.data.service = data.service;
        this.data.regex = data.regex;
        this.data.replacement = data.replacement;

        if(this.data.regex != "" && this.data.replacement != ""){
            this.data.regex = "";
        }

    }

    decode = function(consumer){

        this.data.order = consumer.short();
        this.data.priority = consumer.short();
        let flagsLength = consumer.byte();
        this.data.flags = consumer.string("utf8", flagsLength);
        let serviceLength = consumer.byte();
        this.data.service = consumer.string("utf8", serviceLength);
        let regexLength = consumer.byte();
        this.data.regex = consumer.string("utf8", regexLength);
        this.data.replacement = consumer.name();

        return this.data;
    }

    encode = function(){

        let _order = Encoder.short(this.data.order);
        let _priority = Encoder.short(this.data.priority);
        let _flags = Encoder.string(this.data.flags).data;
        let _service = Encoder.string(this.data.service).data;

        let dSection = Buffer.from("");
        if(this.data.regex == "" && this.data.replacement != ""){
            dSection = Buffer.concat([dSection, Buffer.from("00", "hex"), Encoder.name(this.data.replacement)])
        }

        if(this.data.regex != "" && this.data.replacement == ""){
            dSection = Buffer.concat([dSection, Encoder.string(this.data.regex).data, Buffer.from("00", "hex")])
        }

        return Buffer.concat([_order, _priority, _flags, _service, dSection]);

    }

}

module.exports = NAPTRRecord;