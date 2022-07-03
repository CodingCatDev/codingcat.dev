import { useEffect } from 'preact/hooks';
import { useTwitchChat } from '@socket-studio/preact';
import { useTag } from '@/hooks/useTag';

export function TagDrop() {
	const { chat } = useTwitchChat('codingcatdev');
	const { tagRef, addTag } = useTag();

	useEffect(() => {
		if (!window) {
			return;
		}

		const [message] = chat.slice(-1);
		if (!message || !message.emotes) return;

		message.emotes.forEach((emote: { name: string; locations: any[] }) => {
			if (emote.name === 'coding41Aj') {
				emote.locations.forEach(() =>
					addTag('https://media.codingcat.dev/q_auto,f_auto,w_90/main-codingcatdev-photo/AJTag.png')
				);
			}
			if (emote.name === 'coding41Kc') {
				emote.locations.forEach(() =>
					addTag(
						'https://media.codingcat.dev/q_auto,f_auto,w_90/main-codingcatdev-photo/KC_Tag.png'
					)
				);
			}
		});
	}, [chat.length]);

	return (
		<>
			{' '}
			<canvas
				ref={tagRef}
				style={{
					height: 562,
					left: 0,
					position: 'absolute',
					top: 0,
					width: 1280
				}}
			/>
		</>
	);
}
