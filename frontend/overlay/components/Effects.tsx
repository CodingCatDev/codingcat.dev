import { useEffect, useState } from 'preact/hooks';
import { useSoundEffect } from '@/hooks/useSoundEffect';
import * as splitting from 'splitting';
//TODO: remove all the any

const customEffects: any = {};

function DefaultEffectDisplay({
	state,
	effect
}: {
	state: string;
	effect: { author: { username: string }; command: { name: string; image: string } };
}) {
	const [caption, setCaption] = useState('');
	const { author, command } = effect;
	useEffect(() => {
		async function loadSplitting() {
			if (!author || !command) {
				return;
			}

			// doing it this way avoids an issue where Splitting and React get
			// out of sync and end up duplicating text
			const htmlToSplit = `
        <div class="command-text" data-splitting>
          <span class="username">${author.username}</span>
          <span class="text">redeemed</span>
          <span class="effect">${command.name}</span>
        </div>
      `;

			setCaption(splitting.html({ content: htmlToSplit, by: 'chars' }));
		}

		loadSplitting();
	}, [author, command]);

	return (
		<div className={`command-display ${['starting', 'active'].includes(state) ? 'visible' : ''}`}>
			{command.image && <img className="command-image" src={command.image} alt="" />}
			<div dangerouslySetInnerHTML={{ __html: caption }} />
		</div>
	);
}

export function Effects() {
	const state: any = useSoundEffect();
	// don’t show anything if we’re idle or don’t have a valid command
	console.log('state', state);
	if (state.value === 'idle' || !state?.context?.current || !state?.context?.current?.command) {
		return <></>;
	}

	const commandName: string = state.context.current.command.name;
	let EffectDisplay = DefaultEffectDisplay;
	if (customEffects.hasOwnProperty(commandName)) {
		EffectDisplay = customEffects[commandName];
	}

	return <EffectDisplay state={state.value} effect={state.context.current} />;
}
