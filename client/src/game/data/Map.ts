export class Map {

// Parameters of the Map
	width: number; // width - The width of the map in tiles
	height: number; // height - The height of the map in tiles
	tiles: any; // tiles - A 2D array of size width x height
	mapObjects: any; // An array of MapObjects
	buildings: any; // An array of Buildings 
	units: any; // An array of units
	defaultHeight: number; // defaultHeight - The default height of the map

	constructor(width, height, tiles, mapObjects, buildings, units, defaultHeight) {
	 	this.width = width;
	 	this.height = height;
	 	this.tiles = tiles;
	 	this.mapObjects = [];
	 	this.buildings = [];
		this.units = [];
		this.defaultHeight = defaultHeight;
	}
}