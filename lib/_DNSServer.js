var dns = require("dns");
var dgram = require("dgram");
var server = dgram.createSocket("udp4");

var DNSPacket = require("./DNSPacket");
var DNSQuestion = require("./DNSQuestion");


class DNSServer {



    answer = function(msg, remote){
        server.send(msg.encode(), remote.port, remote.address);
    }

    resolveData = function(name, type){

        let packet = new DNSPacket();
        let question = new DNSQuestion(name, type, "INTERNET");
        packet.addQuestion(question);

        return lookup(packet.encode());

    }
    
    parseProxyPacket = function(stream){

        let packet = new DNSPacket();
        packet.fromHexStream(stream.slice(2).toString("hex"));


        //console.log(packet);

        let output = {
            answerRR: packet.packet.AnswerRR,
            authRR: packet.packet.AuthRR,
            addRR: packet.packet.AddRR
        }

        return output;
    }

}


function lookup(buffer){

    var net = require("net");



    return new Promise(async (resolve, reject) => {
        let client = net.connect(53, "9.9.9.9");
        const len = Buffer.alloc(2);
        len.writeUInt16BE(buffer.length);
    
        client.end(Buffer.concat([ len, buffer ]));
        
        
        let chunks = [];
        let chunklen = 0;
        let received = false;
        let expected = false;
        client.on('readable', () => {
            let chunk;
            while ((chunk = client.read()) !== null) {
              chunks.push(chunk);
              chunklen += chunk.length;
            }
            if (!expected && chunklen >= 2) {
              if (chunks.length > 1) {
                chunks = [ Buffer.concat(chunks, chunklen) ];
              }
              expected = chunks[0].readUInt16BE(0);
            }
      
            if (chunklen >= 2 + expected) {
                console.log(chunks);
                resolve(chunks[0]);
            }
          });

          client.on('end', function(){
              console.log(chunks);
              resolve(chunks[0]);
          });

        
        //const data = await pp(client);
        //resolve(data)
        //console.log(data);
    });
}


function lookupOld(buffer){

    let client = new dgram.Socket("udp4");

    return new Promise((resolve, reject) => {
        client.once("message", function onMessage(message){
    
            client.close();
            resolve(message);
        });
        client.send(buffer, 53, "8.8.8.8", err => err && reject(err));
    });
}


module.exports = DNSServer;

 async function pp(socket) {
    let chunks = [];
    let chunklen = 0;
    let received = false;
    let expected = false;
    return new Promise((resolve, reject) => {
      const processMessage = () => {
          //console.log(chunks, chunklen, received, expected);
        if (received) return;
        received = true;
        const buffer = Buffer.concat(chunks, chunklen);
        resolve(buffer.slice(2));
      };
      socket.on('end', processMessage);
      socket.on('error', reject);
      socket.on('readable', () => {
        let chunk;
        while ((chunk = socket.read()) !== null) {
          chunks.push(chunk);
          chunklen += chunk.length;
        }
        if (!expected && chunklen >= 2) {
          if (chunks.length > 1) {
            chunks = [ Buffer.concat(chunks, chunklen) ];
          }
          expected = chunks[0].readUInt16BE(0);
        }
  
        if (chunklen >= 2 + expected) {
          processMessage();
        }
      });
    });
  };