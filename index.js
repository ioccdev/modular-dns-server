var DNSAnswer = require("./lib/DNSAnswer");
var DNSPacket = require("./lib/DNSPacket");
var RR = require("./lib/record");
var utils = require("./lib/Utilities");
var answerRequest = require("./lib/AnswerRequest");
var fs = require("fs");
var path = require("path");

var net = require("net");
var dgram = require("dgram");


var express = require("express");
const blacklist = require("./db/blacklist");
var app = express();
var router = express.Router();

//listen udp
var udp_server = dgram.createSocket("udp4");
udp_server.bind(53, "0.0.0.0");

udp_server.on("message", async function(msg, remote){

	let incomingPacket = new DNSPacket();
	incomingPacket.fromHexStream(msg.toString("hex"));

	//get answer
	let outgoingPacket = await answerRequest(incomingPacket, "udp");

	//send answer
	udp_server.send(outgoingPacket, remote.port, remote.address);
	
});


//tcp server
var tcp_server = new net.Server();
tcp_server.listen(53, "0.0.0.0");

tcp_server.on("connection", async function(socket){

	//data
	let data = await utils.parseTCPStream(socket);

	let incomingPacket = new DNSPacket();
	incomingPacket.fromHexStream(data.toString("hex"));


	//get answer
	let outgoingPacket = await answerRequest(incomingPacket, "tcp");

	let outgoingLength = Buffer.alloc(2);
	outgoingLength.writeUInt16BE(outgoingPacket.length);

	//send answer
	socket.write(Buffer.concat([outgoingLength, outgoingPacket]));


	socket.on("error", ()=>{});

});





//http stuff


router.use("/lib", express.static("var/www/lib"));

//web interface
router.get("/webui", function(req, res){
	res.sendFile(path.join(__dirname, "./var/www/index.html"));
});

router.get("/rest/status/:domain", async function(req, res){

	let db = await blacklist.findOne({ domain: req.params.domain });

	let output = { status: "not blocked" };

	if(db !== null){
		output.status = "blocked";
	}

	res.send(output);

});

router.get("/rest/add/:domain", async function(req, res){

	let db = await blacklist.findOneAndUpdate({ domain: req.params.domain },  { domain: req.params.domain }, { upsert: true});

	let output = { status: "added to blocklist" };


	res.send(output);

});

router.get("/rest/remove/:domain", async function(req, res){

	let db = await blacklist.remove({ domain: req.params.domain });

	let output = { status: "removed from blocklist" };


	res.send(output);

});

router.get("*", function(req, res){

	res.send("blocked");

});

app.use(router);

app.listen(80, function(){

});