import { AnimatedSprite } from 'pixi.js';
import type { Container, Rectangle, Texture } from 'pixi.js';

export interface AnimatedMovement {
	down: AnimatedSprite;
	left: AnimatedSprite;
	right: AnimatedSprite;
	up: AnimatedSprite;
}

export interface AnimatedTextures {
	down: Texture[];
	left: Texture[];
	right: Texture[];
	up: Texture[];
}

export class Monster {
	bounds: Rectangle;
	movement: AnimatedMovement;

	positionX = 0;
	positionY = 0;
	stage: Container;
	view: AnimatedSprite;
	constructor(textures: AnimatedTextures, bounds: Rectangle, stage: Container) {
		this.bounds = bounds;
		this.movement = {
			down: new AnimatedSprite(textures.down),
			left: new AnimatedSprite(textures.left),
			right: new AnimatedSprite(textures.right),
			up: new AnimatedSprite(textures.up),
		};
		this.stage = stage;

		//TODO: Defaults to right, maybe it shouldn't
		this.view = this.movement.right;
		this.stage.addChild(this.view);
	}

	public down() {
		this.changeDirection(this.movement.down);
		this.view.position.y = this.view.position.y + this.bounds.height;
	}
	public left() {
		this.changeDirection(this.movement.left);
		this.view.position.x = this.view.position.x - this.bounds.width;
	}
	public right() {
		this.changeDirection(this.movement.right);
		this.view.position.x = this.view.position.x + this.bounds.width;
	}
	public up() {
		this.changeDirection(this.movement.up);
		this.view.position.y = this.view.position.y - this.bounds.height;
	}

	changeDirection(direction: AnimatedSprite) {
		this.stage.removeChild(this.view);
		this.view = direction;
		this.stage.addChild(this.view);
		this.view.gotoAndStop(0);
		setTimeout(() => {
			this.view.gotoAndStop(this.view.totalFrames - 1);
			console.log(this.view.position);
		}, 200);
	}
}
