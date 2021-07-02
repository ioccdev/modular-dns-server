var util = require("util");

var POINTER = 0xc0;

function StreamRunner(arg){
  if(!(arg instanceof Buffer)){
    throw new Error("Expected instance of Buffer");
  }

  this.buffer = arg;
  this.length = this.buffer.length;
  this._offset = 12;
};

StreamRunner.prototype.tell = function(){
  return this._offset;
};


StreamRunner.prototype.seek = function(pos){
  if(pos < 0){
    throw new Error("Negative pos not allowed");
  }
  if(pos > this.length){
    throw new Error(util.format("Cannot seek after EOF. %d > %d", pos, this.length));
  }
  this._offset = pos;
  return this;
};

StreamRunner.prototype.slice = function(length){
  var v;
  if(typeof length === "undefined"){
    v = this.buffer.slice(this._offset);
    this._offset = this.length - 1;
    return v;
  } else {
    if((this._offset + length) > this.length){
      throw new Error("Buffer overflow");
    }
    v = this.buffer.slice(this._offset, this._offset + length);
    this._offset += length;
    return v;
  }
};

StreamRunner.prototype.isEOF = function(){
  return this._offset >= this.length;
};

StreamRunner.prototype.byte = function(){
  this._offset += 1;
  return this.buffer.readUInt8(this._offset - 1);
};

StreamRunner.prototype.short = function(){
  this._offset += 2;
  return this.buffer.readUInt16BE(this._offset - 2);
};

StreamRunner.prototype.long = function(){
  this._offset += 4;
  return this.buffer.readUInt32BE(this._offset - 4);
};

StreamRunner.prototype.string = function(encoding, length){
  var end;
  var ret;

  if(length === undefined){
    end = this.buffer.length;
  } else {
    end = this.tell() + length;
  }

  if(!encoding){
    encoding = "utf8";
  }
  ret = this.buffer.toString(encoding, this._offset, end);
  this.seek(end);
  return ret;
};

StreamRunner.prototype.name = function(join, endAt){
  if (typeof join === "undefined"){ join = true; }
  var parts = [];
  var ret;
  var len;
  var pos;
  var end;
  var comp = false;
  len = this.byte();
  if(len === 0){
    parts.push("");
  }
  while(len !== 0){
    if((len & POINTER) === POINTER){
      len -= POINTER;
      len = len << 8;
      pos = len + this.byte();
      if(!comp){
        end = this.tell();
      }
      this.seek(pos);
      len = this.byte();
      comp = true;
      continue;
    }
    var v = this.string("utf8", len);
    if(v.length > 0){
      parts.push(v);
    }

    if(endAt && this.tell() >= endAt){
      break;
    }
    len = this.byte();
  }
  if(!comp){
    end = this.tell();
  }
  this.seek(end);
  if(join){
    ret = parts.join(".");
  } else {
    ret = parts;
  }
  return ret;
}

module.exports = StreamRunner;