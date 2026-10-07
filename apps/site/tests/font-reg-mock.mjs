import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const fontPath = path.resolve(__dirname, "../src/assets/fonts/Inter-Regular.ttf");
const buf = fs.existsSync(fontPath) ? fs.readFileSync(fontPath) : Buffer.from([]);
export default new Uint8Array(buf);
