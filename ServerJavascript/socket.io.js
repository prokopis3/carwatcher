"use strict";

var currentPrice = 99,
    tcpclient = require('./TcpSocketServer');
tcpclient.myTestClient();

module.exports = function (appio) {

    module = {};

    module.attach = function (appio) {

        module.io = appio;

        module.io.set("origins", "*:*");

        module.io.sockets.on('connection', function (socket) {

            console.log('Server Side socket connected');
            socket.emit('priceUpdate', currentPrice);

            socket.on('bid', function (data) {

                currentPrice = parseInt(data);
                socket.emit('priceUpdate', currentPrice);
                socket.broadcast.emit('priceUpdate', currentPrice);
            });
        });
    };

    return module;
};