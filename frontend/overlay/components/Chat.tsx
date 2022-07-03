import { h } from 'preact';
import { useTwitchChat } from '@socket-studio/preact';
import rehype from 'rehype';
import sanitize from 'rehype-sanitize';

function getUsernameColor(roles: string[]) {
	if (roles.includes('BROADCASTER')) {
		return 'bg-purple-500 text-white rounded p-1';
	}

	if (roles.includes('MODERATOR')) {
		return 'bg-purple-500 text-purple-50 rounded p-1';
	}

	if (roles.includes('SUBSCRIBER')) {
		return 'bg-purple-500 text-purple-50 rounded p-1';
	}

	return 'p-1';
}

export function Chat() {
	const { chat } = useTwitchChat('codingcatdev');
	console.log(chat);
	return (
		<div className="text-purple-50 overflow-hidden relative">
			<ul className="absolute bottom-0 left-0 list-none m-0 pt-0 pr-5 pb-2 pl-2">
				{chat.map((message: any) => {
					if (!message.html) {
						return;
					}

					const text = rehype()
						.data('settings', { fragment: true })
						.use(sanitize, {
							strip: ['script'],
							protocols: {
								src: ['https']
							},
							tagNames: ['img', 'marquee'],
							attributes: {
								img: ['src'],
								'*': ['alt']
							}
						})
						.processSync(message.html)
						.toString();

					if (!text.length) {
						return;
					}

					return (
						<li
							key={`${message.time}:${message.author.username}`}
							className="chat-message p-[1px] grid text-xs gap-1 grid-cols-[100px_1fr]"
						>
							<strong className={`${getUsernameColor(message.author.roles)} text-right truncate`}>
								{message.author.username}:
							</strong>
							<span className="p-1 break-words" dangerouslySetInnerHTML={{ __html: text }} />
						</li>
					);
				})}
			</ul>
		</div>
	);
}
