import { Injectable } from '@angular/core';

import { Map } from './../../game/data/map';

@Injectable({
	providedIn: 'root'
})
export class MapeditorService {

	tiles = [];
	map: Map;
	height: number;
	width: number;
	newMap: boolean = true;

	constructor() { }

	generateDefaultMap() {
		this.map = new Map(50, 50, [], [], [], [], 0);
		for (let x = 0; x < this.map.width; x++) {
			this.tiles.push([]);
			for (let y = 0; y < this.map.height; y++) {
				this.tiles[x].push("0");
			}
		}
		this.map.tiles = this.tiles;
		this.width = this.map.width;
		this.height = this.map.height;

		this.newMap = false;
	}

	changeDimensions(height: number, width: number) {
		this.map = new Map(height, width, [], [], [], [], 0);
		for (let x = 0; x < this.map.width; x++) {
			this.tiles.push([]);
			for (let y = 0; y < this.map.height; y++) {
				this.tiles[x].push("0");
			}
		}
	}

	
}
