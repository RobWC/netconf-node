var parser = require('xml2json');

exports.netconf2json = function(data) {
    var jsonStr = parser.toJson(data.replace(/\]\]>\]\]>/g, '').replace(/^\s+|\s+$/g, '').replace(/(\w)[-]{1}(\w)/gi, '$1$2'));
    return jsonStr;
};

exports.netconf2obj = function(data) {
    var json = JSON.parse(parser.toJson(data.replace(/\]\]>\]\]>/g, '').replace(/^\s+|\s+$/g, '').replace(/(\w)[-]{1}(\w)/gi, '$1$2')));
    return json;
};