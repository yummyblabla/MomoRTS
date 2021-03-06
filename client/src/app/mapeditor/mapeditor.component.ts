// todo set tile container to invisible if offscreen
// add mouseleave for blueprint container to turn off selected boolean

import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';

import * as PIXI from 'pixi.js';
import { Map } from './../../game/data/map';
import { Tile } from './../../game/data/tile';

import { Subject } from 'rxjs';

import { MapeditorService } from './../services/mapeditor.service';

// Aliases
	let Application = PIXI.Application,
	Container = PIXI.Container,
	Graphics = PIXI.Graphics,
	loader = PIXI.loader,
    resources = PIXI.loader.resources,
    Sprite = PIXI.Sprite,
    Text = PIXI.Text;

@Component({
	selector: 'app-mapeditor',
	templateUrl: './mapeditor.component.html',
	styleUrls: ['./mapeditor.component.css']
})

export class MapEditorComponent implements OnInit {

// Map Editor Modes (Always start in blueprint mode)
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
	rendered_map_container: PIXI.Container;
	blueprint_container: PIXI.Container;
	RENDER_SCALE: number; // Width and height of maptile
	LEFT_COLOUR: number = 0xb2b2ff; // Left container colour
	RIGHT_COLOUR: number = 0x0000ff; // Right container colour
	CONTAINER_LEFT_WIDTH: number = 700;
	CONTAINER_RIGHT_WIDTH: number = 920;
	// this.RENDERER_WIDTH - this.CONTAINER_LEFT_WIDTH;

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
	no_passing_container: PIXI.Container;
	no_building_container: PIXI.Container;
	other_container_array: PIXI.Container[] = [this.water_container, this.no_passing_container, this.no_building_container];
	water_text: string = "Water Tile (0)";
	no_passing_text: string = "Impassable";
	no_building_text: string = "No Building";
	other_text: string[] = [this.water_text, this.no_passing_text, this.no_building_text];
	water_pixitext: PIXI.Text;
	no_passing_pixitext: PIXI.Text;
	no_building_pixitext: PIXI.Text;
	other_text_array: PIXI.Text[] = [this.water_pixitext, this.no_passing_pixitext, this.no_building_pixitext];

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
		tileContainers: [], // PIXI.Containers to contain sprite
		currentTool: {category: "", value: 0},
		selected: false // Whether mouse down is sustained to keep drawing while mouse moving
	}

// Other Classes to be called
	Tile: Tile;
	
// Zoom and Scroll Factor
	ZOOM_FACTOR: number = 0.05;
	SCROLL_FACTOR: number = 30;

// PIXI Interaction Manager
	camera: PIXI.interaction.InteractionManager;
	// Mouse position
	mousePos = null;

// RXJS Subject from mapEditorService
	pixiloading;

	constructor(private mapEditorService: MapeditorService) {
		this.Tile = new Tile();
	}

	ngOnInit() {
		this.createFormDimension();
		this.pixiloading = this.mapEditorService.pixiloading.subscribe(event => {
			if (event) {
				this.generatePixiCanvas();
				this.generateContainers();
				this.renderDrawOptions();
				this.renderBlueprintMap();
				this.addBlueprintInputs();
				// this.addResizeCanvas();
			}
		});
	}

// Go to Render Mode
	goToRenderMode() {
		console.log(new Date());
		if (this.mapEditorService.map.validateMapTiles() && !this.render_mode) {
			this.render_mode = true;
			this.blueprint_mode = false;

			this.Blueprint.currentTool = {category: "", value: 0};
			this.container_left.removeChildren(1, this.container_left.children.length);
			this.container_right.removeChildren(1, this.container_right.children.length);

			this.rendered_map_container = this.mapEditorService.getRenderMap();
			this.container_right.addChild(this.rendered_map_container);

			this.rendered_map_container.x = (this.container_right.width - 100) / 2;
			this.rendered_map_container.y = (this.container_right.height - this.rendered_map_container.height) / 2;
		}
		console.log(new Date());
	}

