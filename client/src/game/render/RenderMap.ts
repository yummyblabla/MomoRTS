import * as PIXI from 'pixi.js';
import { Map } from './../data/map';
import { Tile } from './../data/tile';

import { MapeditorService } from './../../app/services/mapeditor.service';

export class RenderMap {
	Tile: Tile;

	constructor(private mapEditorService: MapeditorService) {
		this.Tile = new Tile();
	}

	renderedMapContainer: PIXI.Container;
	mapScale: number = 40;
	textureContainers;

	renderMap(map: Map) {
		this.textureContainers = [];
		this.renderedMapContainer = new PIXI.Container();

		for (let x = 0; x < map.width; x++) {
			this.textureContainers.push([]);
			for (let y = 0; y < map.height; y++) {
				this.textureContainers[x].push(new PIXI.Container());
				this.textureContainers[x][y].x = x * this.mapScale;
				this.textureContainers[x][y].y = y * this.mapScale;

				let currentTile = map.tiles[x][y];
				let baseTile = this.Tile.checkBase(currentTile);

				let sprite: PIXI.Sprite;
				let bit = 0;
				// Logic for determining which texture to render

				// If tile is height tile
				if (this.Tile.height_array.includes(baseTile)) {
					let currentHeight = Number(baseTile);
					if (currentHeight == 0) {
						sprite = new PIXI.Sprite(this.mapEditorService.Textures.tile_1);
					} else if (y == 0) { // Top edge
				
						if (x == 0) { // Top left corner
							bit += 3;
							let rightTile = this.Tile.checkBase(map.tiles[x + 1][y]);
							let botTile = this.Tile.checkBase(map.tiles[x][y + 1]);

							bit += this.checkRightTile(rightTile, currentHeight);
							bit += this.checkBotTile(botTile, currentHeight);
							sprite = this.determineTile(bit);

						} else if (x == map.width - 1) { // Top right corner
							bit += 9;
							let leftTile = this.Tile.checkBase(map.tiles[x - 1][y]);
							let botTile = this.Tile.checkBase(map.tiles[x][y + 1]);

							bit += this.checkLeftTile(leftTile, currentHeight);
							bit += this.checkBotTile(botTile, currentHeight);
							sprite = this.determineTile(bit);

						} else { // Middle cases
							bit += 1;
							let rightTile = this.Tile.checkBase(map.tiles[x + 1][y]);
							let leftTile = this.Tile.checkBase(map.tiles[x - 1][y]);
							let botTile = this.Tile.checkBase(map.tiles[x][y + 1]);

							bit += this.checkRightTile(rightTile, currentHeight);
							bit += this.checkLeftTile(leftTile, currentHeight);
							bit += this.checkBotTile(botTile, currentHeight);
							sprite = this.determineTile(bit);
						}
					} else if (y == map.height - 1) { // Bottom edge

						if (x == 0) { // Bottom left corner
							bit += 6;
							let topTile = this.Tile.checkBase(map.tiles[x][y - 1]);
							let rightTile = this.Tile.checkBase(map.tiles[x + 1][y]);

							bit += this.checkTopTile(topTile, currentHeight);
							bit += this.checkRightTile(rightTile, currentHeight);
							sprite = this.determineTile(bit);

						} else if (x == map.width - 1) { // Bottom right corner
							bit += 12;
							let topTile = this.Tile.checkBase(map.tiles[x][y - 1]);
							let leftTile = this.Tile.checkBase(map.tiles[x - 1][y]);

							bit += this.checkTopTile(topTile, currentHeight);
							bit += this.checkLeftTile(leftTile, currentHeight);
							sprite = this.determineTile(bit);
						} else { // Middle cases
							bit += 4;
							let topTile = this.Tile.checkBase(map.tiles[x][y - 1]);
							let leftTile = this.Tile.checkBase(map.tiles[x - 1][y]);
							let rightTile = this.Tile.checkBase(map.tiles[x + 1][y]);

							bit += this.checkTopTile(topTile, currentHeight);
							bit += this.checkRightTile(rightTile, currentHeight);
							bit += this.checkLeftTile(leftTile, currentHeight);
							sprite = this.determineTile(bit);
						}
					} else if (x == 0) { // Left edge
						bit += 2;
						let topTile = this.Tile.checkBase(map.tiles[x][y - 1]);
						let botTile = this.Tile.checkBase(map.tiles[x][y + 1]);
						let rightTile = this.Tile.checkBase(map.tiles[x + 1][y]);

						bit += this.checkRightTile(rightTile, currentHeight);
						bit += this.checkTopTile(topTile, currentHeight);
						bit += this.checkBotTile(botTile, currentHeight);
						sprite = this.determineTile(bit);
					} else if (x === map.width - 1) { // Right edge
						bit += 8;
						let topTile = this.Tile.checkBase(map.tiles[x][y - 1]);
						let botTile = this.Tile.checkBase(map.tiles[x][y + 1]);
						let leftTile = this.Tile.checkBase(map.tiles[x - 1][y]);

						bit += this.checkLeftTile(leftTile, currentHeight);
						bit += this.checkTopTile(topTile, currentHeight);
						bit += this.checkBotTile(botTile, currentHeight);
						sprite = this.determineTile(bit);
					} else { // Non-edge cases
						let topTile = this.Tile.checkBase(map.tiles[x][y - 1]);
						let botTile = this.Tile.checkBase(map.tiles[x][y + 1]);
						let rightTile = this.Tile.checkBase(map.tiles[x + 1][y]);
						let leftTile = this.Tile.checkBase(map.tiles[x - 1][y]);

						bit += this.checkLeftTile(leftTile, currentHeight);
						bit += this.checkRightTile(rightTile, currentHeight);
						bit += this.checkTopTile(topTile, currentHeight);
						bit += this.checkBotTile(botTile, currentHeight);

						if (bit == 0) {
							let cornerBit = 0;
							let topLeftTile = this.Tile.checkBase(map.tiles[x - 1][y - 1]);
							let topRightTile = this.Tile.checkBase(map.tiles[x + 1][y - 1]);
							let botRightTile = this.Tile.checkBase(map.tiles[x + 1][y + 1]);
							let botLeftTile = this.Tile.checkBase(map.tiles[x - 1][y + 1]);

							cornerBit += this.checkTopLeftCorner(topLeftTile, currentHeight);
							cornerBit += this.checkTopRightCorner(topRightTile, currentHeight);
							cornerBit += this.checkBotLeftCorner(botLeftTile, currentHeight);
							cornerBit += this.checkBotRightCorner(botRightTile, currentHeight);

							sprite = this.determineTileFromCorner(cornerBit);
						} else {
							sprite = this.determineTile(bit);
						}
					}
				}

				// If tile is ramp tile
				if (this.Tile.ramp_array.includes(baseTile)) {
					// Horizontal ramp
					if (baseTile == this.Tile.horizontal_ramp) {
						let leftTile = this.Tile.checkBase(map.tiles[x - 1][y]);
						let rightTile = this.Tile.checkBase(map.tiles[x + 1][y]);

						if (Number(leftTile) > Number(rightTile)) {
							sprite = new PIXI.Sprite(this.mapEditorService.Textures.tile_17);
						} else {
							sprite = new PIXI.Sprite(this.mapEditorService.Textures.tile_16);
						}
					// Vertical ramp
					} else if (baseTile == this.Tile.vertical_ramp) {
						let topTile = this.Tile.checkBase(map.tiles[x][y - 1]);
						let bottomTile = this.Tile.checkBase(map.tiles[x][y + 1]);

						if (Number(topTile) > Number(bottomTile)) {
							sprite = new PIXI.Sprite(this.mapEditorService.Textures.tile_18);
						} else {
							sprite = new PIXI.Sprite(this.mapEditorService.Textures.tile_15);
						}
					// Diagonal 1 Ramp
					} else if (baseTile == this.Tile.diagonal1_ramp) {
						let topLeftTile = this.Tile.checkBase(map.tiles[x - 1][y - 1]);
						let botRightTile = this.Tile.checkBase(map.tiles[x + 1][y + 1]);

						if (Number(topLeftTile) > Number(botRightTile)) {
							sprite = new PIXI.Sprite(this.mapEditorService.Textures.tile_21);
						} else {
							sprite = new PIXI.Sprite(this.mapEditorService.Textures.tile_22);
						}
					// Diagonal 2 Ramp
					} else if (baseTile == this.Tile.diagonal2_ramp) {
						let topRightTile = this.Tile.checkBase(map.tiles[x + 1][y - 1]);
						let botLeftTile = this.Tile.checkBase(map.tiles[x - 1][y + 1]);

						if (Number(topRightTile) > Number(botLeftTile)) {
							sprite = new PIXI.Sprite(this.mapEditorService.Textures.tile_19);
						} else {
							sprite = new PIXI.Sprite(this.mapEditorService.Textures.tile_20);
						}
					}

				}
				
				sprite.height = this.mapScale;
				sprite.width = this.mapScale;
				this.textureContainers[x][y].addChild(sprite);

				this.renderedMapContainer.addChild(this.textureContainers[x][y]);

			}
		}

		return this.renderedMapContainer;
	}

