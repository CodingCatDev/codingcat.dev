export interface Episode {
	title: string;
	description: string;
	link: string;
	guid: {
		id: string;
		isPermaLink: boolean;
	};
	pubDate: string;
	enclosures: {
		url: string;
		length: number;
		type: string;
	}[];
	itunes: {
		summary: string;
		explicit: string;
		duration: string;
		season: string;
		episode: string;
		episodeType: string;
		image: {
			href: string;
		};
	};
}
