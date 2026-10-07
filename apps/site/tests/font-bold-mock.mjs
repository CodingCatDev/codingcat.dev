import fs from "node:fs";

const buf = fs.readFileSync(
	"/home/alex/codingcat.dev/apps/site/src/assets/fonts/Inter-Bold.ttf",
);
export default new Uint8Array(buf);
