// todo set tile container to invisible if offscreen

import { Component, OnInit, OnDestroy } from '@angular/core';
import * as PIXI from 'pixi.js';
import { Map } from './../../game/data/map';



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

// Canvas Parameters
	canvas: PIXI.Application;
	private RENDERER_WIDTH: number = 1620;
	private RENDERER_HEIGHT: number = 833;

// Map Container
	container_left: PIXI.Container;
	container_right: PIXI.Container;
	blueprint_container: PIXI.Container;
	fixed_container: PIXI.Container;
	RENDER_SCALE: number;
	LEFT_COLOUR = 0xb2b2ff;
	RIGHT_COLOUR = 0x0000ff;

// Map Tile Textures for sprite generation for maptile and example boxes
	height_0_texture;
	height_1_texture;
	height_2_texture;
	height_3_texture;
	height_texture_array = [this.height_0_texture, this.height_1_texture, this.height_2_texture,this.height_3_texture];

// Draw Option Containers, Example Boxes, and Text
	height_0_container: PIXI.Container;
	height_1_container: PIXI.Container;
	height_2_container: PIXI.Container;
	height_3_container: PIXI.Container;
	height_container_array = [this.height_0_container, this.height_1_container, this.height_2_container, this.height_3_container];
	height_0_text: PIXI.Text;
	height_1_text: PIXI.Text;
	height_2_text: PIXI.Text;
	height_3_text: PIXI.Text;
	height_text_array = [this.height_0_text, this.height_1_text, this.height_2_text, this.height_3_text];
	textstyle = new PIXI.TextStyle({
		fontFamily: "Arial",
		fontSize: 36
	});
	HIGHLIGHT_BORDER = 0xffff00;

	ramp_W_container: PIXI.Container;
	ramp_E_container: PIXI.Container;
	ramp_N_container: PIXI.Container;
	ramp_S_container: PIXI.Container;
	ramp_container_array = [this.ramp_W_container, this.ramp_E_container, this.ramp_N_container, this.ramp_S_container];
	ramp_coords_array = ["W", "E", "N", "S"];
	ramp_W_text: PIXI.Text;
	ramp_E_text: PIXI.Text;
	ramp_N_text: PIXI.Text;
	ramp_S_text: PIXI.Text;

	spritesheet;

// Ramp Sprites and Arrays
	ramp_W_texture: PIXI.Texture;
	ramp_W_url = "./../../assets/mapeditor/rampW.png";
	ramp_E_texture: PIXI.Sprite;
	ramp_E_url = "./../../assets/mapeditor/rampE.png";
	ramp_N_texture: PIXI.Sprite;
	ramp_N_url = "./../../assets/mapeditor/rampN.png";
	ramp_S_texture: PIXI.Sprite;
	ramp_S_url = "./../../assets/mapeditor/rampS.png";
	ramp_texture_array = [this.ramp_W_texture, this.ramp_E_texture, this.ramp_N_texture, this.ramp_S_texture];
	ramp_url_array = [this.ramp_W_url, this.ramp_E_url, this.ramp_N_url, this.ramp_S_url];


// Options Parameters
	EXAMPLE_BOX_WIDTH: number = 50;
	EXAMPLE_BOX_HEIGHT: number = 50;

// Blueprint Mode Parameters
	Blueprint = {
		TILE_BORDER_COLOUR: 0x000000, // Black
		TILE_COLOURS: [0x0088FF, 0x006DCC, 0x0A00CC, 0x05006B],
		tileContainers: [],
		currentTool: "",
		selected: false,
		mapSelection: []

	}



// Tiles Array and Map Object
	tiles = [];
	map: Map;

// Zoom Factor
	ZOOM_FACTOR: number = 0.05;
	SCROLL_FACTOR: number = 30;

// Inputs
	left;
	right;
	down;
	up;

// PIXI Interaction Manager
	camera: PIXI.interaction.InteractionManager;

	constructor() { }

	ngOnInit() {
		this.pixiLoaderInit();
		this.generateMap();
		this.generatePixiCanvas();
		this.pixiLoaderInit();
		this.generateContainer();
		this.addInputs();
	}

// Initialize PIXI.loader and assign textures to images
	pixiLoaderInit() {
		let setup = () => {
			for (let i = 0; i < this.ramp_texture_array.length; i++) {
				this.ramp_texture_array[i] = loader.resources[this.ramp_url_array[i]].texture;
			}
		}

		PIXI.loader
			.add([this.ramp_W_url, this.ramp_E_url, this.ramp_N_url, this.ramp_S_url])
			.load(setup)
			.reset();

	
	}

