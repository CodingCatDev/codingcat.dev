import { AnimatedSprite } from 'pixi.js';
import type { Container, Rectangle, Texture } from 'pixi.js';

export interface AnimatedTextures {
	down: Texture[];
	left: Texture[];
	right: Texture[];
	up: Texture[];
}

export class Monster {
	bounds: Rectangle;

	positionX = 0;
	positionY = 0;
	stage: Container;
	view: AnimatedSprite;
	constructor(textures: AnimatedTextures, bounds: Rectangle, stage: Container) {
		this.bounds = bounds;
		this.view = new AnimatedSprite([
			...textures.down,
			...textures.left,
			...textures.right,
			...textures.up,
		]);
		this.stage = stage;

		//TODO: Defaults to right, maybe it shouldn't
		this.view.currentFrame = 5;
		this.stage.addChild(this.view);
	}

	public down() {
		this.view.gotoAndStop(0);
		this.view.position.y = this.view.position.y + this.bounds.height / 2;
		setTimeout(() => {
			this.view.gotoAndStop(1);
			this.view.position.y = this.view.position.y + this.bounds.height / 2;
		}, 200);
	}
	public left() {
		this.view.gotoAndStop(2);
		this.view.position.x = this.view.position.x - this.bounds.width / 2;
		setTimeout(() => {
			this.view.gotoAndStop(3);
			this.view.position.x = this.view.position.x - this.bounds.width / 2;
		}, 200);
	}
	public right() {
		this.view.gotoAndStop(4);
		this.view.position.x = this.view.position.x + this.bounds.width / 2;
		setTimeout(() => {
			this.view.gotoAndStop(5);
			this.view.position.x = this.view.position.x + this.bounds.width / 2;
		}, 200);
	}
	public up() {
		this.view.gotoAndStop(6);
		this.view.position.y = this.view.position.y - this.bounds.height / 2;
		setTimeout(() => {
			this.view.position.y = this.view.position.y - this.bounds.height / 2;
			this.view.gotoAndStop(7);
		}, 200);
	}
}
