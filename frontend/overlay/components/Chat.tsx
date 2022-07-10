import { useTwitchChat } from '@socket-studio/preact';
import rehype from 'rehype';
import sanitize from 'rehype-sanitize';
import AJHeadphones from './AJHeadphones';
import AJHeartsLeft from './AJHeartAlt';
import AJAlt from './AJAlt';

function getUsernameColor(roles: string[]) {
	if (roles.includes('BROADCASTER')) {
		return 'border-2 border-purple-500 text-white rounded p-1';
	}

	if (roles.includes('MODERATOR')) {
		return 'bg-purple-500 text-purple-50 rounded p-1';
	}

	if (roles.includes('SUBSCRIBER')) {
		return 'bg-purple-500 text-purple-50 rounded p-1';
	}

	return 'p-1';
}

function getRoleTag(roles: string[]) {
	if (roles.includes('BROADCASTER')) {
		return (
			<div className="pr-1">
				<AJAlt className="w-4 h-4" />
			</div>
		);
	}

	if (roles.includes('MODERATOR')) {
		return (
			<div className="pr-1">
				<AJHeadphones className="w-4 h-4" />
			</div>
		);
	}

	if (roles.includes('SUBSCRIBER')) {
		return (
			<div className="pr-1">
				<AJHeartsLeft className="w-4 h-4" />
			</div>
		);
	}

	return '';
}

export function Chat({ chatMessageClass }: { chatMessageClass: string }) {
	const { chat } = useTwitchChat('codingcatdev');
	return (
		<>
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
						className={`chat-message ${chatMessageClass}`}
					>
						<strong className={`flex ${getUsernameColor(message.author.roles)} truncate`}>
							{getRoleTag(message.author.roles)}
							{message.author.username}:
						</strong>
						<span className="p-1 break-all" dangerouslySetInnerHTML={{ __html: text }} />
					</li>
				);
			})}
		</>
	);
}
