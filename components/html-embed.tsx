export default function HTMLEmbed(props: any) {
	const { html } = props;
	if (!html) {
		return <div>Hello World!</div>;
	}
	return <div dangerouslySetInnerHTML={{ __html: html }} />;
}
