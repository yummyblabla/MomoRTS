import { WebSocketServer } from './websocket';

let Listeners = require('./listeners');

let server = new WebSocketServer();
server.addListeners(Listeners.listener);

export { server };