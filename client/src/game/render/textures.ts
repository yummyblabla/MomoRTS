import * as PIXI from 'pixi.js';

export class Textures {

// Blueprint Assets
	// Height
	height_0: PIXI.Texture;
	height_1: PIXI.Texture;
	height_2: PIXI.Texture;
	height_3: PIXI.Texture;
	height_array: PIXI.Texture[];

	// Ramps
	ramp_horizontal: PIXI.Texture;
	ramp_vertical: PIXI.Texture;
	ramp_diagonal1: PIXI.Texture;
	ramp_diagonal2: PIXI.Texture;
	ramp_array: PIXI.Texture[];

	// Other
	water: PIXI.Texture;

	// Functions
	impassable: PIXI.Texture;
	unbuildable: PIXI.Texture;
	function_array: PIXI.Texture[];

// Tileset Assets
	tile_1: PIXI.Texture; // Default Height 0 tile
	tile_2: PIXI.Texture; // Null Height tile
	tile_3: PIXI.Texture; // Corner (NW)
	tile_4: PIXI.Texture; // Top Edge
	tile_5: PIXI.Texture; // Corner (NE)
	tile_6: PIXI.Texture; // Right Edge
	tile_7: PIXI.Texture; // Corner (SE)
	tile_8: PIXI.Texture; // Down Edge
	tile_9: PIXI.Texture; // Corner (SW)
	tile_10: PIXI.Texture; // Left Edge
	tile_11: PIXI.Texture; // Inverse (SE)
	tile_12: PIXI.Texture; // Inverse (SW)
	tile_13: PIXI.Texture; // Inverse (NW)
	tile_14: PIXI.Texture; // Inverse (NE)
	tile_15: PIXI.Texture; // N -> S Ramp
	tile_16: PIXI.Texture; // W -> E Ramp
	tile_17: PIXI.Texture; // E -> W Ramp
	tile_18: PIXI.Texture; // S -> N Ramp
	tile_19: PIXI.Texture; // Diagonal2 Ramp (SW -> NE)
	tile_20: PIXI.Texture; // Diagonal2 Ramp (NE -> SW)
	tile_21: PIXI.Texture; // Diagonal1 Ramp (SE -> NW)
	tile_22: PIXI.Texture; // Diagonal1 Ramp (NW -> SE)



	generateBlueprintTextures(tileset: PIXI.BaseTexture) {
		this.height_0 = new PIXI.Texture(tileset, new PIXI.Rectangle(0, 100, 100, 100));
		this.height_1 = new PIXI.Texture(tileset, new PIXI.Rectangle(100, 100, 100, 100));
		this.height_2 = new PIXI.Texture(tileset, new PIXI.Rectangle(200, 100, 100, 100));
		this.height_3 = new PIXI.Texture(tileset, new PIXI.Rectangle(300, 100, 100, 100));
		this.height_array = [this.height_0, this.height_1, this.height_2, this.height_3];

		this.ramp_horizontal = new PIXI.Texture(tileset, new PIXI.Rectangle(0, 0, 100, 100));
		this.ramp_vertical = new PIXI.Texture(tileset, new PIXI.Rectangle(100, 0, 100, 100));
		this.ramp_diagonal1 = new PIXI.Texture(tileset, new PIXI.Rectangle(200, 0, 100, 100));
		this.ramp_diagonal2 = new PIXI.Texture(tileset, new PIXI.Rectangle(300, 0, 100, 100));
		this.ramp_array = [this.ramp_horizontal, this.ramp_vertical, this.ramp_diagonal1, this.ramp_diagonal2];

		this.water = new PIXI.Texture(tileset, new PIXI.Rectangle(0, 200, 100, 100));

		this.impassable = new PIXI.Texture(tileset, new PIXI.Rectangle(200, 200, 100, 100));
		this.unbuildable = new PIXI.Texture(tileset, new PIXI.Rectangle(100, 200, 100, 100));
		this.function_array = [this.water, this.impassable, this.unbuildable];

	}
	generateRenderTextures(tileset: PIXI.BaseTexture) {
		this.tile_1 = new PIXI.Texture(tileset, new PIXI.Rectangle(0, 0, 50, 50));
		this.tile_2 = new PIXI.Texture(tileset, new PIXI.Rectangle(0, 50, 50, 50));
		this.tile_3 = new PIXI.Texture(tileset, new PIXI.Rectangle(50, 0, 50, 50));
		this.tile_4 = new PIXI.Texture(tileset, new PIXI.Rectangle(100, 0, 50, 50));
		this.tile_5 = new PIXI.Texture(tileset, new PIXI.Rectangle(150, 0, 50, 50));
		this.tile_6 = new PIXI.Texture(tileset, new PIXI.Rectangle(150, 50, 50, 50));
		this.tile_7 = new PIXI.Texture(tileset, new PIXI.Rectangle(150, 100, 50, 50));
		this.tile_8 = new PIXI.Texture(tileset, new PIXI.Rectangle(100, 100, 50, 50));
		this.tile_9 = new PIXI.Texture(tileset, new PIXI.Rectangle(50, 100, 50, 50));
		this.tile_10 = new PIXI.Texture(tileset, new PIXI.Rectangle(50, 50, 50, 50));

		this.tile_11 = new PIXI.Texture(tileset, new PIXI.Rectangle(200, 0, 50, 50));
		this.tile_12 = new PIXI.Texture(tileset, new PIXI.Rectangle(250, 0, 50, 50));
		this.tile_13 = new PIXI.Texture(tileset, new PIXI.Rectangle(250, 50, 50, 50));
		this.tile_14 = new PIXI.Texture(tileset, new PIXI.Rectangle(200, 50, 50, 50));

		this.tile_15 = new PIXI.Texture(tileset, new PIXI.Rectangle(200, 100, 50, 50));
		this.tile_16 = new PIXI.Texture(tileset, new PIXI.Rectangle(250, 100, 50, 50));
		this.tile_17 = new PIXI.Texture(tileset, new PIXI.Rectangle(300, 100, 50, 50));
		this.tile_18 = new PIXI.Texture(tileset, new PIXI.Rectangle(350, 100, 50, 50));

		this.tile_19 = new PIXI.Texture(tileset, new PIXI.Rectangle(300, 50, 50, 50));
		this.tile_20 = new PIXI.Texture(tileset, new PIXI.Rectangle(300, 0, 50, 50));
		this.tile_21 = new PIXI.Texture(tileset, new PIXI.Rectangle(350, 50, 50, 50));
		this.tile_22 = new PIXI.Texture(tileset, new PIXI.Rectangle(350, 0, 50, 50));


	}

	
}