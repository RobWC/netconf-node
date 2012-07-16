var NetconfSession = require('./netconf-session.js').NetconfSession;


var ncSess = new NetconfSession('root','testpass','10.0.1.2');
ncSess.newSession();

ncSess.on('newSession', function(data) {
  console.log(data);
  ncSess.getSoftwareInformation();
});

ncSess.on('results', function(data) {
  console.log(JSON.stringify(data));
});