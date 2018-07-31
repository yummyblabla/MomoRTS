"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const http = require("http");
const WebSocket = require("ws");
const express = require("express");
const mongodb = require("mongodb");
class WebSocketService {
    constructor() {
        // Below parameters currently has any type for now
        this.clients = {};
        this.sessionInfo = {};
        this.PORT = process.env.PORT || 1337;
        this.DATABASE = 'mongodb://localhost:27017/MomoRTS';
        this.createApp();
        this.createServer();
        this.websockets();
        this.connectToDB();
        this.listen();
        this.checkConnection();
    }
    // Initialize node.js express
    createApp() {
        this.app = express();
    }
    // Initialize http Server
    createServer() {
        this.server = http.createServer(function (request, response) { });
    }
    // Initialize the WebSocketServer instance
    websockets() {
        this.wsServer = new WebSocket.Server({
            // Verifyclient is set to automatically not accept every handshake
            // verifyClient: function(info: any) {
            // },
            server: this.server
        });
    }
    // Connect to MongoDB Database
    connectToDB() {
        mongodb.MongoClient.connect(this.DATABASE, { useNewUrlParser: true })
            .then(() => console.log('Connection to MongoDB database successful!'))
            .catch((err) => console.error(err));
    }
    // Start the server by listening to Port
    listen() {
        this.server.listen(this.PORT, () => {
            console.log('Server has started');
        });
    }
    // Websocket.Server Getter
    getServer() {
        return this.app;
    }
    // Function call when an connection with client is established
    checkConnection() {
        let clients = this.clients;
        let sessionInfo = this.sessionInfo;
        this.wsServer.on('connection', function (ws, request) {
            // Print out IP of connection
            const ip = request.connection.remoteAddress;
            console.log(ip + " connected.");
            // Assign index of the connection
            let index = 0;
            clients[index] = request.connection;
            sessionInfo[index] = {};
            // Emitted when a message is received
            ws.on('message', function (message) {
                console.log('received: %s', message);
            });
            // Logs error that occurred with connection
            ws.on('error', function (error) {
                console.log(error);
            });
            // Closes the connection
            ws.on('close', function (ws, code, reason) {
                console.log(ip + " has disconnected.");
                delete clients[index];
                delete sessionInfo[index];
            });
        });
    }
}
exports.WebSocketService = WebSocketService;
//# sourceMappingURL=socket.js.map