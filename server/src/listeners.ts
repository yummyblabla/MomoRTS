import * as WebSocket from 'ws';
import { server } from './server';

// Listeners for the Server whenever server receives an on.message from the client //


let listener = function(clients: any, sessionInfo: any, index: number, data: any): void {
	let ws = server.getSocket();
	let curClient = clients[index];
	let session = sessionInfo[index];

	switch (data.type) {

		case "message": {
			console.log(data);
			curClient.send(JSON.stringify({type: "text", text: "sent back"}));
			break;
		}
		case "other": {
			console.log("other");
			break;
			
		}
	}
}

module.exports = {
	listener: listener
};