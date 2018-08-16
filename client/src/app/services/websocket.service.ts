import { Injectable } from '@angular/core';
import * as Rx from 'rxjs';
import { webSocket } from 'rxjs/websocket';

import * as crypto from 'crypto';

import { Observable, Observer, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class WebsocketService {
    private SERVER_URL: string = "ws://localhost:1337";

    public openEvents = new Subject();

    public subject = webSocket({
      url: this.SERVER_URL,
      openObserver: this.openEvents});


    
    public hash(input) {
      return crypto.createHash('sha256').update(input).digest('hex');
    }
}
