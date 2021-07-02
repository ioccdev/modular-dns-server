var net = require("net");
var fs = require("fs");
var moment = require("moment");
const DNSPacket = require("./DNSPacket");
const DNSQuestion = require("./DNSQuestion");
const DNSAnswer = require("./DNSAnswer");
var RR = require("./record");
var DNSModel = require("../db/model");
var DNSCache = require("../db/cache");
var Blacklist = require("../db/blacklist");
var domainParser = require("parse-domain").parseDomain;
var ip = require("public-ip").v4;
var rootServer = require("./root");

let stats = {
	total: 0,
	blocked: 0
}


module.exports = async function(incoming, type){

	let outgoing = Object.assign(Object.create(Object.getPrototypeOf(incoming)), incoming)



	let questions = outgoing.packet.Questions;

	for(let i = 0; i < questions.length; i++){

		let question = questions[i];

		let qn = question.name.toLowerCase();
		let qt = question.type;
		let qc = question.class;

		console.log(qn, qt);
		await DNSModel.findOneAndUpdate({ domain: qn }, { domain: qn }, { upsert: true });

		//check if domain is on blacklist
		let isBlacklisted = await checkBlacklist(qn);

		if(isBlacklisted){

			//outgoing.packet.AnswerRR = [new DNSAnswer(qn, "INTERNET", 3600, new RR.A("127.0.0.1"))]

			stats.blocked++;

		} else {

			let cached = await DNSCache.findOne({ domain: qn, type: qt });
			
			if(cached == null){			

				let rawProxyPacket = await resolve(qn, qt);

				//message.packet.Header.flags.qr = 1;
				let ProxyAnswers = parseProxyPacket(rawProxyPacket);
		
				//outgoing.packet.AnswerRR = [new DNSAnswer("google.de", "INTERNET", 100, new RR.A("1.2.3.4"))]
				
				outgoing.packet.AnswerRR = outgoing.packet.AnswerRR.concat(ProxyAnswers.answerRR);
				outgoing.packet.AuthRR = outgoing.packet.AuthRR.concat(ProxyAnswers.authRR);
				outgoing.packet.AddRR = outgoing.packet.AddRR.concat(ProxyAnswers.addRR);

				let cacheForNextRequests = {
					date: moment(),
					domain: qn,
					type: qt,
					data: {
						AnswerRR: outgoing.packet.AnswerRR,
						AuthRR: outgoing.packet.AuthRR,
						AddRR: outgoing.packet.AddRR,
					}
				}

				await DNSCache.create(cacheForNextRequests);

			} else {

				let answerRR = cache2Packets(cached.data.AnswerRR);
				let authRR = cache2Packets(cached.data.AuthRR);
				let addRR = cache2Packets(cached.data.AddARR);

		
				outgoing.packet.AnswerRR = answerRR;
				outgoing.packet.AuthRR = authRR;
				outgoing.packet.AddRR = addRR;

			}

			
	

		}

		stats.total++;
		outgoing.fixCount();

	 
	}

	//force tcp
	if(type == "udp"){


		if(outgoing.encode().length > 550)
			outgoing.setTruncated();


	}

	return outgoing.encode();


}


//27.06.2021 01:54
let _stats = require("../db/stats");


setInterval(async function(){

	let total = stats.total;
	let blocked = stats.blocked;

	stats.total -= total;
	stats.blocked -= blocked;

	let _d = await _stats.findOne({});
	_d.total += total;
	_d.blocked += blocked;

	await _d.save();

}, 1000);

function resolve(name, type){
	let packet = new DNSPacket();
	let question = new DNSQuestion(name, type, "INTERNET");
	packet.addQuestion(question);

	return lookup(packet.encode());
}

function parseProxyPacket(stream){

	let packet = new DNSPacket();
	packet.fromHexStream(stream.slice(2).toString("hex"));

	let output = {
		answerRR: packet.packet.AnswerRR,
		authRR: packet.packet.AuthRR,
		addRR: packet.packet.AddRR
	}

	return output;
}


function lookup(buffer){

	return new Promise(async function(resolve, reject){
		let client = net.connect(53, rootServer);
		const len = Buffer.alloc(2);
		len.writeUInt16BE(buffer.length);
	
		client.end(Buffer.concat([ len, buffer ]));
		
		
		let chunks = [];
		let chunklen = 0;
		let received = false;
		let expected = false;
		
		client.on("readable", function(){
			let chunk;
			while((chunk = client.read()) !== null){
			  chunks.push(chunk);
			  chunklen += chunk.length;
			}

			if(!expected && chunklen >= 2){
			  if(chunks.length > 1){
				chunks = [Buffer.concat(chunks, chunklen)];
			  }

			  expected = chunks[0].readUInt16BE(0);
			}
	  
			if(chunklen >= 2 + expected){
				resolve(chunks[0]);
			}
		  });

		  client.on("end", function(){
			  resolve(chunks[0]);
		  });
	});
}



async function checkBlacklist(qn){

	let blocked = false;

	let checkIfBlocked = await Blacklist.findOne({ domain: qn });

	if(checkIfBlocked != null){
		blocked = true;
	}

	return blocked;
}




function cache2Packets(raw){

	if(!raw) raw = [];

	let packets = [];

	for(let i = 0; i < raw.length; i++){
		packets.push(new DNSAnswer(raw[i].name, raw[i].class, raw[i].ttl, new RR[raw[i].type](raw[i].data)))
	}

	return packets;
}