//node modules
var spawn = require('child_process').spawn;
var util = require('util');
var events = require('events');
//third-party modules
var parser = require('xml2json');
//internal modules
var netconfCmd = require('./netconf-commands.js');
var commandHand = require('./command-handlers.js');
var ncParser = require('./netconf-parser.js');

//ssh stuff
var sshSessions = new Array(); // objects stored in here look like this junossessionid { session: 'sshChild', data2process: 'string'}

var NetconfSession = function(username,password,host) {
  var self = this;
  events.EventEmitter.call(this);
  
  this.username = username;
  this.password = password;
  this.host = host;
  
  this.sshSession;
  this.sshSessionID;
};

util.inherits(NetconfSession,events.EventEmitter);

exports.NetconfSession = NetconfSession;

NetconfSession.prototype.newSession = function() {
  var self = this;
  
  self.sshSession = spawn('ssh', [self.username + '@' + self.host, '-s', 'netconf']); //spawn on connect
  
  var data2process = '';
  var callback = function(data) {
    if (data.toString().match(/\]\]>\]\]>/g)) {
      data2process = data2process + data.toString();
      var dataStr = data2process;
      data2process = '';
      var parsedJson = self.netconf2obj(dataStr);
      if ( !! parsedJson.hello.sessionid) {
        self.sshSessionID = parsedJson.hello.sessionid;
      };
      self.emit('newSession',parsedJson);
       self.sshSession.stdout.removeListener('data', callback);
    } else {
      data2process = data2process + data.toString();
    };
  };

  self.sshSession.stdout.on('data', callback);

  self.sshSession.stderr.on('data', function(data) {
    console.log('Netconf Error: ' + data + ' XXXX');
  });

  self.sshSession.on('exit', function(code) {
    console.log('SSH Session Exited: ' + code);
  });

  self.sshSession.stdin.write(netconfCmd.sendHello());

};

NetconfSession.prototype.netconf2json = function(data) {
  var jsonStr = parser.toJson(data.replace(/\]\]>\]\]>/g, '').replace(/^\s+|\s+$/g, '').replace(/(\w)[-]{1}(\w)/gi, '$1$2').replace(/(\w)[:]{1}(\w)/gi, '$1_$2'));
  return jsonStr;
};

NetconfSession.prototype.netconf2obj = function(data) {
  var json = JSON.parse(parser.toJson(data.replace(/\]\]>\]\]>/g, '').replace(/^\s+|\s+$/g, '').replace(/(\w)[-]{1}(\w)/gi, '$1$2').replace(/(\w)[:]{1}(\w)/gi, '$1_$2')));
  return json;
};

NetconfSession.prototype.getSoftwareInformation = function() {
  var self = this;
  var options = {
    command: netconfCmd.getSoftwareInformation()
  };
  self._sendCommand(options);
}

NetconfSession.prototype._sendCommand = function(options) {
  var self = this;
  
  //temp storage for data
  var data2process = '';
  
  self.sshSession.stdin.write(netconfCmd.getAuthorizationInformation()); // alright lets test this shit
  var callback = function(data, command) {
    if (data.toString().match(/\]\]>\]\]>/g)) {
      var dataStr = data2process + data.toString();
      data2process = '';
      var parsedJson = self.netconf2obj(dataStr);
      //validate that the connection worked if it did then move forward, if not throw error
      if (parsedJson.rpcreply.authorizationinformation.userinformation.user == self.username) {
        //start nested callback
        self.sshSession.stdout.removeListener('data', callback);
        //send actual command here
        self.sshSession.stdin.write(options.command);
        
        var commandCallback = function(data, command) {
          if (data.toString().match(/\]\]>\]\]>/g)) {
            var dataStr = data2process + data.toString();
            data2process = '';
            var parsedJson = ncParser.netconf2obj(dataStr);
            self.emit('results',parsedJson);
            //validate that the connection worked if it did then move forward, if not throw error
            self.sshSession.stdout.removeListener('data', commandCallback);
          } else if ( !! data) {
            data2process = data2process + data.toString();
          } else {
            data2process = data2process + data.toString();
          };
        };
        
        self.sshSession.stdout.on('data', commandCallback);
      } else {
        //session is dead
        console.log('SSH session not found or is dead');
      };
    } else if (!!data) {
      data2process = data2process + data.toString();
    } else {
      data2process = data2process + data.toString();
    };
  };

  self.sshSession.stdout.on('data', callback);
};