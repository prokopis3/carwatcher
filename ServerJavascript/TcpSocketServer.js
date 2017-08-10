'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/*
In the node.js intro tutorial (http://nodejs.org/), they show a basic tcp 
server, but for some reason omit a client connecting to it.  I added an 
example at the bottom.
Save the following server in example.js:
*/
// var sys = require('sys')
var net = require('net');

// SERVER ADRESS
var svraddr = 'localhost';
// SERVER PORT
var svrport = 8080;

var TcpSocketServer = function () {
    function TcpSocketServer() {
        _classCallCheck(this, TcpSocketServer);

        this.sockets = [];

        this.myServer();
    }

    _createClass(TcpSocketServer, [{
        key: 'myServer',
        value: function myServer() {

            this.server = require('tk102');
            // start server 
            this.server.createServer({
                ip: svraddr,
                port: svrport
            });

            // incoming data, i.e. update a map 
            this.server.on('track', function (gps) {
                //updateMap (gps.geo.latitude, gps.geo.longitude);
                console.log('GPS: ', gps);
            });

            this.server.on('data', function (raw) {
                console.log('Incoming data: ' + raw);
            });

            this.server.on('listening', function (listen) {
                // listen = { port: 56751, family: 2, address: '0.0.0.0' } 
                console.log('listening from ', listen);
            });

            this.server.on('connection', function (socket) {
                console.log('Connection from ' + socket.remoteAddress);
            });

            this.server.on('disconnect', function (socket) {
                console.log('Disconnected device ' + socket.remoteAddress);
            });

            this.server.on('timeout', function (socket) {
                console.log('Time out from ' + socket.remoteAddress);
            });
            this.server.on('fail', function (err) {
                console.log(err);
            });

            this.server.on('error', function (err) {
                console.log(err);
            });

            this.server.on('log', function (name, value) {
                console.log('Event: ' + name);
                console.log(value);
            });

            /*this.server = net.createServer(function(socket) {
                var sockets = [];
                // sys.puts('Connected: ' + socket.remoteAddress + ':' + socket.remotePort); 
             // socket.write('Hello ' + socket.remoteAddress + ':' + socket.remotePort + '\r\n');
                socket.write('check24800')
                socket.pipe(socket);
                sockets.push(socket);
            
                 socket.on('data', function(data) {  // client writes message
                    if (data == 'exit\n') {
                        // sys.puts('exit command received: ' + socket.remoteAddress + ':' + socket.remotePort + '\n');
                        socket.destroy();
                        var idx = sockets.indexOf(socket);
                        if (idx != -1) {
                            delete sockets[idx];
                        }
                        this.sockets = sockets;
                        return;
                    }
                    console.log(`Tcp IP Server side Received from Client: ${data}`)
                     var len = sockets.length;
                    for (var i = 0; i < len; i ++) { // broad cast
                        if (sockets[i] != socket) {
                            if (sockets[i]) {
                                console.log('broadcast')
                                sockets[i].write(socket.remoteAddress + ':' + socket.remotePort + ':' + data);
                            }
                        }
                    }
                    this.sockets = sockets;
                });
                 socket.on('end', function() { // client disconnects
                    // sys.puts('Disconnected: ' + data + data.remoteAddress + ':' + data.remotePort + '\n');
                    var idx = sockets.indexOf(socket);
                    if (idx != -1) {
                        delete sockets[idx];
                    }
                    this.sockets = sockets;
                });
            })
             this.server.listen(svrport, svraddr);*/
            // sys.puts('Server Created at ' + svraddr + ':' + svrport + '\n');
        }
    }, {
        key: 'myTestClient',
        value: function myTestClient() {
            /*
                And connect with a tcp client from the command line using netcat, the *nix 
                utility for reading and writing across tcp/udp network connections.  I've only 
                used it for debugging myself.
                $ netcat 127.0.0.1 1337
                You should see:
                > Echo server
                */

            /* Or use this example tcp client written in node.js.  (Originated with 
            example code from 
            http://www.hacksparrow.com/tcp-socket-programming-in-node-js.html.) */

            /*var client = new net.Socket();
            client.connect(svrport, svraddr, function() {
            	console.log('Test Tcp IP Client Connected');
            	client.write('Hello, server! Love, Client.');
            });
             client.on('data', function(data) {
            	console.log('Test Tcp IP Client Received: ' + data);
            	client.destroy(); // kill client after server's response
            });
             client.on('close', function() {
                console.log('Test Tcp IP Client Connection closed');
            });*/
        }
    }]);

    return TcpSocketServer;
}();

module.exports = new TcpSocketServer();