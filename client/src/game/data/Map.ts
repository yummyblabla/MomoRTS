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
	valid: boolean // Checks if map is valid

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
		this.valid = true;
		for (let x = 0; x < this.width; x++) {
			for (let y = 0; y < this.height; y++) {
				let currentTile = this.Tile.checkBase(this.tiles[x][y]);
				// Checks if adjacent heights are separated by a difference of 1 or invalid edge height
				if (this.Tile.height_array.includes(currentTile)) {
					let tileHeight = Number(this.tiles[x][y]);

					// Checks edges if tileheight is more than 2
					if (tileHeight >= 2 && (x == 0 || x == this.width - 1 || y == 0 || y == this.height - 1)) {
						this.throwError(x, y);
					}

					if (x == 0) { // Checks left edges
						if (y == 0) { // TopLeft corner
							let bottomCheck = this.Tile.checkBase(this.tiles[x][y + 1]);
							let bottomRightCheck = this.Tile.checkBase(this.tiles[x + 1][y + 1]);
							let rightCheck = this.Tile.checkBase(this.tiles[x + 1][y]);

							this.checkInvalidAdjacentHeight(tileHeight, [bottomCheck, bottomRightCheck, rightCheck], x, y);
						} else if (y == this.height - 1) { // BottomLeft corner
							let topCheck = this.Tile.checkBase(this.tiles[x][y - 1]);
							let topRightCheck = this.Tile.checkBase(this.tiles[x + 1][y - 1]);
							let rightCheck = this.Tile.checkBase(this.tiles[x + 1][y]);

							this.checkInvalidAdjacentHeight(tileHeight, [topCheck, topRightCheck, rightCheck], x, y);
						} else { // All other cases
							let topCheck = this.Tile.checkBase(this.tiles[x][y - 1]);
							let topRightCheck = this.Tile.checkBase(this.tiles[x + 1][y - 1]);
							let rightCheck = this.Tile.checkBase(this.tiles[x + 1][y]);
							let bottomCheck = this.Tile.checkBase(this.tiles[x][y + 1]);
							let bottomRightCheck = this.Tile.checkBase(this.tiles[x + 1][y + 1]);

							this.checkInvalidAdjacentHeight(tileHeight, [topCheck, topRightCheck, rightCheck, bottomCheck, bottomRightCheck], x, y);
						}
					} else if (x == this.width - 1) { // Checks right edges
						if (y == 0) { // Topright corner
							let leftCheck = this.Tile.checkBase(this.tiles[x - 1][y]);
							let bottomCheck = this.Tile.checkBase(this.tiles[x][y + 1]);
							let bottomLeftCheck = this.Tile.checkBase(this.tiles[x - 1][y + 1]);

							this.checkInvalidAdjacentHeight(tileHeight, [leftCheck, bottomCheck, bottomLeftCheck], x, y);
						} else if (y == this.height - 1) { // BottomRight corner
							let leftCheck = this.Tile.checkBase(this.tiles[x - 1][y]);
							let topCheck = this.Tile.checkBase(this.tiles[x][y - 1]);
							let topLeftCheck = this.Tile.checkBase(this.tiles[x - 1][y - 1]);

							this.checkInvalidAdjacentHeight(tileHeight, [leftCheck, topCheck, topLeftCheck], x, y);
						} else { // All other cases
							let leftCheck = this.Tile.checkBase(this.tiles[x - 1][y]);
							let topCheck = this.Tile.checkBase(this.tiles[x][y - 1]);
							let bottomCheck = this.Tile.checkBase(this.tiles[x][y + 1]);
							let topLeftCheck = this.Tile.checkBase(this.tiles[x - 1][y - 1]);
							let bottomLeftCheck = this.Tile.checkBase(this.tiles[x - 1][y + 1]);

							this.checkInvalidAdjacentHeight(tileHeight, [leftCheck, topCheck, topLeftCheck, bottomCheck, bottomLeftCheck], x, y);
						}
					} else if (y == 0) { // Checks top edges minus corners
						let leftCheck = this.Tile.checkBase(this.tiles[x - 1][y]);
						let bottomCheck = this.Tile.checkBase(this.tiles[x][y + 1]);
						let rightCheck = this.Tile.checkBase(this.tiles[x + 1][y]);
						let bottomLeftCheck = this.Tile.checkBase(this.tiles[x - 1][y + 1]);
						let bottomRightCheck = this.Tile.checkBase(this.tiles[x + 1][y + 1]);

						this.checkInvalidAdjacentHeight(tileHeight, [leftCheck, bottomCheck, rightCheck, bottomLeftCheck, bottomRightCheck], x, y);
						
					} else if (y == this.height - 1) { // Checks bottom edges minus corners
						let leftCheck = this.Tile.checkBase(this.tiles[x - 1][y]);
						let rightCheck = this.Tile.checkBase(this.tiles[x + 1][y]);
						let topCheck = this.Tile.checkBase(this.tiles[x][y - 1]);
						let topRightCheck = this.Tile.checkBase(this.tiles[x + 1][y - 1]);
						let topLeftCheck = this.Tile.checkBase(this.tiles[x - 1][y - 1]);

						this.checkInvalidAdjacentHeight(tileHeight, [leftCheck, topCheck, topCheck, topRightCheck, topLeftCheck], x, y);
					} else { // All non-edge cases
						let leftCheck = this.Tile.checkBase(this.tiles[x - 1][y]);
						let bottomCheck = this.Tile.checkBase(this.tiles[x][y + 1]);
						let topCheck = this.Tile.checkBase(this.tiles[x][y - 1]);
						let rightCheck = this.Tile.checkBase(this.tiles[x + 1][y]);
						let topRightCheck = this.Tile.checkBase(this.tiles[x + 1][y - 1]);
						let topLeftCheck = this.Tile.checkBase(this.tiles[x - 1][y - 1]);
						let bottomLeftCheck = this.Tile.checkBase(this.tiles[x - 1][y + 1]);
						let bottomRightCheck = this.Tile.checkBase(this.tiles[x + 1][y + 1]);

						this.checkInvalidAdjacentHeight(tileHeight, [leftCheck, bottomCheck, topCheck, rightCheck, topRightCheck, topLeftCheck, bottomLeftCheck, bottomRightCheck], x, y);
					}
				}
				// Checks validity of ramp tiles
				if (this.Tile.ramp_array.includes(currentTile)) {
					// Ramps cannot be on edges
					if (x == 0 || x == this.width - 1 || y == 0 || y == this.height - 1) {
						this.throwError(x, y);
					}

					let leftTile = this.Tile.checkBase(this.tiles[x - 1][y]);
					let rightTile = this.Tile.checkBase(this.tiles[x + 1][y]);
					let topTile = this.Tile.checkBase(this.tiles[x][y - 1]);
					let bottomTile = this.Tile.checkBase(this.tiles[x][y + 1]);
					let bottomRightTile = this.Tile.checkBase(this.tiles[x + 1][y + 1]);
					let topLeftTile = this.Tile.checkBase(this.tiles[x - 1][y - 1]);
					let topRightTile = this.Tile.checkBase(this.tiles[x + 1][y - 1]);
					let bottomLeftTile = this.Tile.checkBase(this.tiles[x - 1][y + 1]);

					// Horizontal ramp
					if (this.Tile.horizontal_ramp == currentTile) {
						// Checks if side tiles are height tiles
						if (!this.Tile.height_array.includes(leftTile)
							|| !this.Tile.height_array.includes(rightTile)
							) {
							this.throwError(x, y);
						} else { // Checks if difference in side tile height is 1
							let leftHeight = Number(leftTile);
							let rightHeight = Number(rightTile);
							let maxHeight = Math.max(leftHeight, rightHeight);

							if (!(Math.abs(leftHeight - rightHeight) == 1)) {
								this.throwError(x, y);
							}
							if (this.Tile.height_array.includes(topTile) && (Number(topTile) != maxHeight)) {
								this.throwError(x, y);
							}
							if (this.Tile.height_array.includes(bottomTile) && (Number(bottomTile) != maxHeight)) {
								this.throwError(x, y);
							}
						}
					}
					// Vertical ramp
					if (this.Tile.vertical_ramp == currentTile) {
						// Checks if side tiles are height tiles
						if (!this.Tile.height_array.includes(topTile)
							|| !this.Tile.height_array.includes(bottomTile)
							) {
							this.throwError(x, y);
						} else { // Checks if difference in side tile height is 1
							let topHeight = Number(topTile);
							let bottomHeight = Number(bottomTile);
							let maxHeight = Math.max(topHeight, bottomHeight);

							if (!(Math.abs(topHeight - bottomHeight) == 1)) {
								this.throwError(x, y);
							}
							if (this.Tile.height_array.includes(leftTile) && (Number(leftTile) != maxHeight)) {
								this.throwError(x, y);
							}
							if (this.Tile.height_array.includes(rightTile) && (Number(rightTile) != maxHeight)) {
								this.throwError(x, y);
							}
						}
					}
					// Diagonal1 (\) ramp
					if (this.Tile.diagonal1_ramp == currentTile) {
						// Checks if ramp is on side edges and side tiles are height tiles
						if (!this.Tile.height_array.includes(topLeftTile) // Top Left
							|| !this.Tile.height_array.includes(bottomRightTile) // Bottom Right
							) {
							this.throwError(x, y);
						} else { // Checks if the two sections of height tiles differ by 1 adjacent heights are the min height
							let topLeftHeight = Number(topLeftTile);
							let bottomRightHeight = Number(bottomRightTile);
		
							if ((Math.abs(topLeftHeight - bottomRightHeight) == 1)) {
								if (topLeftHeight > bottomRightHeight) {
									if (this.Tile.height_array.includes(bottomTile)) {
										if (Number(bottomTile) != bottomRightHeight) {
											this.throwError(x, y);
										}
									}
									if (this.Tile.height_array.includes(rightTile)) {
										if (Number(rightTile) != bottomRightHeight) {
											this.throwError(x, y);
										}
									}
								} else {
									if (this.Tile.height_array.includes(topTile)) {
										if (Number(topTile) != topLeftHeight) {
											this.throwError(x, y);
										}
									}
									if (this.Tile.height_array.includes(leftTile)) {
										if (Number(leftTile) != topLeftHeight) {
											this.throwError(x, y);
										}
									}
								}
							} else {
								this.throwError(x, y);
							}
						}
					}
					// Diagonal2 (/) ramp
					if (this.Tile.diagonal2_ramp == currentTile) {
						// Checks if side tiles are height tiles
						if (!this.Tile.height_array.includes(topRightTile)
							|| !this.Tile.height_array.includes(this.Tile.checkBase(bottomLeftTile)) // Bottom Left
							) {
							this.throwError(x, y);
						} else { // Checks if the two sections of height tiles differ by 1 adjacent heights are the min height
							let topRightHeight = Number(topRightTile);
							let bottomLeftHeight = Number(bottomLeftTile);
	
							if ((Math.abs(topRightHeight - bottomLeftHeight) == 1)) {
								if (topRightHeight > bottomLeftHeight) {
									if (this.Tile.height_array.includes(bottomTile)) {
										if (Number(bottomTile) != bottomLeftHeight) {
											this.throwError(x, y);
										}
									}
									if (this.Tile.height_array.includes(leftTile)) {
										if (Number(leftTile) != bottomLeftHeight) {
											this.throwError(x, y);
										}
									}
								} else {
									if (this.Tile.height_array.includes(topTile)) {
										if (Number(topTile) != topRightHeight) {
											this.throwError(x, y);
										}
									}
									if (this.Tile.height_array.includes(rightTile)) {
										if (Number(rightTile) != topRightHeight) {
											this.throwError(x, y);
										}
									}
								}
							} else {
								this.throwError(x, y);
							}
						}
					}
				}
			}
		}
		return this.valid;
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
		this.valid = false;
	}
}