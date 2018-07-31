"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const websocket_1 = require("./websocket");
let Listeners = require('./listeners');
let server = new websocket_1.WebSocketServer();
exports.server = server;
server.addListeners(Listeners.listener);
//# sourceMappingURL=server.js.map