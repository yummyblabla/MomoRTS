export class Tile {
/** Base Tiles
		Height
			0, 1, 2, 3
		Ramp
			Horizontal - H
			Vertical - V
			Diagonal1 (\) - D
			Diagonal2 (/) - E
		Water
			Water - W
	Functional
		Impassable - X
		Unbuildable - Y

**/
	horizontal_ramp: string = "H";
	vertical_ramp: string = "V";
	diagonal1_ramp: string = "D";
	diagonal2_ramp: string = "E";
	// MapEditor access for which ramp to use based on currentTool value
	ramp_array: string[] = [this.horizontal_ramp, this.vertical_ramp, this.diagonal1_ramp, this.diagonal2_ramp];

	waterTile: string = "W";

	impassable: string = "X";
	unbuildable: string = "Y";

	// Get Ramp Array
	getRampArray() {
		return this.ramp_array;
	}
	
	// Get Water Tile
	getWaterTile() {
		return this.waterTile;
	}

	// Add impassable function to tile
	addImpassable(tile: string) {
		let value = tile.toString();
		return value + this.impassable;
	}

	// Remove impassable function from tile
	removeImpassable(tile: string) {
		return tile.replace(this.impassable, "");
	}

	// Checks if the tile is impassable
	checkImpassable(tile: string) {
		let value = tile.toString();
		return (value.includes(this.impassable));
	}

	// Add impassable function to tile
	addUnbuildable(tile: string) {
		let value = tile.toString();
		return value + this.unbuildable;
	}

	// Remove impassable function from tile
	removeUnbuildable(tile: string) {
		return tile.replace(this.unbuildable, "");
	}

	// Checks if the tile disallows building
	checkUnbuildable(tile: string) {
		let value = tile.toString();

		return (value.includes(this.unbuildable));
	}

	// Checks if tile has a base value
	contains(tile: string, value) {
		return (tile.includes(value));
	}

	// Changes the tile's base value
	changeBase(tile: string, value) {
		let extra = tile.substring(1, tile.length);

		return value + extra;
	}
}