// Go to Blueprint Mode
	goToBlueprintMode() {
		console.log(new Date());
		if (!this.blueprint_mode) {
			this.render_mode = false;
			this.blueprint_mode = true;

			// this.container_left.removeChildren(1, this.container_left.children.length);
			this.container_right.removeChildren(1, this.container_right.children.length);

			
			this.renderDrawOptions();
			this.renderBlueprintMap();
			
			this.mapEditorService.map.validateMapTiles();
		}
		console.log(new Date());
	}

// Create Form Control and Group for Dimension Change
	private createFormDimension() {
		this.height_change = new FormControl(100, {validators: [Validators.required]});
		this.width_change = new FormControl(100, {validators: [Validators.required]});
		this.dimension_change = new FormGroup({
			'height_change': this.height_change,
			'width_change': this.width_change
		})
	}

// Changes Dimension of the Map by accessing form control
	private requestChangeDimensions() {
		let newHeight = Math.round(this.height_change.value);
		let newWidth = Math.round(this.width_change.value);

		// add confirmation if client is sure

		// Changes dimensions in MapEditorService
		if (this.mapEditorService.changeDimensions(newHeight, newWidth)) {
			// Removes all children in blueprint container (containers, sprites)
			this.blueprint_container.removeChildren(0, this.blueprint_container.children.length);
			// Empties the tile containers as it still contains the sprites
			this.Blueprint.tileContainers = [];
			// Render blueprint map
			this.renderBlueprintMap();
		}
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

		this.camera = this.canvas.renderer.plugins.interaction;
	}	

// Sets up a container for the Map Tileset and Blueprint container
	private generateContainers() {
		// Connects stage to appropriate containers with childs
		this.container_left = new Container();
		this.container_right = new Container();
		this.canvas.stage.addChild(this.container_right);
		this.canvas.stage.addChild(this.container_left);
		this.container_right.interactive = true;

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
	}

