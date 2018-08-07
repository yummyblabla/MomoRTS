import { Component, OnInit } from '@angular/core';
import * as PIXI from 'pixi.js';

// let app = new PIXI.Application({width: 256, height: 256});
// document.body.appendChild(app.view);

@Component({
	selector: 'app-game',
	templateUrl: './game.component.html',
	styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {

	public app;
	
	constructor() {}



	ngOnInit() {
		this.generatePixiCanvas();
	}

	generatePixiCanvas() {
		let app = new PIXI.Application({width: 256, height: 256});
		document.getElementById('pixi-canvas').appendChild(app.view);
	}
}
