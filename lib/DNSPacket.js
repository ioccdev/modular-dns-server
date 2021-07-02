var Utilities = require("./Utilities");
var RRClass = require("./RRClass");
var Error = require("./Error");
var DNSHeader = require("./DNSHeader");
var DNSQuestion = require("./DNSQuestion");
var DNSDecoder = require("./DNSDecoder");
var Encoder = require("./Encoder");

var RRTypes = require("./RRTypes");
const { util } = require("chai");

class DNSPacket {

    
    packet =  {
        Header: {},
        Questions: [],
        AnswerRR: [],
        AuthRR: [],
        AddRR: []
    }

    constructor(){

        this.packet.Header = new DNSHeader();

    }

    fromHexStream(hexStream){

        //seperate Header from Body
        let _header = hexStream.slice(0, 24);
        let _body = hexStream.slice(24);

        this.packet.Header = new DNSHeader();
        this.packet.Header.fromHexStream(_header);
        
        let splitted = DNSDecoder(hexStream, this.packet.Header.qdcount, this.packet.Header.ancount, this.packet.Header.nscount, this.packet.Header.arcount);

        for(let i = 0; i < splitted.qd.length; i++){
            this.packet.Questions.push(splitted.qd[i]);
        }

        for(let i = 0; i < splitted.an.length; i++){
            this.packet.AnswerRR.push(splitted.an[i]);
        }

        for(let i = 0; i < splitted.ns.length; i++){
            this.packet.AuthRR.push(splitted.ns[i]);
        }

        for(let i = 0; i < splitted.ar.length; i++){
            this.packet.AddRR.push(splitted.ar[i]);
        }

    }

    addQuestion(q){
        this.packet.Questions.push(q);
        this.packet.Header.qdcount++;
    }

    addAnswerRR(rr){
        this.packet.AnswerRR.push(rr);
        this.packet.Header.ancount++;
    }

    addAuthRR(rr){
        this.packet.AuthRR.push(rr);
        this.packet.Header.nscount++;
    }

    addAddRR(rr){
        this.packet.AddRR.push(rr);
        this.packet.Header.adcount++;
    }

    fixCount(){
        this.packet.Header.setAnswerRR(this.packet.AnswerRR.length);
        this.packet.Header.setAuthRR(this.packet.AuthRR.length);
        this.packet.Header.setAddRR(this.packet.AddRR.length);
    }

    decodeFlags(hexStreamFlags){

        let flags = {
            qr: 0,
            opcode: 0,
            aa: 0,
            tc: 0,
            rd: 0,
            ra: 0,
            z: 0,
            ad: 0,
            cd: 0,
            rcode: 0
        }

        if(hexStreamFlags.length !== 4){
            new Error("A-001");
        } else {

            let _flags = Utilities.hexStringToBinString(hexStreamFlags);
            //console.log("+"+_flags);

            flags.qr = _flags.slice(0, 1);
            flags.opcode = _flags.slice(1, 5);
            flags.aa = _flags.slice(5, 6);
            flags.tc = _flags.slice(6, 7);
            flags.rd = _flags.slice(7, 8);
            flags.ra = _flags.slice(8, 9);
            flags.z = _flags.slice(9, 10);
            flags.ad = _flags.slice(10, 11);
            flags.cd = _flags.slice(11, 12);
            flags.rcode = _flags.slice(12, 16);

            return flags;

        }

    }

    setTruncated(){
        this.packet.Header.setTruncated();
    }

    printPacket(){
        return this.packet;
    }

    encode(){

        if(this.packet.AnswerRR.length > 0 || this.packet.AuthRR.length > 0 || this.packet.AddRR.length > 0){
            this.packet.Header.flags.qr = 1;
        }

        let header = this.packet.Header.encode();
        let questions = new Buffer.from("");
        let an = new Buffer.from("");
        let ns = new Buffer.from("");
        let ad = new Buffer.from("");

        for(let i = 0; i < this.packet.Questions.length; i++){

            let _q = Utilities.domainToQname(this.packet.Questions[i].name);
            let _type = RRTypes.string2Number(this.packet.Questions[i].type);
            let _class = RRClass.string2Number(this.packet.Questions[i].class);

            _type = Encoder.short(_type);
            _class = Encoder.short(_class);

            let combined = Buffer.concat([_q, _type, _class]);

            questions = Buffer.concat([questions, combined]);

        }

        for(let i = 0; i < this.packet.AnswerRR.length; i++){
            let _q = Utilities.domainToQname(this.packet.AnswerRR[i].name);
            let _type = RRTypes.string2Number(this.packet.AnswerRR[i].type);
            let _class = RRClass.string2Number(this.packet.AnswerRR[i].class);
            let _ttl = this.packet.AnswerRR[i].ttl;

            _type = Encoder.short(_type);
            _class = Encoder.short(_class);
            _ttl = Encoder.long(_ttl);

            let _data = this.packet.AnswerRR[i].rawData.encode();
            let _dataSize = _data.length;
            _dataSize = Encoder.short(_dataSize);


            let combined = Buffer.concat([_q, _type, _class, _ttl, _dataSize, _data]);
            an = Buffer.concat([an, combined]);
        }
        return Buffer.concat([header, questions, an]);

    }
}

DNSPacket.prototype.logIncoming = function(){
    console.log(`[INCOMING] ${this.packet.Header.id} ${this.packet.Questions[0].name} ${this.packet.Questions[0].class} ${this.packet.Questions[0].type} | Questions: ${this.packet.Questions.length}`);
}

DNSPacket.prototype.logOutgoing = function(){
    console.log(`[OUTGOING] ${this.packet.Header.id} ${this.packet.Questions[0].name} | RRs: ${this.packet.AnswerRR.length} | Authority RRs: ${this.packet.AuthRR.length} | Additional RRs:${this.packet.AddRR.length}`);
}

module.exports = DNSPacket;