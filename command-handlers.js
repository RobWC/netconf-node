var netconfCmd = require('./netconf-commands.js');
var ncParser = require('./netconf-parser.js');

exports.sendCommand = function(options) {
  //options res: req: callback:
  //grab session ID
  //grab session object
  //check to see if session is alive
  //return alive session s
  // options: { req:, res:, command:}
  var JUNOSsessID = options.req.session.junosid; // pull the existing session cookie
  var sessID = options.req.session.id;
  options.req.sessionStore.get(sessID, function(err, data) {
    if (err) {
      console.log(err); //cant grab the cookie, something bad has happened
    };
    if ( !! data) { //alright we have some sort of cookie data
      if (JUNOSsessID == data.junosid) { //hey is this 
        //check the ssh session is active somehow
        //try and send a command getAuthorizationInformation
        var sessionObj = options.sshSessions[data.junosid];
        sessionObj.session.stdin.write(netconfCmd.getAuthorizationInformation()); // alright lets test this shit
        var callback = function(data, command) {
          if (data.toString().match(/\]\]>\]\]>/g)) {
            var dataStr = sessionObj.data2process + data.toString();
            sessionObj.data2process = '';
            var parsedJson = ncParser.netconf2obj(dataStr);
            //validate that the connection worked if it did then move forward, if not throw error
            if (parsedJson.rpcreply.authorizationinformation.userinformation.user == 'root') {
              //start nested callback
              sessionObj.session.stdout.removeListener('data', callback);
              //send actual command here
              sessionObj.session.stdin.write(options.command);
              
              var commandCallback = function(data, command) {
                if (data.toString().match(/\]\]>\]\]>/g)) {
                  var dataStr = sessionObj.data2process + data.toString();
                  sessionObj.data2process = '';
                  var parsedJson = ncParser.netconf2obj(dataStr);
                  //validate that the connection worked if it did then move forward, if not throw error
                  options.res.send(parsedJson);
                  sessionObj.session.stdout.removeListener('data', commandCallback);

                } else if ( !! data) {
                  sessionObj.data2process = sessionObj.data2process + data.toString();
                } else {
                  sessionObj.data2process = sessionObj.data2process + data.toString();
                };
              };
              
              sessionObj.session.stdout.on('data', commandCallback);
            } else {
              //session is dead
              console.log('SSH session not found or is dead');
            };
          } else if ( !! data) {
            sessionObj.data2process = sessionObj.data2process + data.toString();
          } else {
            sessionObj.data2process = sessionObj.data2process + data.toString();
          };
        };

        sessionObj.session.stdout.on('data', callback);
      } else {
        return 1; //return 1 as something bad happened
      };
    } else {
      return 1; //return 1 as something bad happened
    };
    return 1; //return 1 as something bad happened
  });
};