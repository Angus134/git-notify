const logger = require('koa-log-requests');

logger.format = ':date :method :path status=:status time=:time body=:body'; // format of output 
// logger.customData = function(){ return 'something' };  //print any information that you want 

module.exports = logger;