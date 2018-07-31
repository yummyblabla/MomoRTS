"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = require("./server");
// Listeners for the Server whenever server receives an on.message from the client //
let listener = function (clients, sessionInfo, index, data) {
    let ws = server_1.server.getSocket();
    let curClient = clients[index];
    let session = sessionInfo[index];
    switch (data.type) {
        case "message": {
            console.log(data);
            curClient.send(JSON.stringify({ type: "text", text: "sent back" }));
            break;
        }
        case "other": {
            console.log("other");
            break;
        }
    }
};
module.exports = {
    listener: listener
};
//# sourceMappingURL=listeners.js.map