// Initializes the default map (may retrieve saved map from cache if previously there) and Render Scale
	private generateMap() {
		this.map = new Map(50, 50, [], [], [], [], 0);
		for (let x = 0; x < this.map.width; x++) {
			this.tiles.push([]);
			for (let y = 0; y < this.map.height; y++) {
				this.tiles[x].push(3);
			}
		}
		this.map.tiles = this.tiles;

		// Determines the scale of how big the tiles should be depending on map height/width
		let scaleX = (this.RENDERER_WIDTH - 200)/ this.map.width;
		let scaleY = (this.RENDERER_HEIGHT- 20)/ this.map.height;
		this.RENDER_SCALE = Math.min(scaleX, scaleY)
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
		texture_left.drawRect(0, 0, 700, 833);
		texture_left.endFill();
		this.container_left.addChild(texture_left);

		// Adds a rectangle graphic on the right container
		let texture_right = new Graphics();
		texture_right.lineStyle(1, this.Blueprint.TILE_BORDER_COLOUR, 1);
		texture_right.beginFill(this.RIGHT_COLOUR);
		texture_right.drawRect(700, 0, 920, 833);
		texture_right.endFill();
		this.container_right.addChild(texture_right);
		// Change index of the blueprint container to be on top
		this.container_right.setChildIndex(this.blueprint_container, 1);

		// Generate MapTile texture for sprite generation for rendering the MapTiles
		this.generateMapTexture();

		// Attaches a container and sprite to each tile in Blueprint and Renders
		for (let x = 0; x < this.map.width; x++) {
			this.Blueprint.tileContainers.push([]);
			for (let y = 0; y < this.map.height; y++) {
				this.Blueprint.tileContainers[x].push(new Container());
				this.Blueprint.tileContainers[x][y].x = x * this.RENDER_SCALE;
				this.Blueprint.tileContainers[x][y].y = y * this.RENDER_SCALE;

				let sprite = new Sprite(this.height_texture_array[this.map.tiles[x][y]]);
				this.addTileInteraction(sprite, x, y);

				this.Blueprint.tileContainers[x][y].addChild(sprite);

				this.blueprint_container.addChild(this.Blueprint.tileContainers[x][y]);
			}
		};
		// this.renderMap();
		this.renderDrawOptions();

		// Aligns Blueprint Container in the centre of the canvas
		this.blueprint_container.position.x = (this.container_right.width - 100) / 2;
		this.blueprint_container.position.y = (this.container_right.height - this.blueprint_container.height) / 2;

	}

// Generate MapTile texture for sprite generation for rendering the MapTiles
// Requires Render Scale for MapTile Sizing
	private generateMapTexture() {
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
	}

// Draw options (On Left Container)
	private renderDrawOptions() {
		// Distance from left side of the screen
		let width_from_left = 50;

		// Draws the example height boxes and appends them to individual containers
		for (let i = 0; i < this.height_container_array.length; i++) {
			this.height_container_array[i] = new Container();
			this.height_container_array[i].x = width_from_left;
			this.height_container_array[i].y = (i * 70) + 50;

			let exampleBoxSprite = new Sprite(this.height_texture_array[i]);
			exampleBoxSprite.width = this.EXAMPLE_BOX_WIDTH;
			exampleBoxSprite.height = this.EXAMPLE_BOX_HEIGHT;
			this.height_container_array[i].addChild(exampleBoxSprite);
			this.container_left.addChild(this.height_container_array[i]);

	// Enable Interactive on each Box to designate current Tool on Blueprint
			exampleBoxSprite.interactive = true;
			exampleBoxSprite.on("mousedown", (event) => {
				this.currentTool(i);
			})

			// Draws Height Text
			this.height_text_array[i] = new Text("Height " + i, this.textstyle);
			this.height_text_array[i].position.set(100, 0);
			this.height_container_array[i].addChild(this.height_text_array[i]);
		}

		// for (let i = 0; i < this.ramp_container_array.length; i++) {
		// 	this.ramp_container_array[i] = new Container();
		// 	this.ramp_container_array[i].addChild(this.ramp_sprite_array[i]);
		// 	this.ramp_container_array[i].position.x = 200;
		// 	this.ramp_container_array[i].position.y = (i * 70) + 50;

		// }
	}

// Designate Current Tool
	private currentTool(tile) {
		// Adds Yellow Border around the current Tool
		let highlightTool = (tile) => {
			let highlightBorder = new Graphics();
			highlightBorder.lineStyle(4, this.HIGHLIGHT_BORDER, 1);
			highlightBorder.drawRect(0, 0, this.height_container_array[tile].width, this.height_container_array[tile].height);

			this.height_container_array[tile].addChild(highlightBorder);
		}

		// Removes the most recent child (border) in the container when current Tool is changed
		let removeHighlightTool = (tile) => {
			let childrenLength = this.height_container_array[tile].children.length;
			this.height_container_array[tile].removeChildAt(childrenLength - 1);
		}

		if (this.Blueprint.currentTool === "") {
			this.Blueprint.currentTool = tile;
			highlightTool(tile);
		} else {
			removeHighlightTool(this.Blueprint.currentTool);
			this.Blueprint.currentTool = tile;
			highlightTool(tile);
		}
	}

