"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const http = require("http");
const WebSocket = require("ws");
const express = require("express");
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
class WebSocketServer {
    constructor() {
        // Below parameters currently has any type for now
        this.clients = {};
        this.sessionInfo = {};
        this.listeners = [];
        this.PORT = process.env.PORT || 1337;
        this.DATABASE = 'mongodb://localhost:27017/MomoRTS';
        this.createApp();
        this.createServer();
        this.websockets();
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
    // private connectToDB() {
    // 	MongoClient.connect(this.DATABASE, {useNewUrlParser: true}, function(err: any, client: any) {
    // 		assert.equal(null, err);
    // 		console.log("Connected to MongoDB server");
    // 	})
    // }
    // Start the server by listening to Port
    listen() {
        this.server.listen(this.PORT, () => {
            console.log('Server has started');
        });
    }
    // WebSocket Getter
    getSocket() {
        return this.wsServer;
    }
    // Websocket.Server Getter
    getServer() {
        return this.app;
    }
    // Function call when an connection with client is established
    checkConnection() {
        this.wsServer.on('connection', (ws, request) => {
            // Print out IP of connection
            const ip = request.connection.remoteAddress;
            console.log(ip + " connected.");
            // Assign index of the connection
            let index = 0;
            this.clients[index] = ws;
            this.sessionInfo[index] = {};
            // Emitted when a message is received
            ws.on('message', (message) => {
                if (typeof message == "string") {
                    try {
                        // Attempts to parse message into a JSON
                        let data = JSON.parse(message);
                        let curClient = this.clients[index];
                        let session = this.sessionInfo[index];
                        if (!("type" in data)) {
                            console.log("Invalid data structure received");
                            return;
                        }
                        else {
                            // Checks the listeners if data.type exists in the JSON message from client
                            this.checkListeners(this.clients, this.sessionInfo, index, data);
                        }
                    }
                    catch (err) {
                        console.log(err);
                        return;
                    }
                }
            });
            // Logs error that occurred with connection
            ws.on('error', (error) => {
                console.log(error);
            });
            // Closes the connection
            ws.on('close', (ws, code, reason) => {
                console.log(ip + " has disconnected.");
                delete this.clients[index];
                delete this.sessionInfo[index];
            });
        });
    }
    // Iterate through listeners
    checkListeners(clients, sessionInfo, index, data) {
        for (let i = 0; i < this.listeners.length; i++) {
            this.listeners[i](clients, sessionInfo, index, data);
        }
    }
    // Add listeners to onmessage emitter
    addListeners(listener) {
        this.listeners.push(listener);
    }
}
exports.WebSocketServer = WebSocketServer;
//# sourceMappingURL=websocket.js.map