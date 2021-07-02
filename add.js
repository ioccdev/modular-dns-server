var model = require("./db/blacklist");
var fs = require("fs");
var pp = require("parse-domain");

(async ()=>{

    let lines = fs.readFileSync("./data.txt", "utf8").split("\r\n");

    for(let i = 0; i < lines.length; i++){

        await model.findOneAndUpdate({ domain: lines[i] }, { domain: lines[i] }, { upsert: true });

        //console.log(lines[i]);

    }
    console.log("finished");

})();