	// Determine tile from NESW tiles to render from bitmasking
	determineTile(bit: number) {
		// N = 1
		// W = 2
		// S = 4
		// E = 8
		// Add to sum if tile is height lower than the current height
		switch(bit) {
			case 1: {
				return new PIXI.Sprite(this.mapEditorService.Textures.tile_4);
				break;
			}
			case 2: {
				return new PIXI.Sprite(this.mapEditorService.Textures.tile_10);
				break;
			}
			case 3: {
				return new PIXI.Sprite(this.mapEditorService.Textures.tile_3);
				break;
			}
			case 4: {
				return new PIXI.Sprite(this.mapEditorService.Textures.tile_8);
				break;
			}
			case 6: {
				return new PIXI.Sprite(this.mapEditorService.Textures.tile_9);
				break;
			}
			case 8: {
				return new PIXI.Sprite(this.mapEditorService.Textures.tile_6);
				break;
			}
			case 9: {
				return new PIXI.Sprite(this.mapEditorService.Textures.tile_5);
				break;
			}
			case 12: {
				return new PIXI.Sprite(this.mapEditorService.Textures.tile_7);
				break;
			}
			// case 7:
			// case 10:
			// case 11:
			// case 13:
			// case 14:
			// case 5:
			// case 15:
			default: {
				return new PIXI.Sprite(this.mapEditorService.Textures.tile_2);
				break;
			}
		}
	}
	
