//----------------------------------------------------------------------------------------------------------------------
// Brief description for server.js module.
//
// @module server.js
//----------------------------------------------------------------------------------------------------------------------

var connect = require('connect');

var http = require('http');
var router = require('./server/routes');
var parser = require('./server/parser');

//----------------------------------------------------------------------------------------------------------------------

// Parse wiki pages
parser.parse();

var server = connect()
    .use(connect.logger('dev'))
    .use(connect.static('client'))
    .use(router)
    .listen(4000);

console.log('Tomb started on %s, port %s.', server.address().address, server.address().port);

//----------------------------------------------------------------------------------------------------------------------