// Render blueprint map
	private renderBlueprintMap() {
		// Adds blueprint Container to the right container
		this.blueprint_container = new Container();

		this.blueprint_container.interactive = true;
		this.blueprint_container.on("mousedown", (event) => {
			if (this.Blueprint.currentTool.category == "") {
				this.mousePos = {x: event.data.global.x, y: event.data.global.y};
			}
		})
		this.blueprint_container.on("mouseup", (event) => {
			this.mousePos = null;
		})
		this.blueprint_container.on("mousemove", (event) => {
			if (this.mousePos) {
				this.blueprint_container.x += (event.data.global.x - this.mousePos.x);
				this.blueprint_container.y += (event.data.global.y - this.mousePos.y);
				this.mousePos = {x: event.data.global.x, y: event.data.global.y};
			}
		})
		this.container_right.addChild(this.blueprint_container);

		// Determines the scale of how big the tiles should be depending on map height/width
		let scaleX = (this.RENDERER_WIDTH - 200) / this.mapEditorService.width;
		let scaleY = (this.RENDERER_HEIGHT- 20) / this.mapEditorService.height;
		this.RENDER_SCALE = Math.min(scaleX, scaleY);

		this.Blueprint.tileContainers = [];
		// Attaches a container and sprite to each tile in Blueprint and Renders
		for (let x = 0; x < this.mapEditorService.width; x++) {
			this.Blueprint.tileContainers.push([]);
			for (let y = 0; y < this.mapEditorService.height; y++) {
				this.Blueprint.tileContainers[x].push(new Container());
				this.Blueprint.tileContainers[x][y].x = x * this.RENDER_SCALE;
				this.Blueprint.tileContainers[x][y].y = y * this.RENDER_SCALE;

				let currentTile = this.mapEditorService.tiles[x][y];

				// Gets base tile of the current Tile
				let baseTile = this.Tile.checkBase(currentTile);
				let sprite: PIXI.Sprite;
				switch (baseTile) {
					case this.Tile.horizontal_ramp:
						sprite = new Sprite(this.mapEditorService.Textures.ramp_horizontal);
						break;
					case this.Tile.vertical_ramp:
						sprite = new Sprite(this.mapEditorService.Textures.ramp_vertical);
						break;
					case this.Tile.diagonal1_ramp:
						sprite = new Sprite(this.mapEditorService.Textures.ramp_diagonal1);
						break;
					case this.Tile.diagonal2_ramp:
						sprite = new Sprite(this.mapEditorService.Textures.ramp_diagonal2);
						break;
					case this.Tile.water_tile:
						sprite = new Sprite(this.mapEditorService.Textures.water);
						break;
					// Will catch all the height cases
					default:
						let height = Number(baseTile);
						sprite = new Sprite(this.mapEditorService.Textures.height_array[height]);
						break;
				}
				sprite.height = this.RENDER_SCALE;
				sprite.width = this.RENDER_SCALE;
				this.addTileInteraction(sprite, x, y);
				this.Blueprint.tileContainers[x][y].addChild(sprite);

				// Adds Water Sprite
				if (this.Tile.checkWater(currentTile)) {
					let waterSprite = new Sprite(this.mapEditorService.Textures.impassable);
					waterSprite.width = this.RENDER_SCALE / 2;
					waterSprite.height = this.RENDER_SCALE / 2;
					waterSprite.position.set(0, this.RENDER_SCALE / 2);
					waterSprite.name = "Water";

					this.Blueprint.tileContainers[x][y].addChild(waterSprite);
				}

				// Adds Impassable Sprite
				if (this.Tile.checkImpassable(currentTile)) {
					let impassableSprite = new Sprite(this.mapEditorService.Textures.impassable);
					impassableSprite.width = this.RENDER_SCALE / 2;
					impassableSprite.height = this.RENDER_SCALE / 2;
					impassableSprite.name = "Impassable";

					this.Blueprint.tileContainers[x][y].addChild(impassableSprite);
				}

				// Adds Unbuildable Sprite
				if (this.Tile.checkUnbuildable(currentTile)) {
					let unbuildableSprite = new Sprite(this.mapEditorService.Textures.unbuildable);
					unbuildableSprite.width = this.RENDER_SCALE / 2;
					unbuildableSprite.height = this.RENDER_SCALE / 2;
					unbuildableSprite.position.set(this.RENDER_SCALE / 2, this.RENDER_SCALE / 2);
					unbuildableSprite.name = "Unbuildable";

					this.Blueprint.tileContainers[x][y].addChild(unbuildableSprite);
				}

				this.blueprint_container.addChild(this.Blueprint.tileContainers[x][y]);
			}
		};

		// Aligns Blueprint Container in the centre of the right container
		this.blueprint_container.x = (this.container_right.width - 100) / 2;
		this.blueprint_container.y = (this.container_right.height - this.blueprint_container.height) / 2;
	}

