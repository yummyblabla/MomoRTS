import { Component, OnInit } from '@angular/core';
import * as PIXI from 'pixi.js';

//Aliases
	let Application = PIXI.Application,
    loader = PIXI.loader,
    resources = PIXI.loader.resources,
    Sprite = PIXI.Sprite;

@Component({
	selector: 'app-game',
	templateUrl: './game.component.html',
	styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {

	public app: PIXI.Application;

	constructor() {}

	ngOnInit() {
		this.generatePixiCanvas();
	}

// Test code to use Pixijs
	generatePixiCanvas() {
		let app = new Application({
			width: 256, 
			height: 256,
			antialias: true,    // default: false
    		transparent: false, // default: false
   			resolution: 1       // default: 1
		});
		app.renderer.view.style.position = "absolute";
		app.renderer.view.style.display = "block";
		app.renderer.view.style.border = "1px dashed black";
		app.renderer.autoResize = true;
		app.renderer.backgroundColor = 0xFFFFFF;
		app.renderer.resize(window.innerWidth, window.innerHeight);
		document.getElementById('pixi-canvas').appendChild(app.view);

		let texture = PIXI.Texture.fromImage('./../../assets/units/blueprintIcon.png');

		for (let x = 0; x < 20; x++) {
			for (let y = 0; y < 20; y ++) {
				var sprite = new Sprite(texture);
				sprite.x = (x % 5) * 50;
				sprite.y = (y % 5) * 50;
				app.stage.addChild(sprite); 
			}
		}
		loader
			.add('./../../assets/units/blueprintIcon.png')
			.load(setup);

		function setup() {
			let cat = new Sprite(loader.resources['./../../assets/units/blueprintIcon.png'].texture);
			cat.x = 100;
			cat.y = 200;
			app.stage.addChild(cat);
		}
		
		
	}

}

	

	
