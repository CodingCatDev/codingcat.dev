import { htmlToBlocks } from "@portabletext/block-tools";
import { micromark } from "micromark";
import { gfmTable, gfmTableHtml } from "micromark-extension-gfm-table";

interface Input {
	event: ClipboardEvent;
	schemaTypes: SchemaTypes;
	path: Array<any>;
}

interface SchemaTypes {
	blockObjects: Array<{ name: string }>;
	portableText: any;
}

interface Block {
	_type: "code";
	code: string;
	language: string;
}

interface InsertPatch {
	insert: ReturnType<typeof htmlToBlocks>;
	path: Array<any>;
}

export async function handlePaste(
	input: Input,
): Promise<InsertPatch | undefined> {
	const { event, schemaTypes, path } = input;
	const text = event.clipboardData?.getData("text/plain");
	const json = event.clipboardData?.getData("application/json");

	if (text && !json) {
		const html = micromark(text, {
			extensions: [gfmTable()],
			htmlExtensions: [gfmTableHtml()],
		});
		return html
			? convertHtmlToSanityPortableTextPatch(html, schemaTypes, path)
			: undefined;
	}

	return undefined;
}

function convertHtmlToSanityPortableTextPatch(
	html: string,
	schemaTypes: SchemaTypes,
	path: Array<any>,
): InsertPatch | undefined {
	if (!html) return undefined;

	const blocks = htmlToBlocks(html, schemaTypes.portableText, {
		rules: [
			// @ts-ignore
			{ deserialize: deserializeCodeBlockElement },
			// @ts-ignore
			{ deserialize: deserializeTableElement },
		],
	});

	return blocks ? { insert: blocks, path } : undefined;
}

function isTableTypeAvailable(schemaTypes: SchemaTypes): boolean {
	const hasTableType = schemaTypes.blockObjects.some(
		(type) => type.name === "table",
	);
	if (!hasTableType) {
		console.warn(
			"A table type is not defined in the schema. This is required to paste tables.",
		);
	}
	return hasTableType;
}

function isCodeTypeAvailable(schemaTypes: SchemaTypes): boolean {
	const hasCodeType = schemaTypes.blockObjects.some(
		(type) => type.name === "code",
	);
	if (!hasCodeType) {
		console.warn(
			'Run `sanity install @sanity/code-input` and add `type: "code"` to your schema.',
		);
	}
	return hasCodeType;
}

function deserializeCodeBlockElement(
	el: Element,
	next: any,
	block: (block: any) => any,
): Block | undefined {
	if (!isPreformattedText(el)) return undefined;

	const codeElement = el.children[0];
	const childNodes = getCodeChildNodes(el, codeElement as Element);
	const codeText = extractTextFromNodes(childNodes);
	const language = mapLanguageAliasToActualLanguage(
		getLanguageAlias(codeElement as Element),
	);

	return block({
		_type: "code",
		code: codeText,
		language,
	});
}

function isPreformattedText(el: Element): boolean {
	return el && el.children && el.tagName && el.tagName.toLowerCase() === "pre"
		? true
		: false;
}

function getCodeChildNodes(
	el: Element,
	codeElement: Element,
): NodeListOf<ChildNode> {
	return codeElement && codeElement.tagName.toLowerCase() === "code"
		? codeElement.childNodes
		: el.childNodes;
}

function extractTextFromNodes(childNodes: NodeListOf<ChildNode>): string {
	return Array.from(childNodes)
		.map((node) => node.textContent || "")
		.join("");
}

function getLanguageAlias(codeElement: Element): string {
	return codeElement.className.replace("language-", "");
}

function mapLanguageAliasToActualLanguage(languageAlias: string): string {
	const languageMapping = {
		js: "javascript",
		ts: "typescript",
	};
	return (
		languageMapping[languageAlias as keyof typeof languageMapping] ||
		(languageAlias as string)
	);
}

function deserializeTableElement(
	el: Element,
	next: any,
	block: (block: any) => any,
) {
	if (el?.tagName?.toLowerCase() !== "table") {
		return undefined;
	}

	const rows = Array.from(el.querySelectorAll("tr")).map((tr) => {
		const cells = Array.from(tr.querySelectorAll("th, td")).map((td) => {
			const link = td.querySelector("a");
			if (link) {
				return `[${link.textContent}](${link.href})`;
			}
			return td.textContent;
		});
		return {
			_type: "row",
			cells,
		};
	});

	if (rows.length >= 2) {
		const headCells = (rows[0].cells ?? []).map((c) => (c || "").trim());
		const bodyRows = rows.slice(1);
		const firstHeader = (headCells[0] ?? "").toLowerCase();
		const isTierTable =
			(firstHeader === "tier" ||
				firstHeader === "tier rank" ||
				firstHeader === "rank") &&
			bodyRows.every((r) =>
				/^[sabcd](\b|-|\s|$)/i.test(((r.cells ?? [])[0] ?? "").trim()),
			);

		if (isTierTable) {
			const verdictIdx = headCells.findIndex((h) =>
				/verdict|why|summary|notes/i.test(h),
			);
			const pricingIdx = headCells.findIndex((h) =>
				/price|pricing|cost|quota/i.test(h),
			);

			const items = bodyRows.map((row, rIdx) => {
				const cells = (row.cells ?? []).map((c) => (c || "").trim());
				const rawTier = (cells[0] ?? "B").toUpperCase().charAt(0);
				const tier =
					rawTier === "S" ||
					rawTier === "A" ||
					rawTier === "B" ||
					rawTier === "C" ||
					rawTier === "D"
						? rawTier
						: "B";
				const name = cells[1] || `Platform ${rIdx + 1}`;
				const category = cells[2] || "";
				const summary =
					verdictIdx >= 3 && cells[verdictIdx]
						? cells[verdictIdx]
						: cells[3] || "";

				const details = [];
				for (let cIdx = 3; cIdx < cells.length; cIdx++) {
					const val = cells[cIdx];
					if (!val || val === summary) continue;
					details.push({
						_type: "tierDetail",
						label: headCells[cIdx] || `Spec ${cIdx - 2}`,
						value: val,
					});
				}

				const badge =
					pricingIdx >= 2 && cells[pricingIdx] ? cells[pricingIdx] : undefined;

				return {
					_type: "tierItem",
					tier,
					name,
					...(category ? { category } : {}),
					...(summary ? { summary } : {}),
					...(badge ? { badge } : {}),
					details,
				};
			});

			return block({
				_type: "tierList",
				title: `Alex's Architectural Tier List (${items.length} Platforms Ranked)`,
				subtitle:
					"Ranked from S-Tier (Purrfect Production Pick) to D-Tier based on security boundaries, memory architecture, and real-world DX.",
				ajComment: "I ranked all of them! Watch out for shared VMs... 👀🐾",
				items,
			});
		}
	}

	return block({
		_type: "table",
		rows,
	});
}