// Changes the maptile sprite to a new sprite if a current tool is designated (need to enable selection if no tool selected?)
	private addToSelection(x, y) {
		if (this.Blueprint.currentTool === "") {

		} else {
			let childrenLength = this.Blueprint.tileContainers[x][y].children.length;
			let newHeight = Number.parseInt(this.Blueprint.currentTool);
			this.Blueprint.tileContainers[x][y].removeChildAt(childrenLength - 1);
			var sprite = new Sprite(this.height_texture_array[newHeight]);

			this.addTileInteraction(sprite, x, y);

			this.Blueprint.tileContainers[x][y].addChild(sprite);

			this.tiles[x][y] = newHeight;
		}
	}

// Adds interactiveness and mouse listeners to the map tile whenever sprite is generated
	private addTileInteraction(sprite, x, y) {
		sprite.interactive = true;
		sprite.on("mousedown", (event) => {
			this.Blueprint.selected = true;
			this.addToSelection(x, y);
		});
		sprite.on("mouseup", (event) => {
			this.Blueprint.selected = false;
		})
		sprite.on("mouseover", (event) => {
			if (this.Blueprint.selected) {
				this.addToSelection(x, y);
			}	
		});
		
	}

// Function called when component is destroyed
	ngOnDestroy() {
		// Remove Event Listeners
		document.getElementById('pixi-canvas').removeEventListener("wheel", this.mouseWheelHandler);
		window.removeEventListener("keydown", this.left.downHandler);
		window.removeEventListener("keydown", this.right.downHandler);
		window.removeEventListener("keydown", this.up.downHandler);
		window.removeEventListener("keydown", this.down.downHandler);
		window.removeEventListener("keydown", this.left.upHandler);
		window.removeEventListener("keydown", this.right.upHandler);
		window.removeEventListener("keydown", this.up.upHandler);
		window.removeEventListener("keydown", this.down.upHandler);
	}

//
// 
// ** Inputs **//
//
//

// Add Event Listeners for Interaction with the Editor
	private addInputs() {
		// Mousewheel Event Listener
		document.getElementById('pixi-canvas').addEventListener("wheel", (event) => {
			this.mouseWheelHandler(event);
		}, {capture: false})

		function keyboard(keyCode) {
			let key = {
				code: keyCode,
				isDown: false,
				isUp: true,
				press: undefined,
				release: undefined,
				downHandler: event => {
					if (event.keyCode === key.code) {
						if (key.isUp && key.press) {
							key.press();
						}
						key.isDown = true;
						key.isUp = false;
					}
					event.preventDefault();
				},
				upHandler: event => {
					if (event.keyCode === key.code) {
						if (key.isDown && key.release) {
							key.release();
						}
						key.isDown = false;
						key.isUp = true;
					}
					event.preventDefault();
				}
			};
			window.addEventListener("keydown", key.downHandler.bind(key), false);
			window.addEventListener("keydown", key.upHandler.bind(key), false);
			return key;
		}
		this.left = keyboard(37), this.up = keyboard(38), this.right = keyboard(39), this.down = keyboard(40);

		this.left.press = () => {
			if (this.blueprint_container.getBounds().x > 600) {
				this.blueprint_container.position.x -= this.SCROLL_FACTOR;
			}
		}
		this.right.press = () => {
			if (this.blueprint_container.getBounds().x < 1000) {
				this.blueprint_container.position.x += this.SCROLL_FACTOR;
			}
		}
		this.up.press = () => {
			if (this.blueprint_container.getBounds().y > -200) {
				this.blueprint_container.position.y -= this.SCROLL_FACTOR;
			}
			
		}
		this.down.press = () => {
			if (this.blueprint_container.getBounds().y < this.RENDERER_HEIGHT - 600) {
				this.blueprint_container.position.y += this.SCROLL_FACTOR;
			}
			
		}
	}

// Mouse wheel handler for zoom in and out of the container
	private mouseWheelHandler(event: WheelEvent) {
		let direction = event.deltaY < 0 ? 1 : -1;
		let factor = (1 + direction * this.ZOOM_FACTOR);
		this.blueprint_container.scale.x = Math.round(this.blueprint_container.scale.x * factor * 100) / 100;
		this.blueprint_container.scale.y = Math.round(this.blueprint_container.scale.y * factor * 100) / 100;
	}

}
