export const youtubeParser = (url: string) => {
	const regExp =
		/.*(?:youtu.be\/|(?:youtube.com\/live\/)|(?:youtube.com\/shorts\/)|v\/|u\/\w\/|embed\/|watch\?v=)([^#\&\?]*).*/;
	const match = url.match(regExp);
	return match && match[1].length == 11 ? match[1] : false;
};
