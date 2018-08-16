// todo set tile container to invisible if offscreen

import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';

import * as PIXI from 'pixi.js';
import { Map } from './../../game/data/map';
import { Tile } from './../../game/data/tile';

import { MapeditorService } from './../services/mapeditor.service';

// Aliases
	let Application = PIXI.Application,
	Container = PIXI.Container,
	Graphics = PIXI.Graphics,
	loader = PIXI.loader,
    resources = PIXI.loader.resources,
    Texture = PIXI.Texture,
    Sprite = PIXI.Sprite,
    Text = PIXI.Text;

@Component({
	selector: 'app-mapeditor',
	templateUrl: './mapeditor.component.html',
	styleUrls: ['./mapeditor.component.css']
})

export class MapEditorComponent implements OnInit {

// Map Editor Modes
	blueprint_mode: boolean = true;
	render_mode: boolean = false;

// Request Change Dimensions
	dimension_change: FormGroup;
	height_change: FormControl;
	width_change: FormControl;

// Canvas Parameters
	canvas: PIXI.Application;
	private RENDERER_WIDTH: number = 1620;
	private RENDERER_HEIGHT: number = 833;

// Map Container
	container_left: PIXI.Container;
	container_right: PIXI.Container;
	blueprint_container: PIXI.Container;
	RENDER_SCALE: number; // Width and height of maptile
	LEFT_COLOUR: number = 0xb2b2ff; // Left container colour
	RIGHT_COLOUR: number = 0x0000ff; // Right container colour
	CONTAINER_LEFT_WIDTH: number = 700;
	CONTAINER_RIGHT_WIDTH: number = this.RENDERER_WIDTH - this.CONTAINER_LEFT_WIDTH;

// Map Tile Textures for sprite generation for maptile and example boxes

	// Height
	height_0_texture: PIXI.Texture;
	height_1_texture: PIXI.Texture;
	height_2_texture: PIXI.Texture;
	height_3_texture: PIXI.Texture;
	height_texture_array = [this.height_0_texture, this.height_1_texture, this.height_2_texture, this.height_3_texture];

	// Ramp
	all_ramps_texture: PIXI.BaseTexture;
	ramp_horizontal_texture: PIXI.Texture;
	ramp_vertical_texture: PIXI.Texture;
	ramp_diagonal1_texture: PIXI.Texture;
	ramp_diagonal2_texture: PIXI.Texture;
	ramp_texture_array: PIXI.Texture[] = [this.ramp_horizontal_texture, this.ramp_vertical_texture, this.ramp_diagonal1_texture, this.ramp_diagonal2_texture];

	// Water
	water_texture: PIXI.Texture;

	// Other
	no_passing_texture: PIXI.Texture;
	no_building_texture: PIXI.Texture;
	other_texture_array: PIXI.Texture[];

	// Directories
	ramp_dir = "./../../assets/mapeditor/editorAssets.png";
	water_dir = "./../../assets/mapeditor/water.png";
	no_passing_dir = "./../../assets/mapeditor/noWalking.png";
	no_building_dir = "./../../assets/mapeditor/noBuilding.png";

// Draw Option Containers, Text, Textstyle, Highlightborder Parameters, Example Box Parameters

	// Height
	height_0_container: PIXI.Container;
	height_1_container: PIXI.Container;
	height_2_container: PIXI.Container;
	height_3_container: PIXI.Container;
	height_container_array: PIXI.Container[] = [this.height_0_container, this.height_1_container, this.height_2_container, this.height_3_container];
	height_0_text: PIXI.Text;
	height_1_text: PIXI.Text;
	height_2_text: PIXI.Text;
	height_3_text: PIXI.Text;
	height_text_array = [this.height_0_text, this.height_1_text, this.height_2_text, this.height_3_text];
	
	// Ramps
	ramp_horizontal_container: PIXI.Container;
	ramp_vertical_container: PIXI.Container;
	ramp_diagonal1_container: PIXI.Container;
	ramp_diagonal2_container: PIXI.Container;
	ramp_container_array: PIXI.Container[] = [this.ramp_horizontal_container, this.ramp_vertical_container, this.ramp_diagonal1_container, this.ramp_diagonal2_container];
	ramp_text: string[] = ["Horizontal", "Vertical", "Diagonal", "Diagonal"];
	ramp_horizontal_text: PIXI.Text;
	ramp_vertical_text: PIXI.Text;
	ramp_diagonal1_text: PIXI.Text;
	ramp_diagonal2_text: PIXI.Text;
	ramp_text_array: PIXI.Text[] = [this.ramp_horizontal_text, this.ramp_vertical_text, this.ramp_diagonal1_text, this.ramp_diagonal2_text];

