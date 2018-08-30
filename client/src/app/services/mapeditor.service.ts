import { Injectable } from '@angular/core';
import * as PIXI from 'pixi.js';
import { Subject } from 'rxjs';


import { Map } from './../../game/data/map';
import { RenderMap } from './../../game/render/rendermap';
import { Textures } from './../../game/render/textures';

@Injectable({
	providedIn: 'root'
})
export class MapeditorService {
	RenderMap: RenderMap;
	Textures: Textures;

	tiles = [];
	map: Map;
	height: number;
	width: number;
	newMap: boolean = true;

// RXJS Subject
	pixiloading;

	blueprint_assets: PIXI.BaseTexture;
	render_tiles_assets: PIXI.BaseTexture;

// Directories
	blueprint_assets_dir = "./../../assets/mapeditor/blueprintAssets.png";
	tileset_dir = "./../../assets/tiles/tileset.png";

	constructor() {
		this.RenderMap = new RenderMap(this);
		this.Textures = new Textures();

		this.pixiLoaderInit();
	}

	pixiLoaderInit() {
		this.pixiloading = new Subject();

		// Initializes the default map (may retrieve saved map from cache if previously there)
		if (this.newMap) {
			this.generateDefaultMap();
		}

		PIXI.loader
			.add([this.blueprint_assets_dir, this.tileset_dir])
			.load()
			.on("complete", (loader, resources) => {
				this.generateTextures();
				this.pixiloading.next(true);
		})
	}

	generateTextures() {
		this.blueprint_assets = PIXI.loader.resources[this.blueprint_assets_dir].texture.baseTexture;
		this.render_tiles_assets = PIXI.loader.resources[this.tileset_dir].texture.baseTexture;

		this.Textures.generateBlueprintTextures(this.blueprint_assets);
		this.Textures.generateRenderTextures(this.render_tiles_assets);
	}

	generateDefaultMap() {
		let width: number = 20;
		let height: number = 20;
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

	getRenderMap() {
		return this.RenderMap.renderMap(this.map);
	}
}