	// Right tile = 8
	checkRightTile(rightTile: string, currentHeight: number) {
		if (this.Tile.height_array.includes(rightTile)) {
			let rightHeight = Number(rightTile);
			if (currentHeight > rightHeight) {
				return 8;
			}
		}
		return 0;
	}

	// Bot tile = 4
	checkBotTile(botTile: string, currentHeight: number) {
		if (this.Tile.height_array.includes(botTile)) {
			let botHeight = Number(botTile);
			if (currentHeight > botHeight) {
				return 4;
			}
		}
		return 0;
	}

	// Left tile = 2
	checkLeftTile(leftTile: string, currentHeight: number) {
		if (this.Tile.height_array.includes(leftTile)) {
			let leftHeight = Number(leftTile);
			if (currentHeight > leftHeight) {
				return 2;
			}
		}
		return 0;
	}

	// Top tile = 1
	checkTopTile(topTile: string, currentHeight: number) {
		if (this.Tile.height_array.includes(topTile)) {
			let topHeight = Number(topTile);
			if (currentHeight > topHeight) {
				return 1;
			}
		}
		return 0;
	}

	// Determine tile if bit = 0 using corner tiles
	determineTileFromCorner(cornerBit: number) {
		// NW = 1
		// NE = 2
		// SW = 4
		// SE = 8
		// Add to sum if tile is height lower than the current height
		switch(cornerBit) {
			case 0: {
				return new PIXI.Sprite(this.mapEditorService.Textures.tile_1);
				break;
			}
			case 1: {
				return new PIXI.Sprite(this.mapEditorService.Textures.tile_13);
				break;
			}
			case 2: {
				return new PIXI.Sprite(this.mapEditorService.Textures.tile_14);
				break;
			}
			case 3: {
				return new PIXI.Sprite(this.mapEditorService.Textures.tile_4);
				break;
			}
			case 4: {
				return new PIXI.Sprite(this.mapEditorService.Textures.tile_12);
				break;
			}
			case 5: {
				return new PIXI.Sprite(this.mapEditorService.Textures.tile_10);
				break;
			}
			case 7: {
				return new PIXI.Sprite(this.mapEditorService.Textures.tile_3);
				break;
			}
			case 8: {
				return new PIXI.Sprite(this.mapEditorService.Textures.tile_11);
				break;
			}
			case 10: {
				return new PIXI.Sprite(this.mapEditorService.Textures.tile_6);
				break;
			}
			case 11: {
				return new PIXI.Sprite(this.mapEditorService.Textures.tile_5);
				break;
			}
			case 12: {
				return new PIXI.Sprite(this.mapEditorService.Textures.tile_8);
				break;
			}
			case 13: {
				return new PIXI.Sprite(this.mapEditorService.Textures.tile_9);
				break;
			}
			case 14: {
				return new PIXI.Sprite(this.mapEditorService.Textures.tile_7);
				break;
			}
			// case 15:
			// case 9:
			// case 6:
			default: {
				return new PIXI.Sprite(this.mapEditorService.Textures.tile_2);
				break;
			}
		}
	}

	// Top left corner = 1
	checkTopLeftCorner(topLeftTile: string, currentHeight: number) {
		if (this.Tile.height_array.includes(topLeftTile)) {
			let topLeftHeight = Number(topLeftTile);
			if (currentHeight > topLeftHeight) {
				return 1;
			}
		}
		return 0;
	}

	// Top right corner = 2
	checkTopRightCorner(topRightTile: string, currentHeight: number) {
		if (this.Tile.height_array.includes(topRightTile)) {
			let topRightHeight = Number(topRightTile);
			if (currentHeight > topRightHeight) {
				return 2;
			}
		}
		return 0;
	}

	// Bot right corner = 8
	checkBotRightCorner(botRightTile: string, currentHeight: number) {
		if (this.Tile.height_array.includes(botRightTile)) {
			let botRightHeight = Number(botRightTile);
			if (currentHeight > botRightHeight) {
				return 8;
			}
		}
		return 0;
	}

	// Bot left corner = 4
	checkBotLeftCorner(botLeftTile: string, currentHeight: number) {
		if (this.Tile.height_array.includes(botLeftTile)) {
			let botLeftHeight = Number(botLeftTile);
			if (currentHeight > botLeftHeight) {
				return 4;
			}
		}
		return 0;
	}
}