import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
	return (
		<Html>
			<Head />
			<body>
				<Main />
				<NextScript />
				<iframe
					src="https://olafwempe.com/mp3/silence/silence.mp3"
					type="audio/mp3"
					allow="autoplay"
					id="audio"
					style={{ display: 'none' }}
				></iframe>
			</body>
		</Html>
	);
}
