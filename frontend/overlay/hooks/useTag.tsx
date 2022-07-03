import Matter from 'matter-js';
import { useEffect, useRef, useState } from 'preact/hooks';

const { Engine, Render, Runner, World, Bodies } = Matter;

const engine = Engine.create();
const runner = Runner.create();

function createTag(url: string) {
	const tag = Bodies.circle(Math.round(Math.random() * window.innerWidth), -30, 15, {
		angle: Math.PI * (Math.random() * 2 - 1),
		friction: 0.001,
		frictionAir: 0.01,
		restitution: 0.75,
		render: {
			sprite: {
				texture: url,
				xScale: 0.5,
				yScale: 0.5
			}
		}
	});

	setTimeout(() => {
		World.remove(engine.world, tag);
	}, 30000);

	World.add(engine.world, [tag]);
}

export function useTag() {
	const ref = useRef<any>();
	const [count, setCount] = useState(0);

	useEffect(() => {
		const canvas = ref.current;

		if (!canvas) {
			return;
		}

		const height = ref?.current?.clientHeight;
		const width = ref?.current?.clientWidth;

		if (!height || !width) {
			return;
		}

		const render = Render.create({
			element: document.createElement('div'),
			canvas,
			engine: engine,
			options: {
				height,
				width,
				background: 'transparent',
				wireframes: false
			}
		});

		const boundaries = {
			isStatic: true,
			render: {
				fillStyle: 'transparent',
				strokeStyle: 'transparent'
			}
		};
		const ground = Bodies.rectangle(width / 2, height, width + 20, 4, boundaries);
		const leftWall = Bodies.rectangle(0, height / 2, 4, height + 60, boundaries);
		const rightWall = Bodies.rectangle(width, height / 2, 4, height + 60, boundaries);

		World.add(engine.world, [ground, leftWall, rightWall]);

		Render.run(render);
		Runner.run(runner, engine);
	}, [ref]);

	const addTag = (tagImage: string) => {
		createTag(tagImage);
		setCount(count + 1);
	};

	return { tagRef: ref, addTag, count };
}
