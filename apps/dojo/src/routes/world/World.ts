import { Assets, TilingSprite, Container, Rectangle } from 'pixi.js';
import type { Player } from '../players/Player';
import { MyPlayer } from '../players/MyPlayer';

export const resolution = 4;
export const movement = 20;
export const height = 240;
export const width = 240;

export class World {
	view: Container;
	paths: TilingSprite[];
	blocked: TilingSprite[];

	player: Player;

	constructor(paths: TilingSprite[], blocked: TilingSprite[], myPlayer: MyPlayer) {
		this.view = new Container();
		this.paths = paths;
		this.blocked = blocked;

		// Add world tiles
		for (const sprite of [...paths, ...blocked]) {
			this.view.addChild(sprite);
		}
		// Add player
		this.player = myPlayer;
		this.view.addChild(this.player.view);
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

		// Create a new player
		const myPlayer = await MyPlayer.create();
		return new World(paths, blocked, myPlayer);
	}
	public onKeyDown(e: KeyboardEvent) {
		const bounds = this.player.view.getBounds();
		console.debug('player ', bounds);

		switch (e.key) {
			case 'ArrowLeft':
				console.debug('move left');
				bounds.x = bounds.x - this.player.bounds.width;
				if (!this.testPlayerHitBlocked(bounds)) {
					this.player?.left();
				}
				break;
			case 'ArrowRight':
				console.debug('move right');
				bounds.x = bounds.x + this.player.bounds.width;
				if (!this.testPlayerHitBlocked(bounds)) {
					this.player?.right();
				}
				break;
			case 'ArrowUp':
				console.debug('move up');
				bounds.y = bounds.y - this.player.bounds.height;
				if (!this.testPlayerHitBlocked(bounds)) {
					this.player?.up();
				}
				break;
			case 'ArrowDown':
				console.debug('move down');
				bounds.y = bounds.y + this.player.bounds.height;
				if (!this.testPlayerHitBlocked(bounds)) {
					this.player?.down();
				}
				break;
		}
	}
	// TODO: is this fast enough?
	private testPlayerHitBlocked(playerBounds: Rectangle) {
		let hit = false;

		// Check for overall size
		if (
			!(
				playerBounds.x >= 0 &&
				playerBounds.x <= width &&
				playerBounds.y >= 0 &&
				playerBounds.y <= height
			)
		) {
			console.log('out of range', playerBounds);
			return true;
		}

		// Checked for blocked areas
		for (const b of this.blocked) {
			const bounds1 = b.getBounds();
			hit =
				bounds1.x < playerBounds.x + playerBounds.width &&
				bounds1.x + bounds1.width > playerBounds.x &&
				bounds1.y < playerBounds.y + playerBounds.height &&
				bounds1.y + bounds1.height > playerBounds.y;
			if (hit) break;
		}
		return hit;
	}
}