	// Other
	water_container: PIXI.Container;
	water_text: string = "Water Tile";
	water_pixitext: PIXI.Text;

	no_passing_container: PIXI.Container;
	no_building_container: PIXI.Container;
	other_container_array: PIXI.Container[] = [this.no_passing_container, this.no_building_container];
	no_passing_text: string = "Impassable";
	no_building_text: string = "No Building";
	other_text: string[] = [this.no_passing_text, this.no_building_text];
	no_passing_pixitext: PIXI.Text;
	no_building_pixitext: PIXI.Text;
	other_text_array: PIXI.Text[] = [this.no_passing_pixitext, this.no_building_pixitext];

	// Text Style for Text
	textstyle = new PIXI.TextStyle({
		fontFamily: "Arial",
		fontSize: 36
	});

	// Highlight Border parameters
	HIGHLIGHT_BORDER_COLOUR: number = 0xffff00;
	HIGHLIGHT_BORDER_LINE_WIDTH: number = 4;

	// Example Box Parameters
	EXAMPLE_BOX_WIDTH: number = 50;
	EXAMPLE_BOX_HEIGHT: number = 50;

// Blueprint Mode Parameters
	Blueprint = {
		TILE_BORDER_COLOUR: 0x000000, // Black
		TILE_COLOURS: [0x0088FF, 0x006DCC, 0x0A00CC, 0x05006B], // 0 -> 3 Lighter shade of blue to darker
		tileContainers: [], // PIXI.Container to contain sprite
		currentTool: {
			category: "",
			value: 0
		},
		selected: false // Whether mouse down is sustained to keep drawing while mouse moving
	}

// Tiles Array and Map Object
	Tile: Tile = new Tile();
	
// Zoom and Scroll Factor
	ZOOM_FACTOR: number = 0.05;
	SCROLL_FACTOR: number = 30;

// Inputs (left right down up)
	left;
	right;
	down;
	up;

// PIXI Interaction Manager
	camera: PIXI.interaction.InteractionManager;

	constructor(private mapEditorService: MapeditorService) {
	}

