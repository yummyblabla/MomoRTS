import { Injectable } from '@angular/core';
import * as Rx from 'rxjs';

import { Observable, Observer, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class WebsocketService {
	private socket: Subject<any>;

  	public connect(url: string): Subject<any> {
  		if (!this.socket) {
  			this.socket = this.create(url);
  			console.log("Connected to: " + url);
  		}
  		return this.socket;
  	}

  	private create(url: string): Subject<any> {
  		let ws = new WebSocket(url);

  		let observable = Observable.create(
  			(obs: Rx.Observer<any>) => {
  				ws.onmessage = obs.next.bind(obs);
  				ws.onerror = obs.error.bind(obs);
  				ws.onclose = obs.complete.bind(obs);

  				return ws.close.bind(ws);
  			}
  		);

  		let observer = {
  			next: (data: Object) => {
  				if (ws.readyState === WebSocket.OPEN) {
  					ws.send(JSON.stringify(data));
  				}
  			}
  		}

  		return Subject.create(observer, observable);
  	}

}
