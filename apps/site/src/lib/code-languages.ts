/**
 * Language ids accepted by the `code` block renderer.
 *
 * `@sanity/code-input` does not constrain its language field, so the dataset
 * contains values Shiki cannot load — a real document carries
 * `language: "Zanzibar"`, and several have `null` or `""`. Astro's <Code>
 * throws on an unknown language, which would turn one bad field into a 500 for
 * the whole page, so everything is normalised through this map first.
 *
 * The list covers every value present in the production dataset plus the
 * common aliases authors are likely to reach for next.
 */
const ALIASES: Record<string, string> = {
	"": "plaintext",
	text: "plaintext",
	txt: "plaintext",
	sh: "bash",
	shell: "bash",
	zsh: "bash",
	shellscript: "bash",
	js: "javascript",
	ts: "typescript",
	py: "python",
	md: "markdown",
	yml: "yaml",
	gql: "graphql",
	proto: "protobuf",
	make: "makefile",
	dockerfile: "docker",
	vue: "vue",
	rs: "rust",
	rb: "ruby",
	kt: "kotlin",
	cs: "csharp",
	"c++": "cpp",
	objc: "objective-c",
};

const SUPPORTED_LIST = [
	"applescript",
	"astro",
	"bash",
	"c",
	"cpp",
	"csharp",
	"css",
	"dart",
	"diff",
	"docker",
	"elixir",
	"go",
	"graphql",
	"groovy",
	"html",
	"java",
	"javascript",
	"json",
	"jsonc",
	"jsx",
	"kotlin",
	"less",
	"lua",
	"makefile",
	"markdown",
	"nginx",
	"objective-c",
	"php",
	"plaintext",
	"powershell",
	"prisma",
	"protobuf",
	"python",
	"r",
	"ruby",
	"rust",
	"scala",
	"scss",
	"sql",
	"svelte",
	"swift",
	"toml",
	"tsx",
	"typescript",
	"vue",
	"xml",
	"yaml",
] as const;

/**
 * Declared as a literal union rather than `string` so the value stays
 * assignable to Astro's `CodeLanguage`. A typo in the list above becomes a
 * compile error at the <Code lang> call site instead of a runtime throw.
 */
export type SupportedLanguage = (typeof SUPPORTED_LIST)[number];

const SUPPORTED = new Set<string>(SUPPORTED_LIST);

export function normalizeLanguage(language?: string | null): SupportedLanguage {
	const raw = (language ?? "").trim().toLowerCase();
	const mapped = ALIASES[raw] ?? raw;
	return SUPPORTED.has(mapped) ? (mapped as SupportedLanguage) : "plaintext";
}
