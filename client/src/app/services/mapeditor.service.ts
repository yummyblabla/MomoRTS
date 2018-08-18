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
		let width: number = 5;
		let height: number = 5;
		for (let x = 0; x < width; x++) {
			this.tiles.push([]);
			for (let y = 0; y < height; y++) {
				this.tiles[x].push("0");
			}
		}
		this.map = new Map(height, width, this.tiles, [], [], [], 0);
		this.width = this.map.width;
		this.height = this.map.height;

		this.newMap = false;
	}

// Change dimensions and create a new map object
	changeDimensions(height: number, width: number) {
		// Clear existing tiles
		this.clearTiles();

		// Push placeholder tiles to the tile array
		for (let x = 0; x < width; x++) {
			this.tiles.push([]);
			for (let y = 0; y < height; y++) {
				this.tiles[x].push("0");
			}
		}
		// Generate new map
		this.map = new Map(height, width, this.tiles, [], [], [], 0);

		this.width = this.map.width;
		this.height = this.map.height;

		return true;
	}

	clearTiles() {
		this.tiles = [];
	}


}
