import { WebSocketServer } from './websocket';

let LoginListeners = require('./LoginListeners');
let LobbyListeners = require('./LobbyListeners');

let server = new WebSocketServer();
server.addListeners(LoginListeners.listener);
server.addListeners(LobbyListeners.listener);

export { server };