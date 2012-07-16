/**
 * Netconf Command Generator
 *
 * This modules is used to generate XML-RPC commands into strings. Today this is
 * done by simply returning a string. It could be expanded in the future to
 * return variations such as adding terse or extensive options.
 *
 */

/**
 * Send Hello
 *
 * Sends a hello message to the Netconf server
 *
 * CLI Command:
 *  - None
 *
 * Platforms:
 * SRXSME, SRXDC
 *
 * @return {String} returns hello RPC
 */
exports.sendHello = function() {
  var rpc = '<hello><capabilities><capability>urn:ietf:params:xml:ns:netconf:base:1.0</capability><capability>urn:ietf:params:xml:ns:netconf:candidate:1.0</capability><capability>urn:ietf:params:xml:ns:netconf:confirmed-commit:1.0</capability><capability>urn:ietf:params:xml:ns:netconf:validate:1.0</capability><capability>urn:ietf:params:xml:ns:netconf:url:1.0?protocol=http,ftp,file</capability><capability>http://xml.juniper.net/netconf/junos/1.0</capability></capabilities></hello>]]>]]>';
  return rpc;
};

/**
 * Close Session
 *
 * Sends a message to close the session
 *
 * CLI Command:
 *  - None
 *
 * Platforms:
 * SRXSME, SRXDC
 *  
 * @return {String} returns close RPC
 */
exports.closeSession = function() {
  var rpc = '<rpc><close-session/></rpc>]]>]]>';
  return rpc;
};

/**
 * Get Software Information
 *
 * Sends a message to gather software version data
 *
 * CLI Command:
 *  - >show version
 *
 * Platforms:
 * SRXSME, SRXDC
 *  
 * @return {String} returns software version RPC
 */
exports.getSoftwareInformation = function() {
  var rpc = '<rpc><get-software-information></get-software-information></rpc>]]>]]>';
  return rpc;
};

/**
 * Get Firewall Policies
 *
 * Sends a message to gather firewall policies
 *
 * CLI Command:
 *  - >show version
 *
 * Platforms:
 * SRXSME, SRXDC
 *  
 * @return {String} returns close RPC
 */
exports.getPolicy = function() {
  var rpc = '<rpc><get-firewall-policies></get-firewall-policies></rpc>]]>]]>';
  return rpc;
};

/**
 * Get Chassis Forwarding Information
 *
 * Sends a message to gather fwdd status
 *
 * CLI Command:
 *  - >show chassis forwarding
 *
 * Platforms:
 * SRXSME
 *  
 * @return {String} returns fwdd status RPC
 */
exports.getFwddInformation = function() {
  var rpc = '<rpc><get-fwdd-information></get-fwdd-information></rpc>]]>]]>';
  return rpc;
};

/**
 * Get Software Information
 *
 * Sends a message to gather information on the route engine
 *
 * CLI Command:
 *  - >show chassis route-engine
 *
 * Platforms:
 * SRXSME, SRXDC
 *  
 * @return {String} returns route engine RPC
 */
exports.getRouteEngineInformation = function() {
  var rpc = '<rpc><get-route-engine-information></get-route-engine-information></rpc>]]>]]>';
  return rpc;
};

/**
 * Get Authorization Information
 *
 * Sends a message to gather users permissions
 *
 * CLI Command:
 *  - >show cli authorization
 *
 * Platforms:
 * SRXSME, SRXDC
 * @return {String} returns authorization RPC
 */
exports.getAuthorizationInformation = function() {
  var rpc = '<rpc><get-authorization-information></get-authorization-information></rpc>]]>]]>';
  return rpc;
};


/**
 * Get Chassis Inventory
 *
 * Sends a message to display the hardware in the chassis
 *
 * CLI Command:
 *  - >show chassis hardware
 *  
 * @return {String} returns get chassis inventory RPC
 */
exports.getChassisInventory = function() {
  var rpc = '<rpc><get-chassis-inventory></get-chassis-inventory></rpc>]]>]]>';
  return rpc;
};

/**
 * Get Flow Session Information
 *
 * Sends a message to display the current flow sessions
 *
 * CLI Command:
 *  - >show security flow session
 *  
 * @return {String} returns get flow session RPC
 */
exports.getFlowSessionInformation = function() {
  var rpc = '<rpc><get-flow-session-information></get-flow-session-information></rpc>]]>]]>';
  return rpc;
};