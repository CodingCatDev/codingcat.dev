import { useEffect } from 'preact/hooks';
import { useMachine } from '@xstate/react';
import { createMachine, assign } from 'xstate';
import { useTwitchChat } from '@socket-studio/preact';

//TODO: remove all the any

export interface Message {
	handler: Handler;
	author?: string;
	command?: string;
}

export interface Handler {
	duration?: number;
	message?: string;
	audio?: string;
	image?: string;
}

const formatCommand = (msg: Message = { handler: {} }) => {
	const { duration, message, audio, image } = msg.handler || {};

	if (!message && !audio && !image) {
		return {};
	}

	return {
		author: msg.author,
		command: {
			name: msg.command,
			message,
			audio,
			image,
			duration: (duration || 2) * 1000 // convert seconds to milliseconds
		}
	};
};

const handleQueue = {
	ADD_TO_QUEUE: {
		actions: 'commandAddToQueue'
	}
};

const COMMAND_ASSET_CACHE: any = {};

const commandMachine = createMachine(
	{
		id: 'commands',
		initial: 'idle',
		context: {
			current: {},
			queue: []
		},
		states: {
			idle: {
				on: {
					ADD_TO_QUEUE: {
						actions: 'commandSetCurrent',
						target: 'loadingCommandAssets'
					}
				}
			},
			loadingCommandAssets: {
				on: handleQueue,
				invoke: {
					src: 'commandLoadAssets',
					onDone: 'starting',
					onError: 'error'
				}
			},
			starting: {
				on: handleQueue,
				after: {
					TRANSITION_DURATION: 'active'
				}
			},
			active: {
				entry: 'commandPlayAudio',
				on: handleQueue,
				after: {
					COMMAND_DURATION: 'stopping'
				}
			},
			stopping: {
				on: handleQueue,
				after: {
					TRANSITION_DURATION: 'checkingForQueuedCommands'
				},
				exit: assign({ current: {} })
			},
			checkingForQueuedCommands: {
				on: {
					...handleQueue,
					'': [
						{
							cond: (context) => context.queue.length > 0,
							target: 'startNextCommand'
						},
						{ target: 'idle' }
					]
				}
			},
			startNextCommand: {
				on: {
					...handleQueue,
					'': {
						actions: 'commandGetNextFromQueue',
						target: 'loadingCommandAssets'
					}
				}
			},
			error: {
				entry: (context, event) => console.error({ context, event }),
				on: {
					...handleQueue,
					'': [
						{
							cond: (context) => context.queue.length > 0,
							target: 'startNextCommand'
						},
						{ target: 'idle' }
					]
				}
			}
		}
	},
	{
		actions: {
			commandSetCurrent: assign({
				current: (_context, event: { command: Message }) => {
					const cmd = formatCommand(event.command);
					console.log({ event, cmd });
					return cmd;
				}
			}),
			commandAddToQueue: assign({
				queue: (context: any, event: any) => {
					const cmd = formatCommand(event.command);
					console.log({ event, cmd, context, queue: true });
					return [...context.queue, cmd];
				}
			}),
			commandGetNextFromQueue: assign({
				current: (context) => context.queue[0],
				queue: (context) => context.queue.slice(1)
			}),
			commandPlayAudio: (context: any) => {
				const cmd = context.current.command || {};

				if (!cmd.audio) {
					return;
				}

				const sfx = COMMAND_ASSET_CACHE[context.current.command.audio];

				sfx.play();
			}
		},
		services: {
			commandLoadAssets: (context: any) => {
				const imagePromise = new Promise((resolve, reject) => {
					const { image } = context.current.command;

					if (!image) {
						resolve(true);
						return;
					}

					if (COMMAND_ASSET_CACHE[image]) {
						resolve(COMMAND_ASSET_CACHE[image]);
						return;
					}

					const img = new Image();

					img.onload = () => {
						COMMAND_ASSET_CACHE[image] = img;
						resolve(img);
					};

					img.onerror = (err) => {
						console.error(err);
						reject(err);
					};

					img.src = image;
				});

				const soundPromise = new Promise((resolve, reject) => {
					const { audio } = context.current.command;

					if (!audio) {
						resolve(true);
						return;
					}

					if (COMMAND_ASSET_CACHE[audio]) {
						resolve(COMMAND_ASSET_CACHE[audio]);
						return;
					}

					const sfx = new Audio();

					sfx.addEventListener('canplaythrough', () => {
						COMMAND_ASSET_CACHE[audio] = sfx;
						resolve(sfx);
					});

					sfx.onerror = (err) => {
						console.error(err);
						reject(err);
					};

					sfx.src = audio;
				});

				return Promise.all([imagePromise, soundPromise]);
			}
		},
		delays: {
			TRANSITION_DURATION: 600,
			COMMAND_DURATION: (context: any) => {
				return context.current.command.duration || 4000;
			}
		}
	}
);

export function useSoundEffect(config?: any) {
	const { currentCommand: command, chat, commands } = useTwitchChat('codingcatdev');
	const [state, send] = useMachine(commandMachine, config);
	useEffect(() => {
		console.log(command);

		const handler = (command && command.handler) || {};
		if (!handler.message && !handler.audio && !handler.image) {
			return;
		}

		send({ type: 'ADD_TO_QUEUE', command });
	}, [command]);

	return state;
}
