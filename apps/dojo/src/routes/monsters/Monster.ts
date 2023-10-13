import { AnimatedSprite } from 'pixi.js';
import type { Rectangle, Texture } from 'pixi.js';

export class Monster {

    view: AnimatedSprite;
    positionX = 0;
    positionY = 0;

    bounds: Rectangle;

    constructor(textures: Texture[], bounds: Rectangle) {
        this.view = new AnimatedSprite(textures)
        this.view.anchor.set(0.5, 1);
        this.bounds = bounds
    }

    public update() {
        const pX = this.positionX;
        const pY = this.positionY;

        this.view.position.x = this.positionX = pX;
        this.view.position.y = this.positionY = pY;
    }

    reset() {
        this.positionX = 0;
        this.positionY = 0;
    }
}