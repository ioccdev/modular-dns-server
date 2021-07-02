var Utilities = require("./Utilities");
var RRClass = require("./RRClass");
var RRTypes = require("./RRTypes");
var Error = require("./Error");
var DNSQuestion = require("./DNSQuestion");
var DNSAnswer = require("./DNSAnswer");
var StreamRunner = require("./StreamRunner");
var fs = require("fs");

var Record = require("./record");


function splitBody(hexStream, qdcount, ancount, nscount, arcount){


        let ofStream = hexStream;
    
        let output = {
            qd: [],
            an: [],
            ns: [],
            ar: []
        };
    
        let h = Buffer.from(hexStream, "hex");
        let consumer = new StreamRunner(h);


        //repeat for each question
        for(let i = 0; i < qdcount; i++){


            let qn = consumer.name();
            let type = consumer.short();
            let _class = consumer.short();

            let _tmpQuestion = new DNSQuestion();
            _tmpQuestion.setName(qn);

            if(RRTypes.number2String(type, false) == "ERROR"){
                fs.appendFileSync("typeErrors.log", qn + "\t" + type + "\t" + _class + "\r\n");
                type = 1;

            }


            //check for redir types
            
            _tmpQuestion.setTypeByDec(type);
            _tmpQuestion.setClassByDec(_class);
            output.qd.push(_tmpQuestion);

        }
        
        //consumer.seek(0);

        //repeat for each an
        for(let i = 0; i < ancount; i++){
            output.an.push(create());
        }

        //repeat for each ns
        for(let i = 0; i < nscount; i++){
            output.ns.push(create());
        }

        //repeat for each ar
        for(let i = 0; i < arcount; i++){
            output.ar.push(create());
        }

        return output;
    
    

    function create(){
        let _tmpAnswer = {};
        _tmpAnswer.name = consumer.name();
        _tmpAnswer.type = RRTypes.number2String(consumer.short(), false);

        //check if OPT
        if(_tmpAnswer.type !== "OPT"){
            _tmpAnswer.class = RRClass.number2String(consumer.short(), false);
            _tmpAnswer.ttl = consumer.long();
            _tmpAnswer.size = consumer.short();
        }

        _tmpAnswer.data = new Record[_tmpAnswer.type]().decode(consumer, _tmpAnswer.size);

        return new DNSAnswer(_tmpAnswer.name, _tmpAnswer.class, _tmpAnswer.ttl, new Record[_tmpAnswer.type](_tmpAnswer.data));
    }

    
}

    
module.exports = splitBody;