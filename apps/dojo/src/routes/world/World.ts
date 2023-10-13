import { Assets, TilingSprite, Container } from 'pixi.js';
import type { Player } from '../players/Player';

export const resolution = 4;
export const movement = 20;
export const height = 240;
export const width = 240;

export class World {
	view: Container;
	paths: TilingSprite[];
	blocked: TilingSprite[];

	player: Player | undefined;

	constructor(paths: TilingSprite[], blocked: TilingSprite[]) {
		this.view = new Container();
		this.paths = paths;
		this.blocked = blocked;
		for (const sprite of [...paths, ...blocked]) {
			this.view.addChild(sprite);
		}
		console.debug(this.blocked);
	}
	static async create() {
		const textures = Object.values(
			await Assets.load([
				'/assets/oryx_wee_dungeon/wee_sliced/forest/wee_forest_grass.png',
				'/assets/oryx_wee_dungeon/wee_sliced/forest/wee_forest_cliff.png',
			]),
		);
		const paths = [
			new TilingSprite({
				texture: textures.at(0),
				height: movement,
				width: movement * 7,
				y: movement * 0,
			}),
			new TilingSprite({
				texture: textures.at(0),
				height: movement * 8,
				width: movement,
				x: movement * 7,
				y: movement * 0,
			}),
			new TilingSprite({
				texture: textures.at(0),
				height: movement * 2,
				width: movement * 4,
				x: movement * 8,
				y: movement * 6,
			}),
		];
		const blocked = [
			new TilingSprite({
				texture: textures.at(1),
				height: movement * 6,
				width: movement * 5,
				x: movement * 8,
				y: movement * 0,
			}),
			new TilingSprite({
				texture: textures.at(1),
				height: movement * 11,
				width: movement * 7,
				x: movement * 0,
				y: movement * 1,
			}),

			new TilingSprite({
				texture: textures.at(1),
				height: movement * 4,
				width: movement * 6,
				x: movement * 7,
				y: movement * 8,
			}),
		];

		return new World(paths, blocked);
	}

	addPlayer(player: Player) {
		this.player = player;
	}
}
