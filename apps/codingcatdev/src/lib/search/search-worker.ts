import { init, search, lookup } from './search';

addEventListener('message', async (event) => {
	const { type, payload } = event.data;

	if (type === 'init') {
		const res = await fetch(`${payload.origin}/api/content.json`);
		const { blocks } = await res.json();
		init(blocks);

		postMessage({ type: 'ready' });
	}

	if (type === 'query') {
		const query = payload;
		const results = search(query);

		postMessage({ type: 'results', payload: { results, query } });
	}

	if (type === 'recents') {
		const results = payload.map(lookup).filter(Boolean);

		postMessage({ type: 'recents', payload: results });
	}
});
