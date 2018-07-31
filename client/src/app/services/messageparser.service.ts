import { Injectable } from '@angular/core';
import * as Rx from 'rxjs';
import { map } from 'rxjs/operators';

import { Observable, Observer, Subject } from 'rxjs';

import { WebsocketService } from './websocket.service';

@Injectable({
  providedIn: 'root'
})

export class MessageParser {
	private SERVER_URL = "ws://localhost:1337" as string;
	
	public messages: Subject<any> = new Subject<any>();

	constructor(private wsService: WebsocketService) {
		let ws = <Subject<any>>this.wsService
			.connect(this.SERVER_URL);
		this.messages = <Subject<any>>ws.pipe(map((response: any): any => {
				let data = JSON.parse(response.data);
				return data;
			}));
		// this.messages = <Subject<any>>this.wsService
		// 	.connect("ws://localhost:1337")
		// 	.pipe(map((response: any): any => {
		// 		let data = JSON.parse(response.data);
		// 		return data;
		// 	});
	}
}