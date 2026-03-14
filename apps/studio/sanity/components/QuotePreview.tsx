import React from "react";
// TODO: Add stronger typing
const QuotePreview = (props: any) => {
	const { text, url } = props;
	if (!text) {
		return null;
	}
	return (
		<figure>
			<blockquote cite={url}>{text}</blockquote>
		</figure>
	);
};

const preview = (props: any) => <QuotePreview {...props} />;

export default preview;
