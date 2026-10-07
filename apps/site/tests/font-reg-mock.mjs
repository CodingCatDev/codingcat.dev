import fs from "node:fs";

const buf = fs.readFileSync(
	"/home/alex/codingcat.dev/apps/site/src/assets/fonts/Inter-Regular.ttf",
);
export default new Uint8Array(buf);
