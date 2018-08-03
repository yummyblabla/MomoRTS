import { server } from './server';
import { Mongo } from './mongo';

// Listeners for the Server whenever server receives an on.message from the client about lobby updates or messages

let listener = function(clients: any, sessionInfo: any, index: number, data: any): void {
	let mongo = new Mongo();
	let curClient = clients[index];
	let session = sessionInfo[index];

	switch (data.type) {
		case "message": {
			console.log(data);
			curClient.send(JSON.stringify({type: "text", text: "sent back"}));
			break;
		}
	}
}

module.exports = {
	listener: listener
}