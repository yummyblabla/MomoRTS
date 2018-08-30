export class Tile {
/** Base Tiles
		Height
			0, 1, 2, 3
		Ramp
			Horizontal - H
			Vertical - V
			Diagonal1 (\) - D
			Diagonal2 (/) - E
			
	Functional
		Water - W
		Impassable - X
		Unbuildable - Y

**/
	height_0: string = "0";
	height_1: string = "1";
	height_2: string = "2";
	height_3: string = "3";
	height_array: string[] = [this.height_0, this.height_1, this.height_2, this.height_3];

	horizontal_ramp: string = "H";
	vertical_ramp: string = "V";
	diagonal1_ramp: string = "D";
	diagonal2_ramp: string = "E";
	// MapEditor access for which ramp to use based on currentTool value
	ramp_array: string[] = [this.horizontal_ramp, this.vertical_ramp, this.diagonal1_ramp, this.diagonal2_ramp];

	water: string = "W";
	water_tile: string = "W";
	impassable: string = "X";
	unbuildable: string = "Y";
	
	// Add Water function to tile
	addWater(tile: string) {
		let value = tile.toString();
		return value + this.water;
	}

	// Remove Water function from tile
	removeWater(tile: string) {
		return tile.replace(this.water, "");
	}

	// Check if the tile has water
	checkWater(tile: string) {
		let value = tile.toString();
		return (value.includes(this.water));
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

	checkBase(tile: string) {
		return tile.substring(0, 1);
	}
}