// Draw options (On Left Container)
	private renderDrawOptions() {
		// Distance from left side of the screen
		let width_from_left_first_list = 50;
		let width_from_left_second_list = 350;
		let height_from_top_first = 50;
		let height_from_top_second = 350;
		let height_from_top_third = 650;

		let text_distance_from_box = 70;

		// Draws the example height boxes and appends them to individual containers
		let drawHeightExample = () => {
			for (let i = 0; i < this.height_container_array.length; i++) {
				this.height_container_array[i] = new Container();
				this.height_container_array[i].x = width_from_left_first_list;
				this.height_container_array[i].y = (i * 70) + height_from_top_first;

				let exampleBoxSprite = new Sprite(this.mapEditorService.Textures.height_array[i]);
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
				this.ramp_container_array[i].x = width_from_left_first_list;
				this.ramp_container_array[i].y = (i * 70) + height_from_top_second;

				let exampleRampSprite = new Sprite(this.mapEditorService.Textures.ramp_array[i]);
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
		
		// Draws the example function boxes and appends it to the container
		let drawFunctionExample = () => {
			for (let i = 0; i < this.other_container_array.length; i++) {
				this.other_container_array[i] = new Container();
				this.other_container_array[i].x = width_from_left_first_list;
				this.other_container_array[i].y = (i * 70) + height_from_top_third;

				let exampleOtherSprite = new Sprite(this.mapEditorService.Textures.function_array[i]);
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
				case "Other":
					let otherChildrenLength = this.other_container_array[data.value].children.length;
					this.other_container_array[data.value].removeChildAt(otherChildrenLength - 1);
					break;
			}
		}

		// Highlights selected current tool
		if (this.Blueprint.currentTool.category == "") {
			this.Blueprint.currentTool = data;
			highlightTool(data);
		// Removes highlight tool if same tool is selected again
		} else if (this.Blueprint.currentTool.category == data.category && this.Blueprint.currentTool.value == data.value) {
			removeHighlightTool(data);
			this.Blueprint.currentTool.category = "";
		// If other tool selected, remove highlight of previous tool and add new highlight
		} else {
			removeHighlightTool(this.Blueprint.currentTool);
			this.Blueprint.currentTool = data;
			highlightTool(data);
		}
	}

// Changes the maptile sprite to a new sprite if a current tool is designated (need to enable selection if no tool selected?)
	private changeTile(x, y) {
		if (this.Blueprint.currentTool.category == "") {

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
						let heightSprite = new Sprite(this.mapEditorService.Textures.height_array[newHeight]);
						heightSprite.height = this.RENDER_SCALE;
						heightSprite.width = this.RENDER_SCALE;
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

					let newRampString = this.Tile.ramp_array[newRamp];

					// Checks if the current tile is already the same ramp
					if (!(this.Tile.contains(this.mapEditorService.tiles[x][y], newRampString))) {
						// Removes the sprite tile
						this.Blueprint.tileContainers[x][y].removeChildAt(0);

						// Creates new sprite out of ramp value
						let rampSprite = new Sprite(this.mapEditorService.Textures.ramp_array[newRamp]);
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
					let waterTile = this.Tile.water_tile;

					// Checks if the current tile is already water
					if (!(this.Tile.contains(this.mapEditorService.tiles[x][y], waterTile))) {
						// Removes the sprite tile
						this.Blueprint.tileContainers[x][y].removeChildAt(0);

						// Create new water sprite
						let waterSprite = new Sprite(this.mapEditorService.Textures.water);
						waterSprite.width = this.RENDER_SCALE;
						waterSprite.height = this.RENDER_SCALE;

						// Add tile interaction with new sprite
						this.addTileInteraction(waterSprite, x, y);
						// Add sprite to the tile container
						this.Blueprint.tileContainers[x][y].addChildAt(waterSprite, 0);
						// Update tile array with water tile
						this.mapEditorService.tiles[x][y] = this.Tile.changeBase(this.mapEditorService.tiles[x][y], waterTile);
					}
					break;
				// Other (Functions) Case
				case "Other":
					let currentTile = this.mapEditorService.tiles[x][y];
					// Different cases (0 = Water, 1 = Impassable, 2 = Unbuildable) 
					// Impassable case
					if (this.Blueprint.currentTool.value == 0) {
						if (this.Tile.checkWater(currentTile)) {
							// Removes Water from tile in map object in service
							this.mapEditorService.tiles[x][y] = this.Tile.removeWater(currentTile);

							// Removes sprite from the tilecontainer
							for (let i = 0; i < this.Blueprint.tileContainers[x][y].children.length; i++) {
								if (this.Blueprint.tileContainers[x][y].children[i].name == "Water") {
									this.Blueprint.tileContainers[x][y].removeChildAt(i);
								}
							}
						} else {
							this.mapEditorService.tiles[x][y] = this.Tile.addWater(currentTile);

							let waterSprite = new Sprite(this.mapEditorService.Textures.water);
							waterSprite.width = this.RENDER_SCALE / 2;
							waterSprite.height = this.RENDER_SCALE / 2;
							waterSprite.name = "Water";
							waterSprite.position.set(0, this.RENDER_SCALE / 2);

							this.Blueprint.tileContainers[x][y].addChild(waterSprite);
						}
					} else if (this.Blueprint.currentTool.value == 1) {
						if (this.Tile.checkImpassable(currentTile)) {
							// Removes Impassable from tile in map object in service
							this.mapEditorService.tiles[x][y] = this.Tile.removeImpassable(currentTile);

							// Removes sprite from the tilecontainer
							for (let i = 0; i < this.Blueprint.tileContainers[x][y].children.length; i++) {
								if (this.Blueprint.tileContainers[x][y].children[i].name == "Impassable") {
									this.Blueprint.tileContainers[x][y].removeChildAt(i);
								}
							}
						} else {
							this.mapEditorService.tiles[x][y] = this.Tile.addImpassable(currentTile);

							let impassableSprite = new Sprite(this.mapEditorService.Textures.impassable);
							impassableSprite.width = this.RENDER_SCALE / 2;
							impassableSprite.height = this.RENDER_SCALE / 2;
							impassableSprite.name = "Impassable";

							this.Blueprint.tileContainers[x][y].addChild(impassableSprite);

						}
					// Unbuildable case
					} else if (this.Blueprint.currentTool.value == 2) {
						if (this.Tile.checkUnbuildable(currentTile)) {
							this.mapEditorService.tiles[x][y] = this.Tile.removeUnbuildable(currentTile);

							// Removes sprite from the tilecontainer
							for (let i = 0; i < this.Blueprint.tileContainers[x][y].children.length; i++) {
								if (this.Blueprint.tileContainers[x][y].children[i].name == "Unbuildable") {
									this.Blueprint.tileContainers[x][y].removeChildAt(i);
								}
							}
						} else {
							this.mapEditorService.tiles[x][y] = this.Tile.addUnbuildable(currentTile);

							let unbuildableSprite = new Sprite(this.mapEditorService.Textures.unbuildable);
							unbuildableSprite.width = this.RENDER_SCALE / 2;
							unbuildableSprite.height = this.RENDER_SCALE / 2;
							unbuildableSprite.name = "Unbuildable";
							unbuildableSprite.position.set(this.RENDER_SCALE / 2, this.RENDER_SCALE / 2);

							this.Blueprint.tileContainers[x][y].addChild(unbuildableSprite);
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
		this.pixiloading.unsubscribe();
		
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
		let x = this.camera.mouse.getLocalPosition(this.blueprint_container).x;
		let y = this.camera.mouse.getLocalPosition(this.blueprint_container).y;

		let worldPos = {x: (x - this.canvas.stage.x) / this.blueprint_container.scale.x, y: (y - this.canvas.stage.y) / this.blueprint_container.scale.y};
		let newScale = {x: this.blueprint_container.scale.x * factor, y: this.blueprint_container.scale.y * factor};
		let newScreenPos = {x: (worldPos.x) * newScale.x + this.canvas.stage.x, y: (worldPos.y) * newScale.y + this.canvas.stage.y};

		this.blueprint_container.x -= (newScreenPos.x - x);
		this.blueprint_container.y -= (newScreenPos.y - y);

		this.blueprint_container.scale.x = Math.round(newScale.x * 100) / 100;
		this.blueprint_container.scale.y = Math.round(newScale.y * 100) / 100;
	}

// Resizes canvas
	private addResizeCanvas() {
		this.canvas.renderer.resize(window.innerWidth, window.innerHeight);
	}

// Moves blueprint map around canvas bounds
	private moveBlueprintMap(event) {
		// Left key pressed
		if (event.keyCode == "37") {
			if (this.blueprint_container.getBounds().x > 400) {
				this.blueprint_container.position.x -= this.SCROLL_FACTOR;
			}
		}
		// Up key pressed
		if (event.keyCode == "38") {
			if (this.blueprint_container.getBounds().y > -400) {
				this.blueprint_container.position.y -= this.SCROLL_FACTOR;
			}
		}
		// Right key pressed
		if (event.keyCode == "39") {
			if (this.blueprint_container.getBounds().x < 1300) {
				this.blueprint_container.position.x += this.SCROLL_FACTOR;
			}
		}
		// Down key pressed
		if (event.keyCode == "40") {
			if (this.blueprint_container.getBounds().y < this.RENDERER_HEIGHT - 100) {
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