	ngOnInit() {
		this.createFormDimension();
		this.pixiLoaderInit();
		this.generateMap();
	}

// Initialize PIXI.loader and assign textures to images
	pixiLoaderInit() {
		let setup = () => {

		}

		loader
			.add([this.ramp_dir, this.water_dir, this.no_passing_dir, this.no_building_dir])
			.load(setup)
			.on("complete", (loader, resources) => {
			this.generatePixiCanvas();
			this.generateMapTextures();
			this.generateContainer();
			this.addBlueprintInputs();

		})
	
	}

// Create Form Control and Group for Dimension Change
	private createFormDimension() {
		this.height_change = new FormControl('', {validators: [Validators.required, Validators.pattern(/^[0-9]*$/)]});
		this.width_change = new FormControl('', {validators: [Validators.required, Validators.pattern(/^[0-9]*$/)]});
		this.dimension_change = new FormGroup({
			'height_change': this.height_change,
			'width_change': this.width_change
		})
	}

// Editor Functionalities
	private requestChangeDimensions() {
		console.log(this.height_change.value);
		console.log(this.width_change.value);
	}
// isnumber
	private isNumber(event) {
		if (isNaN(event)) {
			return false;
		}
		// var charCode = (event.which) ? event.which : event.keyCode;
  //  			if (charCode > 31 && (charCode < 48 || charCode > 57)) {
  //       		return false;
  //  			}
  // 		return true;
  		// console.log(event);
	}

// Initializes the default map (may retrieve saved map from cache if previously there) and Render Scale
	private generateMap() {
		// If map is already generated, don't generate new and use existing map
		if (this.mapEditorService.newMap) {
			this.mapEditorService.generateDefaultMap();
		}
		

		// Determines the scale of how big the tiles should be depending on map height/width
		let scaleX = (this.RENDERER_WIDTH - 200) / this.mapEditorService.width;
		let scaleY = (this.RENDERER_HEIGHT- 20) / this.mapEditorService.height;
		this.RENDER_SCALE = Math.min(scaleX, scaleY);
	}

// Initializes and generates the canvas for the Map Editor, and initializes Interaction Manager
	private generatePixiCanvas() {
		this.canvas = new Application({
			width: this.RENDERER_WIDTH, 
			height: this.RENDERER_HEIGHT,
			antialias: true,    // default: false
    		transparent: true, // default: false
   			resolution: 1,       // default: 1
   			// backgroundColor: 0x1099bb, // lightblue
   			forceFXAA: true
		});
		this.canvas.renderer.view.style.width = "100%";
		this.canvas.renderer.view.style.height = "100%";
		this.canvas.renderer.view.style.border = "1px solid black";
		this.canvas.stage.interactive = true;
		document.getElementById('pixi-canvas').appendChild(this.canvas.view);

		// this.camera = new PIXI.interaction.InteractionManager(this.canvas.renderer);
	}	

// Sets up a container for the Map Tileset and Blueprint container
	private generateContainer() {
		// Connects stage to appropriate containers with childs
		this.container_left = new Container();
		this.container_right = new Container();
		this.blueprint_container = new Container();
		this.container_right.addChild(this.blueprint_container);
		this.canvas.stage.addChild(this.container_right);
		this.canvas.stage.addChild(this.container_left);

		// Adds a rectangle graphic on the left container
		let texture_left  = new Graphics();
		texture_left.lineStyle(1, this.Blueprint.TILE_BORDER_COLOUR, 1);
		texture_left.beginFill(this.LEFT_COLOUR);
		texture_left.drawRect(0, 0, this.CONTAINER_LEFT_WIDTH, this.RENDERER_HEIGHT);
		texture_left.endFill();
		this.container_left.addChild(texture_left);

		// Adds a rectangle graphic on the right container
		let texture_right = new Graphics();
		texture_right.lineStyle(1, this.Blueprint.TILE_BORDER_COLOUR, 1);
		texture_right.beginFill(this.RIGHT_COLOUR);
		texture_right.drawRect(this.CONTAINER_LEFT_WIDTH, 0, this.CONTAINER_RIGHT_WIDTH, this.RENDERER_HEIGHT);
		texture_right.endFill();
		this.container_right.addChild(texture_right);
		// Change index of the blueprint container to be on top
		this.container_right.setChildIndex(this.blueprint_container, 1);
	
		this.renderBlueprintMap();
		this.renderDrawOptions();

		// Aligns Blueprint Container in the centre of the right container
		this.blueprint_container.position.x = (this.container_right.width - 100) / 2;
		this.blueprint_container.position.y = (this.container_right.height - this.blueprint_container.height) / 2;

	}

// Generate MapTile texture for sprite generation for rendering the MapTiles
// Requires Render Scale for MapTile Sizing
	private generateMapTextures() {
		let texture0, texture1, texture2, texture3;
		let textureArray = [texture0, texture1, texture2, texture3];

		for (let i = 0; i < textureArray.length; i++) {
			textureArray[i] = new Graphics();
			textureArray[i].lineStyle(1, this.Blueprint.TILE_BORDER_COLOUR, 1);
			textureArray[i].beginFill(this.Blueprint.TILE_COLOURS[i]);
			textureArray[i].drawRect(0, 0, this.RENDER_SCALE, this.RENDER_SCALE);
			textureArray[i].endFill();
			this.height_texture_array[i] = this.canvas.renderer.generateTexture(textureArray[i])
		}

		this.all_ramps_texture = resources[this.ramp_dir].texture.baseTexture;
		for (let i = 0; i < this.ramp_container_array.length; i++) {

			let rectangle = new PIXI.Rectangle(i * 100, 0, 100, 100);
			this.ramp_texture_array[i] = new PIXI.Texture(this.all_ramps_texture, rectangle);
		}

		this.water_texture = resources[this.water_dir].texture;
		this.no_passing_texture = resources[this.no_passing_dir].texture;
		this.no_building_texture = resources[this.no_building_dir].texture;
		this.other_texture_array = [this.no_passing_texture, this.no_building_texture];
	}

// Change rendering to encompass all different tiles, not just height

// Render blueprint map /
	private renderBlueprintMap() {
		// Attaches a container and sprite to each tile in Blueprint and Renders
		for (let x = 0; x < this.mapEditorService.width; x++) {
			this.Blueprint.tileContainers.push([]);
			for (let y = 0; y < this.mapEditorService.height; y++) {
				this.Blueprint.tileContainers[x].push(new Container());
				this.Blueprint.tileContainers[x][y].x = x * this.RENDER_SCALE;
				this.Blueprint.tileContainers[x][y].y = y * this.RENDER_SCALE;

				let mapTileValue = Number(this.mapEditorService.tiles[x][y]);
				let sprite = new Sprite(this.height_texture_array[mapTileValue]);
				this.addTileInteraction(sprite, x, y);

				this.Blueprint.tileContainers[x][y].addChild(sprite);

				this.blueprint_container.addChild(this.Blueprint.tileContainers[x][y]);
			}
		};
	}

// Draw options (On Left Container)
	private renderDrawOptions() {
		// Distance from left side of the screen
		let width_from_left_first_list = 50;
		let width_from_left_second_list = 350;
		let height_from_top_first = 100;
		let height_from_top_second = 400;
		let height_from_top_third = 600;

		let text_distance_from_box = 70;

		// Draws the example height boxes and appends them to individual containers
		let drawHeightExample = () => {
			for (let i = 0; i < this.height_container_array.length; i++) {
				this.height_container_array[i] = new Container();
				this.height_container_array[i].x = width_from_left_first_list;
				this.height_container_array[i].y = (i * 70) + height_from_top_first;

				let exampleBoxSprite = new Sprite(this.height_texture_array[i]);
				exampleBoxSprite.width = this.EXAMPLE_BOX_WIDTH;
				exampleBoxSprite.height = this.EXAMPLE_BOX_HEIGHT;
				this.height_container_array[i].addChild(exampleBoxSprite);
				this.container_left.addChild(this.height_container_array[i]);

				// Enable Interactive on each Box to designate current Tool on Blueprint
				exampleBoxSprite.interactive = true;
				exampleBoxSprite.on("mousedown", (event) => {
					this.currentTool({
						category: "Height", 
						value: i
					});
				})

				// Draws Height Info
				this.height_text_array[i] = new Text("Height " + i, this.textstyle);
				this.height_text_array[i].position.set(text_distance_from_box, 0);
				this.height_container_array[i].addChild(this.height_text_array[i]);
			}
		}
		
		// Draws the example ramp boxes and appends them to the containers
		let drawRampExample = () => {
			for (let i = 0; i < this.ramp_container_array.length; i++) {
				this.ramp_container_array[i] = new Container();
				this.ramp_container_array[i].x = width_from_left_second_list;
				this.ramp_container_array[i].y = (i * 70) + height_from_top_first;

				let exampleRampSprite = new Sprite(this.ramp_texture_array[i]);
				exampleRampSprite.width = this.EXAMPLE_BOX_WIDTH;
				exampleRampSprite.height = this.EXAMPLE_BOX_HEIGHT;
				this.ramp_container_array[i].addChild(exampleRampSprite);
				this.container_left.addChild(this.ramp_container_array[i]);

				exampleRampSprite.interactive = true;
				exampleRampSprite.on("mousedown", (event) => {
					this.currentTool({
						category: "Ramp",
						value: i
					});
				})

				// Draws Ramp Info
				this.ramp_text_array[i] = new Text(this.ramp_text[i] + " Ramp", this.textstyle);
				this.ramp_text_array[i].position.set(text_distance_from_box, 0);
				this.ramp_container_array[i].addChild(this.ramp_text_array[i]);
			}
		}
		
		// Draws the example water box and appends it to the container
		let drawWaterExample = () => {
			this.water_container = new Container();
			this.water_container.x = width_from_left_first_list;
			this.water_container.y = height_from_top_second;

			let exampleWaterSprite = new Sprite(this.water_texture);
			exampleWaterSprite.width = this.EXAMPLE_BOX_WIDTH;
			exampleWaterSprite.height = this.EXAMPLE_BOX_HEIGHT;

			this.water_container.addChild(exampleWaterSprite);
			this.container_left.addChild(this.water_container);

			// Enable Interactive on Water Box to designate current Tool on Blueprint
			exampleWaterSprite.interactive = true;
			exampleWaterSprite.on("mousedown", (event) => {
				this.currentTool({
					category: "Water", 
					value: 0
				});
			})

			// Draws Water Info
			this.water_pixitext = new Text(this.water_text, this.textstyle);
			this.water_pixitext.position.set(text_distance_from_box, 0);
			this.water_container.addChild(this.water_pixitext);
		}

		// Draws the example function boxes and appends it to the container
		let drawFunctionExample = () => {
			for (let i = 0; i < this.other_container_array.length; i++) {
				this.other_container_array[i] = new Container();
				this.other_container_array[i].x = width_from_left_second_list;
				this.other_container_array[i].y = (i * 70) + height_from_top_second;

				let exampleOtherSprite = new Sprite(this.other_texture_array[i]);
				exampleOtherSprite.width = this.EXAMPLE_BOX_WIDTH;
				exampleOtherSprite.height = this.EXAMPLE_BOX_HEIGHT;

				this.other_container_array[i].addChild(exampleOtherSprite);
				this.container_left.addChild(this.other_container_array[i]);

				// Enable Interactive on Other Box to designate current Tool on Blueprint
				exampleOtherSprite.interactive = true;
				exampleOtherSprite.on("mousedown", (event) => {
					this.currentTool({
						category: "Other", 
						value: i
					});
				})

				// Draws Function Info
				this.other_text_array[i] = new Text(this.other_text[i], this.textstyle);
				this.other_text_array[i].position.set(text_distance_from_box, 0);
				this.other_container_array[i].addChild(this.other_text_array[i]);
			}
		}
		drawHeightExample();
		drawRampExample();
		drawWaterExample();
		drawFunctionExample();
	}

// Designate Current Tool
	private currentTool(data) {
		// Adds Yellow Border around the current Tool
		let highlightTool = (data) => {
			let highlightBorder = new Graphics();
			highlightBorder.lineStyle(this.HIGHLIGHT_BORDER_LINE_WIDTH, this.HIGHLIGHT_BORDER_COLOUR, 1);

			switch (data.category) {
				case "Height":
					highlightBorder.drawRect(0, 0, this.height_container_array[data.value].width, this.height_container_array[data.value].height);
					this.height_container_array[data.value].addChild(highlightBorder);
					break;
				case "Ramp":
				// West = 0, East = 1, North = 2, South = 3
					highlightBorder.drawRect(0, 0, this.ramp_container_array[data.value].width, this.ramp_container_array[data.value].height);
					this.ramp_container_array[data.value].addChild(highlightBorder);
					break;
				case "Water":
					highlightBorder.drawRect(0, 0, this.water_container.width, this.water_container.height);
					this.water_container.addChild(highlightBorder);
					break;
				case "Other":
					highlightBorder.drawRect(0, 0, this.other_container_array[data.value].width, this.other_container_array[data.value].height);
					this.other_container_array[data.value].addChild(highlightBorder);
					break;
			}
		}

		// Removes the most recent child (border) in the container when current Tool is changed
		let removeHighlightTool = (data) => {
			switch (data.category) {
				case "Height":
					let heightChildrenLength = this.height_container_array[data.value].children.length;
					this.height_container_array[data.value].removeChildAt(heightChildrenLength - 1);
					break;
				case "Ramp":
					let rampChildrenLength = this.ramp_container_array[data.value].children.length;
					this.ramp_container_array[data.value].removeChildAt(rampChildrenLength - 1);
					break;
				case "Water":
					let waterChildrenLength = this.water_container.children.length;
					this.water_container.removeChildAt(waterChildrenLength - 1);
					break;
				case "Other":
					let otherChildrenLength = this.other_container_array[data.value].children.length;
					this.other_container_array[data.value].removeChildAt(otherChildrenLength - 1);
			}
		}

		// Highlights selected current tool
		if (this.Blueprint.currentTool.category == "") {
			this.Blueprint.currentTool = data;
			highlightTool(data);
		// Removes highlight tool if same tool is selected again
		} else if (this.Blueprint.currentTool.category == data.category && this.Blueprint.currentTool.value == data.value) {
			removeHighlightTool(data);
			this.Blueprint.currentTool = {category: "", value: 0};
		// If other tool selected, remove highlight of previous tool and add new highlight
		} else {
			removeHighlightTool(this.Blueprint.currentTool);
			this.Blueprint.currentTool = data;
			highlightTool(data);
		}
	}

// Changes the maptile sprite to a new sprite if a current tool is designated (need to enable selection if no tool selected?)
	private changeTile(x, y) {
		if (this.Blueprint.currentTool.category === "") {

		} else {
			switch (this.Blueprint.currentTool.category) {
				// Height case
				case "Height":
					// New height value
					let newHeight = this.Blueprint.currentTool.value.toString();

					// Checks if the current tile is already the same height
					if (!(this.Tile.contains(this.mapEditorService.tiles[x][y], newHeight))) {
						// Removes the sprite tile
						this.Blueprint.tileContainers[x][y].removeChildAt(0);

						// Creates new sprite out of height value
						let heightSprite = new Sprite(this.height_texture_array[newHeight]);
						// Add tile interaction with new sprite
						this.addTileInteraction(heightSprite, x, y);
						// Add sprite to the tile container
						this.Blueprint.tileContainers[x][y].addChildAt(heightSprite, 0);
						// Update tile array with new height
						this.mapEditorService.tiles[x][y] = this.Tile.changeBase(this.mapEditorService.tiles[x][y], newHeight);
					}
					break;
				// Ramp Case
				case "Ramp":
					// New Ramp value (Horizontal = 0, Vertical = 1, Diagonal1 = 2, Diagonal2 = 3)
					let newRamp = this.Blueprint.currentTool.value;

					let newRampString = this.Tile.getRampArray()[newRamp];

					// Checks if the current tile is already the same ramp
					if (!(this.Tile.contains(this.mapEditorService.tiles[x][y], newRampString))) {
						// Removes the sprite tile
						this.Blueprint.tileContainers[x][y].removeChildAt(0);

						// Creates new sprite out of ramp value
						let rampSprite = new Sprite(this.ramp_texture_array[newRamp]);
						rampSprite.width = this.RENDER_SCALE;
						rampSprite.height = this.RENDER_SCALE;

						// Add tile interaction with new sprite
						this.addTileInteraction(rampSprite, x, y);
						// Add sprite to the tile container
						this.Blueprint.tileContainers[x][y].addChildAt(rampSprite, 0);
						// Update tile array with new height
						this.mapEditorService.tiles[x][y] = this.Tile.changeBase(this.mapEditorService.tiles[x][y], newRampString);
					}
					break;
				// Water Case
				case "Water":
					let waterTile = this.Tile.getWaterTile();

					// Checks if the current tile is already water
					if (!(this.Tile.contains(this.mapEditorService.tiles[x][y], waterTile))) {
						// Removes the sprite tile
						this.Blueprint.tileContainers[x][y].removeChildAt(0);

						// Create new water sprite
						let waterSprite = new Sprite(this.water_texture);
						waterSprite.width = this.RENDER_SCALE;
						waterSprite.height = this.RENDER_SCALE;

						// Add tile interaction with new sprite
						this.addTileInteraction(waterSprite, x, y);
						// Add sprite to the tile container
						this.Blueprint.tileContainers[x][y].addChildAt(waterSprite, 0);
						// Update tile array with water tile
						this.mapEditorService.tiles[x][y] = this.Tile.changeBase(this.mapEditorService.tiles[x][y], waterTile);
						break;
					}
				// Other (Functions) Case
				case "Other":
					let currentTile = this.mapEditorService.tiles[x][y];
					// Different cases (0 = Impassable, 1 = Unbuildable) 
					// Impassable case
					if (this.Blueprint.currentTool.value == 0) {
						if (this.Tile.checkImpassable(currentTile)) {
							this.mapEditorService.tiles[x][y] = this.Tile.removeImpassable(currentTile);

							this.Blueprint.tileContainers[x][y].removeChildAt(1);
						} else {
							this.mapEditorService.tiles[x][y] = this.Tile.addImpassable(currentTile);

							let impassableSprite = new Sprite(this.no_passing_texture);
							impassableSprite.width = this.RENDER_SCALE / 2;
							impassableSprite.height = this.RENDER_SCALE / 2;

							// Always add sprite at index of 1
							this.Blueprint.tileContainers[x][y].addChildAt(impassableSprite, 1);

						}
					// Unbuildable case
					} else if (this.Blueprint.currentTool.value == 1) {
						if (this.Tile.checkUnbuildable(currentTile)) {
							this.mapEditorService.tiles[x][y] = this.Tile.removeUnbuildable(currentTile);

							// Ensures that the last sprite is always removed
							if (this.Blueprint.tileContainers[x][y].children.length == 3) {
								this.Blueprint.tileContainers[x][y].removeChildAt(2);
							} else if (this.Blueprint.tileContainers[x][y].children.length == 2){
								this.Blueprint.tileContainers[x][y].removeChildAt(1);
							}
						} else {
							this.mapEditorService.tiles[x][y] = this.Tile.addUnbuildable(currentTile);

							let unbuildableSprite = new Sprite(this.no_building_texture);
							unbuildableSprite.width = this.RENDER_SCALE / 2;
							unbuildableSprite.height = this.RENDER_SCALE / 2;
							unbuildableSprite.position.set(this.RENDER_SCALE / 2, this.RENDER_SCALE / 2);

							// Ensures that sprite is always added at the last index
							if (this.Blueprint.tileContainers[x][y].children.length == 1) {
								this.Blueprint.tileContainers[x][y].addChildAt(unbuildableSprite, 1);
							} else if (this.Blueprint.tileContainers[x][y].children.length == 2) {
								this.Blueprint.tileContainers[x][y].addChildAt(unbuildableSprite, 2);
							}
						}
					}
					break;
			}
		}
	}

// Adds interactiveness and mouse listeners to the map tile whenever sprite is generated
	private addTileInteraction(sprite, x, y) {
		sprite.interactive = true;
		sprite.on("mousedown", (event) => {
			this.Blueprint.selected = true;
			this.changeTile(x, y);
		});
		sprite.on("mouseup", (event) => {
			this.Blueprint.selected = false;
		})
		sprite.on("mouseover", (event) => {
			if (this.Blueprint.selected) {
				this.changeTile(x, y);
			}	
		});
		
	}



// Function called when component is destroyed
	ngOnDestroy() {
		this.removeBlueprintInputs();
		
	}

//
// 
// ** Inputs **//
//
//

// Add Event Listeners for Interaction with the Editor
	private addBlueprintInputs() {
		// Mousewheel Event Listener
		document.getElementById('pixi-canvas').addEventListener("wheel", (event) => {
			this.mouseWheelHandler(event);
		}, {capture: false})

		// Keydown Event Listener
		window.addEventListener("keydown", (event) => {
			this.moveBlueprintMap(event);
		}, {capture: false});
	}

// Mouse wheel handler for zoom in and out of the container
	private mouseWheelHandler(event: WheelEvent) {
		let direction = event.deltaY < 0 ? 1 : -1;
		let factor = (1 + direction * this.ZOOM_FACTOR);
		this.blueprint_container.scale.x = Math.round(this.blueprint_container.scale.x * factor * 100) / 100;
		this.blueprint_container.scale.y = Math.round(this.blueprint_container.scale.y * factor * 100) / 100;
	}

// Moves blueprint map around canvas bounds
	private moveBlueprintMap(event) {
		// Left key pressed
		if (event.keyCode == "37") {
			if (this.blueprint_container.getBounds().x > 600) {
				this.blueprint_container.position.x -= this.SCROLL_FACTOR;
			}
		}
		// Up key pressed
		if (event.keyCode == "38") {
			if (this.blueprint_container.getBounds().y > -200) {
				this.blueprint_container.position.y -= this.SCROLL_FACTOR;
			}
		}
		// Right key pressed
		if (event.keyCode == "39") {
			if (this.blueprint_container.getBounds().x < 1000) {
				this.blueprint_container.position.x += this.SCROLL_FACTOR;
			}
		}
		// Down key pressed
		if (event.keyCode == "40") {
			if (this.blueprint_container.getBounds().y < this.RENDERER_HEIGHT - 600) {
				this.blueprint_container.position.y += this.SCROLL_FACTOR;
			}
		}
	}

	// Remove Event Listeners
	private removeBlueprintInputs() {
		document.getElementById('pixi-canvas').removeEventListener("wheel", this.mouseWheelHandler);
		window.removeEventListener("keydown", this.moveBlueprintMap);
	}

}
