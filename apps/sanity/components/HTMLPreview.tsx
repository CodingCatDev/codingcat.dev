import React from "react";
// TODO: Add stronger typing
const HTMLPreview = (props: any) => {
	const { html } = props;
	if (!html) {
		return <div>Add some HTML</div>;
	}
	return <div dangerouslySetInnerHTML={{ __html: html }} />;
};

const preview = (props: any) => <HTMLPreview {...props} />;

export default preview;
