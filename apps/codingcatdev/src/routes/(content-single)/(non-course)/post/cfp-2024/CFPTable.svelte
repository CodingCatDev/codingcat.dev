<script lang="ts">
	import { Table, tableMapperValues } from '@skeletonlabs/skeleton';
	import type { TableSource } from '@skeletonlabs/skeleton';
	import sourceData from './cfp-list.json';

	const tableSimple: TableSource = {
		// A list of heading labels.
		head: ['Name', 'Location', 'Date', 'CFP Due', 'Link'],
		// The data visibly shown in your table body UI.
		body: tableMapperValues(
			sourceData.map((s) => {
				return {
					...s,
					date: s?.date ? new Date(s.date).toDateString() : null,
					cfp: s?.cfp ? new Date(s.cfp).toDateString() : null
				};
			}),
			['name', 'location', 'date', 'cfp', 'notes']
		)
		// Optional: The data returned when interactive is enabled and a row is clicked.
		// meta: tableMapperValues(sourceData, ['position', 'name', 'symbol', 'weight']),
		// Optional: A list of footer labels.
		// foot: ['Total', '', '<code class="code">5</code>']
	};
	const mySelectionHandler = (e: any) => {
		const link = e?.detail?.at(4);
		if (link) {
			window?.open(link, '_blank')?.focus();
		}
	};
</script>

<Table source={tableSimple} interactive={true} on:selected={mySelectionHandler} />
