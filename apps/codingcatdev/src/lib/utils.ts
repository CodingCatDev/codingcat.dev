/** @param {string} name */
export function get_depth(name: string) {
	return name.split('/').length - 1;
}
