import * as http from 'http';
import * as WebSocket from 'ws';
import * as express from 'express';

const MongoClient = require('mongodb').MongoClient;
const assert = require ('assert');

export class WebSocketServer {
	private app!: express.Application;
	private server!: http.Server;
	private wsServer!: WebSocket.Server;

// Below parameters currently has any type for now
	private clients: any = {};
	private sessionInfo: any = {};
	private listeners: { (clients: any, sessionInfo: any, index: number, data: any): void; }[] = [];

	private readonly PORT: string | number = process.env.PORT || 1337;
	private readonly DATABASE: string = 'mongodb://localhost:27017/MomoRTS';

	constructor() {
		this.createApp();
		this.createServer();
		this.websockets();
		this.listen();
		this.checkConnection();
	}

// Initialize node.js express
	private createApp(): void {
		this.app = express();
	}

// Initialize http Server
	private createServer(): void {
		this.server = http.createServer(function(request, response) {});
	}

// Initialize the WebSocketServer instance
	private websockets(): void {
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
	private listen(): void {
		this.server.listen(this.PORT, () => {
			console.log('Server has started');
		});
	}

// WebSocket Getter
	public getSocket(): WebSocket.Server {
		return this.wsServer;
	}
// Websocket.Server Getter
	public getServer(): express.Application {
		return this.app;
	}

// Function call when an connection with client is established
	private checkConnection(): void {


		this.wsServer.on('connection', (ws: WebSocket, request: http.IncomingMessage) => {
			// Print out IP of connection
			const ip = request.connection.remoteAddress as string;
			console.log(ip + " connected.");

			// Assign index of the connection
			let index = 0 as number;
			this.clients[index] = ws;
			this.sessionInfo[index] = {};

			// Emitted when a message is received
			ws.on('message', (message: WebSocket.Data) => {
				if (typeof message == "string") {
					try {
						// Attempts to parse message into a JSON
						let data = JSON.parse(message);

						let curClient = this.clients[index];
						let session = this.sessionInfo[index];

						if (!("type" in data)) {
							console.log("Invalid data structure received")
							return;
						} else {
							// Checks the listeners if data.type exists in the JSON message from client
							this.checkListeners(this.clients, this.sessionInfo, index, data);
						}

					} catch (err) {
						console.log(err);
						return;
					}
				}
			});
		 
			// Logs error that occurred with connection
			ws.on('error', (error) => {
				console.log(error);
			})

		 	// Closes the connection
			ws.on('close', (ws: WebSocket, code: number, reason: string) => {
				console.log(ip + " has disconnected.");
				delete this.clients[index];
				delete this.sessionInfo[index];
			});
		})
	}

// Iterate through listeners
	private checkListeners(clients: any, sessionInfo: any, index: number, data: any): void {
		for (let i = 0; i < this.listeners.length; i++) {
			this.listeners[i](clients, sessionInfo, index, data);
		}
	}

// Add listeners to onmessage emitter
	public addListeners(listener: (clients: any, sessionInfo: any, index: number, data: any) => void): void {
		this.listeners.push(listener);
	}
}