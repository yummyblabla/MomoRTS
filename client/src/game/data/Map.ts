import { Tile } from "./tile";

export class Map {

// Parameters of the Map
	width: number; // width - The width of the map in tiles
	height: number; // height - The height of the map in tiles
	tiles: any; // tiles - A 2D array of size width x height
	mapObjects: any; // An array of MapObjects
	buildings: any; // An array of Buildings 
	units: any; // An array of units
	defaultHeight: number; // defaultHeight - The default height of the map

	Tile: Tile;

	constructor(height, width, tiles, mapObjects, buildings, units, defaultHeight) {
	 	this.height = height;
	 	this.width = width;
	 	this.tiles = tiles;
	 	this.mapObjects = [];
	 	this.buildings = [];
		this.units = [];
		this.defaultHeight = defaultHeight;

		this.Tile = new Tile();
	}

	// Checks base tiles of the map to see if position of heights and ramps are valid
	validateMapTiles() {
		for (let x = 0; x < this.width; x++) {
			for (let y = 0; y < this.height; y++) {
				let currentTile = this.Tile.checkBase(this.tiles[x][y]);
				// Checks if adjacent heights are separated by a difference of 1
				if (this.Tile.height_array.includes(currentTile)) {
					let tileHeight = Number(this.tiles[x][y]);
					if (x == 0) { // Checks left edges
						if (y == 0) { // TopLeft corner
							let bottomCheck = this.Tile.checkBase(this.tiles[x][y + 1]);
							let rightCheck = this.Tile.checkBase(this.tiles[x + 1][y]);

							this.checkInvalidAdjacentHeight(tileHeight, [bottomCheck, rightCheck], x, y);
						} else if (y == this.height - 1) { // BottomLeft corner
							let topCheck = this.Tile.checkBase(this.tiles[x][y - 1]);
							let rightCheck = this.Tile.checkBase(this.tiles[x + 1][y]);

							this.checkInvalidAdjacentHeight(tileHeight, [topCheck, rightCheck], x, y);
						} else { // All other cases
							// Checks Top, Bottom, Right tiles
							let topCheck = this.Tile.checkBase(this.tiles[x][y - 1]);
							let rightCheck = this.Tile.checkBase(this.tiles[x + 1][y]);
							let bottomCheck = this.Tile.checkBase(this.tiles[x][y + 1]);

							this.checkInvalidAdjacentHeight(tileHeight, [topCheck, rightCheck, bottomCheck], x, y);
						}
					} else if (y == 0) { // Checks top edges minus topleft corner
						if (x == this.width - 1) { // TopRight corner
							let leftCheck = this.Tile.checkBase(this.tiles[x - 1][y]);
							let bottomCheck = this.Tile.checkBase(this.tiles[x][y + 1]);

							this.checkInvalidAdjacentHeight(tileHeight, [leftCheck, bottomCheck], x, y);
						} else { // All other cases
							let leftCheck = this.Tile.checkBase(this.tiles[x - 1][y]);
							let bottomCheck = this.Tile.checkBase(this.tiles[x][y + 1]);
							let rightCheck = this.Tile.checkBase(this.tiles[x + 1][y]);

							this.checkInvalidAdjacentHeight(tileHeight, [leftCheck, bottomCheck, rightCheck], x, y);
						}
					} else if (x == this.width - 1) { // Checks right edges minus topright corner
						if (y == this.height - 1) { // BottomRight corner
							let leftCheck = this.Tile.checkBase(this.tiles[x - 1][y]);
							let topCheck = this.Tile.checkBase(this.tiles[x][y - 1]);

							this.checkInvalidAdjacentHeight(tileHeight, [leftCheck, topCheck], x, y);
						} else {
							let leftCheck = this.Tile.checkBase(this.tiles[x - 1][y]);
							let topCheck = this.Tile.checkBase(this.tiles[x][y - 1]);
							let bottomCheck = this.Tile.checkBase(this.tiles[x][y + 1]);

							this.checkInvalidAdjacentHeight(tileHeight, [leftCheck, topCheck, bottomCheck], x, y);
						}
					} else if (y == this.height - 1) { // Checks bottom edges minus corners
						let leftCheck = this.Tile.checkBase(this.tiles[x - 1][y]);
						let rightCheck = this.Tile.checkBase(this.tiles[x + 1][y]);
						let topCheck = this.Tile.checkBase(this.tiles[x][y - 1]);

						this.checkInvalidAdjacentHeight(tileHeight, [leftCheck, topCheck, topCheck], x, y);
					} else { // All non-edge cases
						let leftCheck = this.Tile.checkBase(this.tiles[x - 1][y]);
						let bottomCheck = this.Tile.checkBase(this.tiles[x][y + 1]);
						let topCheck = this.Tile.checkBase(this.tiles[x][y - 1]);
						let rightCheck = this.Tile.checkBase(this.tiles[x + 1][y]);

						this.checkInvalidAdjacentHeight(tileHeight, [leftCheck, bottomCheck, topCheck, rightCheck], x, y);
					}
				}
				// Checks validity of ramp tiles
				if (this.Tile.ramp_array.includes(currentTile)) {
					// Horizontal ramp
					if (this.Tile.horizontal_ramp == currentTile) {
						// Checks if ramp is on side left/right edges and side tiles are height tiles
						if (x == 0 || x == this.width - 1 
							|| !this.Tile.height_array.includes(this.Tile.checkBase(this.tiles[x - 1][y]))
							|| !this.Tile.height_array.includes(this.Tile.checkBase(this.tiles[x + 1][y]))
							) {
							this.throwError(x, y);
						} else { // Checks if difference in side tile height is 1
							let leftTile = Number(this.Tile.checkBase(this.tiles[x - 1][y]));
							let rightTile = Number(this.Tile.checkBase(this.tiles[x + 1][y]));

							if (!(Math.abs(leftTile - rightTile) == 1)) {
								this.throwError(x, y);
							}
						}
					}
					// Vertical ramp
					if (this.Tile.vertical_ramp == currentTile) {
						// Checks if ramp is on side top/botom edges and side tiles are height tiles
						if (y == 0 || y == this.height - 1
							|| !this.Tile.height_array.includes(this.Tile.checkBase(this.tiles[x][y - 1]))
							|| !this.Tile.height_array.includes(this.Tile.checkBase(this.tiles[x][y + 1]))
							) {
							this.throwError(x, y);
						} else { // Checks if difference in side tile height is 1
							let topTile = Number(this.Tile.checkBase(this.tiles[x][y - 1]));
							let bottomTile = Number(this.Tile.checkBase(this.tiles[x][y + 1]));

							if (!(Math.abs(topTile - bottomTile) == 1)) {
								this.throwError(x, y);
							}
						}
					}
					// Diagonal1 (\) ramp
					if (this.Tile.diagonal1_ramp == currentTile) {
						// Checks if ramp is on side edges and side tiles are height tiles
						if (x == 0 || y == 0 || x == this.width - 1 || y == this.height - 1 // Side edge checks
							|| !this.Tile.height_array.includes(this.Tile.checkBase(this.tiles[x - 1][y - 1])) // Top Left
							|| !this.Tile.height_array.includes(this.Tile.checkBase(this.tiles[x][y - 1])) // Top
							|| !this.Tile.height_array.includes(this.Tile.checkBase(this.tiles[x - 1][y])) // Left
							|| !this.Tile.height_array.includes(this.Tile.checkBase(this.tiles[x][y + 1])) // Bottom
							|| !this.Tile.height_array.includes(this.Tile.checkBase(this.tiles[x + 1][y])) // Right
							|| !this.Tile.height_array.includes(this.Tile.checkBase(this.tiles[x + 1][y + 1])) // Bottom Right
							) {
							this.throwError(x, y);
						} else { // Checks if the two sections of height tiles differ by 1 and are the same
							let topLeft = this.Tile.checkBase(this.tiles[x - 1][y - 1]);
							let top = this.Tile.checkBase(this.tiles[x][y - 1]);
							let left = this.Tile.checkBase(this.tiles[x - 1][y]);
							let bottom = this.Tile.checkBase(this.tiles[x][y + 1]);
							let right = this.Tile.checkBase(this.tiles[x + 1][y]);
							let bottomRight = this.Tile.checkBase(this.tiles[x + 1][y + 1]);

							if (!(topLeft == top && topLeft == left && bottom == right && bottom == bottomRight 
								&& (Math.abs(Number(topLeft) - Number(bottomRight)) == 1)
								)) {
								this.throwError(x, y);
							}
						}
					}
					// Diagonal2 (/) ramp
					if (this.Tile.diagonal2_ramp == currentTile) {
						// Checks if ramp is on side edges and side tiles are height tiles
						if (x == 0 || y == 0 || x == this.width - 1 || y == this.height - 1 // Side edge checks
							|| !this.Tile.height_array.includes(this.Tile.checkBase(this.tiles[x + 1][y - 1])) // Top Right
							|| !this.Tile.height_array.includes(this.Tile.checkBase(this.tiles[x][y - 1])) // Top
							|| !this.Tile.height_array.includes(this.Tile.checkBase(this.tiles[x + 1][y])) // Right
							|| !this.Tile.height_array.includes(this.Tile.checkBase(this.tiles[x][y + 1])) // Bottom
							|| !this.Tile.height_array.includes(this.Tile.checkBase(this.tiles[x - 1][y])) // Left
							|| !this.Tile.height_array.includes(this.Tile.checkBase(this.tiles[x - 1][y + 1])) // Bottom Left
							) {
							this.throwError(x, y);
						} else { // Checks if the two sections of height tiles differ by 1 and are the same
							let topRight = this.Tile.checkBase(this.tiles[x + 1][y - 1]);
							let top = this.Tile.checkBase(this.tiles[x][y - 1]);
							let right = this.Tile.checkBase(this.tiles[x + 1][y]);
							let bottom = this.Tile.checkBase(this.tiles[x][y + 1]);
							let left = this.Tile.checkBase(this.tiles[x - 1][y]);
							let bottomLeft = this.Tile.checkBase(this.tiles[x - 1][y + 1]);

							if (!(topRight == top && topRight == right && bottom == left && bottom == bottomLeft 
								&& (Math.abs(Number(topRight) - Number(bottomLeft)) == 1)
								)) {
								this.throwError(x, y);
							}
						}
					}

				}
			}
		}
	}

	private checkInvalidAdjacentHeight(pivot: number, checkTiles, x: number, y) {
		for (let i = 0; i < checkTiles.length; i++) {
			if (this.Tile.height_array.includes(checkTiles[i])) {
				if (Math.abs(pivot - Number(checkTiles[i])) > 1) {
					this.throwError(x, y);
				}
			}
		}
		
	}

	private throwError(x, y) {
		console.log("error at " + x + " " + y);
	}
}