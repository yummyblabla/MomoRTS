"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const websocket_1 = require("./websocket");
let LoginListeners = require('./LoginListeners');
let LobbyListeners = require('./LobbyListeners');
let server = new websocket_1.WebSocketServer();
exports.server = server;
server.addListeners(LoginListeners.listener);
server.addListeners(LobbyListeners.listener);
//# sourceMappingURL=server.js.map