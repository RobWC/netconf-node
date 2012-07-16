//commands module
var netconfCmd = require('./netconf-commands.js');
var commandHand = require('./command-handlers.js');
var SSHSession = require('./model-obj.js').SSHSession;
var mw = require('./jweb-middleware.js');
var ncParser = require('./netconf-parser.js');
var spawn = require('child_process').spawn;
var express = require('express');
var app = require('express').createServer();

//ssh stuff
var srxLogin = 'root@10.0.1.2'
var sshSessions = new Array(); // objects stored in here look like this junossessionid { session: 'sshChild', data2process: 'string'}

app.configure(function() {
  app.use(express.cookieParser());
  app.use(express.bodyParser());
  app.use(express.session({
    secret: "the pants are undefeated",
    cookie: {
      path: '/',
      httpOnly: true,
      maxAge: 600000
    }
  }));
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.set('view options', {
    layout: false
  });
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function() {
  app.use(express.errorHandler({
    dumpExceptions: true,
    showStack: true
  }));
});

app.configure('production', function() {
  app.use(express.errorHandler());
});

//handle errors
app.get('/', mw.loginNeeded, function(req, res) {
  //check if logged in already
  res.render('login', {
    title: 'Login'
  });
});

app.get('/portal', mw.requiresLogin, function(req, res) {
  res.render('portal', {
    title: 'Home Portal'
  });
});

app.post('/login', function(req, res) {
  var ssh = spawn('ssh', [srxLogin, '-s', 'netconf']); //spawn on connect
  var data2process = '';
  var callback = function(data) {
    if (data.toString().match(/\]\]>\]\]>/g)) {
      data2process = data2process + data.toString();
      var dataStr = data2process;
      data2process = '';
      var parsedJson = ncParser.netconf2obj(dataStr);
      if ( !! parsedJson.hello.sessionid) {
        req.session.junosid = parsedJson.hello.sessionid;
        sshSessions[parsedJson.hello.sessionid] = new SSHSession(req.session.junosid,ssh,'');
      };
      res.header('Content-Type', 'application/json');
      res.send({
        "success": true,
        "msg": "Login Success",
        "next": "/portal"
      });
      ssh.stdout.removeListener('data', callback);
    } else {
      data2process = data2process + data.toString();
    };
  };

  ssh.stdout.on('data', callback);

  ssh.stderr.on('data', function(data) {
    console.log('XXXXX stderr: ' + data + ' XXXX');
  });

  ssh.on('exit', function(code) {
    console.log('child process exited with code ' + code);
  });

  ssh.stdin.write(netconfCmd.sendHello());

});

app.get('/op/get-firewall-policies', mw.requiresLogin, function(req, res) {
  var options = {
    req: req,
    res: res,
    sshSessions: sshSessions,
    command: netconfCmd.getPolicy()
  };
  commandHand.sendCommand(options);
});

app.get('/op/get-route-engine-information', mw.requiresLogin, function(req, res) {
  //run command against SSH
    var options = {
    req: req,
    res: res,
    sshSessions: sshSessions,
    command: netconfCmd.getRouteEngineInformation()
  };
  commandHand.sendCommand(options);
});

app.get('/op/get-software-information', mw.requiresLogin, function(req, res) {
  //run command against SSH
    var options = {
    req: req,
    res: res,
    sshSessions: sshSessions,
    command: netconfCmd.getSoftwareInformation()
  };
  commandHand.sendCommand(options);
});

app.listen(3000);
console.log('I\'m listening on port 3000 and my pid is ' + process.pid);
