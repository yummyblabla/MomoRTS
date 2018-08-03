"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongo_1 = require("./mongo");
// Listeners for the Server whenever server receives an on.message from the client about lobby updates or messages
let listener = function (clients, sessionInfo, index, data) {
    let mongo = new mongo_1.Mongo();
    let curClient = clients[index];
    let session = sessionInfo[index];
    switch (data.type) {
        case "message": {
            console.log(data);
            curClient.send(JSON.stringify({ type: "text", text: "sent back" }));
            break;
        }
    }
};
module.exports = {
    listener: listener
};
//# sourceMappingURL=LobbyListeners.js.map