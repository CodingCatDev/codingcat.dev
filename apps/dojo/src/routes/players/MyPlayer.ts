import { Rectangle, Assets } from 'pixi.js';
import { Player } from './Player';

export class MyPlayer extends Player {
	static bounds = new Rectangle(0, 0, 20, 20);

	static async create() {
		return new MyPlayer(
			{
				down: Object.values(
					await Assets.load([
						'/assets/oryx_wee_dungeon/wee_sliced/monsters/wee_mons_druid_atk_d_1.png',
						'/assets/oryx_wee_dungeon/wee_sliced/monsters/wee_mons_druid_atk_d_2.png',
					]),
				),
				left: Object.values(
					await Assets.load([
						'/assets/oryx_wee_dungeon/wee_sliced/monsters/wee_mons_druid_atk_l_1.png',
						'/assets/oryx_wee_dungeon/wee_sliced/monsters/wee_mons_druid_atk_l_2.png',
					]),
				),
				right: Object.values(
					await Assets.load([
						'/assets/oryx_wee_dungeon/wee_sliced/monsters/wee_mons_druid_atk_r_1.png',
						'/assets/oryx_wee_dungeon/wee_sliced/monsters/wee_mons_druid_atk_r_2.png',
					]),
				),
				up: Object.values(
					await Assets.load([
						'/assets/oryx_wee_dungeon/wee_sliced/monsters/wee_mons_druid_atk_u_1.png',
						'/assets/oryx_wee_dungeon/wee_sliced/monsters/wee_mons_druid_atk_u_2.png',
					]),
				),
			},
			MyPlayer.bounds,
		);
	}
}
