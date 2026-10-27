import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";

const projectId = process.env.SANITY_STUDIO_PROJECT_ID || "hfh83o0w";
const dataset = process.env.SANITY_STUDIO_DATASET || "production";
const token = process.env.SANITY_API_WRITE_TOKEN || process.env.SANITY_AUTH_TOKEN;
const isDryRun = process.argv.includes("--dry-run") || !token;

const DOC_ID = "post-anthropic-s1-circular-ai-economy-2026";
const SLUG = "anthropic-s1-ipo-circular-ai-economy-etf-risk";
const ALEX_AUTHOR_REF = "RIgC5r4TJ0hCGOzxHszD1w";

const IMAGE_DIR = path.resolve(
  process.cwd(),
  "apps/site/public/images/posts/anthropic-s1-circular-ai"
);

function cleanDashes(text, { trim = true } = {}) {
  if (!text) return "";
  const cleaned = String(text)
    .replace(/\s*[—–]\s*/g, ", ")
    .replace(/\s+--\s+/g, ", ")
    .replace(/\s{2,}/g, " ");
  return trim ? cleaned.trim() : cleaned;
}

function makeKey(prefix, seed) {
  const hash = crypto.createHash("md5").update(String(seed)).digest("hex").slice(0, 10);
  return `s1_${prefix}_${hash}`;
}

function shouldInsertSpaceBetweenSpans(pText, cText) {
  if (!pText || !cText) return false;
  if (/\s$/.test(pText) || /^\s/.test(cText)) return false;

  const lastChar = pText.slice(-1);
  const firstChar = cText.slice(0, 1);

  if (/^[.,;:!?)\]}’']/.test(firstChar)) return false;
  if (/^["”](\s|[.,;:!?)]|$)/.test(cText)) return false;
  if (/[(\[{]$/.test(lastChar) && pText.length === 1) return false;
  if (/(^|\s)[(\[{"“‘]$/.test(pText)) return false;
  if (pText === "-" || cText === "-") return false;

  return true;
}

function normalizeBlockSpacing(block) {
  if (!block || block._type !== "block" || !Array.isArray(block.children) || block.children.length < 2) {
    return block;
  }
  const linkMarkKeys = new Set((block.markDefs || []).map((m) => m._key));
  const children = block.children.map((c) => ({
    ...c,
    marks: Array.isArray(c.marks) ? [...c.marks] : [],
  }));

  const out = [];
  for (let i = 0; i < children.length; i++) {
    const curr = children[i];
    if (out.length > 0) {
      const prev = out[out.length - 1];
      if (shouldInsertSpaceBetweenSpans(prev.text, curr.text)) {
        const prevHasLinkOrCode = prev.marks.some((m) => m === "code" || linkMarkKeys.has(m));
        const currHasLinkOrCode = curr.marks.some((m) => m === "code" || linkMarkKeys.has(m));
        if (!prevHasLinkOrCode) {
          prev.text = `${prev.text} `;
        } else if (!currHasLinkOrCode) {
          curr.text = ` ${curr.text}`;
        } else {
          out.push({
            _type: "span",
            _key: `${prev._key || "sp"}_sep_${i}`,
            marks: [],
            text: " ",
          });
        }
      }
    }
    out.push(curr);
  }
  return { ...block, children: out };
}

function createTextBlock(text, style = "normal", keySeed = text) {
  return {
    _type: "block",
    _key: makeKey(style, keySeed),
    style,
    markDefs: [],
    children: [
      {
        _type: "span",
        _key: makeKey("span", keySeed),
        marks: [],
        text: cleanDashes(text),
      },
    ],
  };
}

function createRichBlock(
  segments,
  { style = "normal", listItem = undefined, level = undefined, keySeed = "" } = {}
) {
  const markDefs = [];
  const children = [];
  segments.forEach((seg, i) => {
    const hasMark = Boolean(seg.href || seg.code || seg.strong || seg.em);
    const rawText = cleanDashes(seg.text || "", { trim: hasMark });
    if (!rawText) return;
    const marks = [];
    if (seg.strong) marks.push("strong");
    if (seg.em) marks.push("em");
    if (seg.code) marks.push("code");
    if (seg.href) {
      const markKey = makeKey(`lnk${i}`, `${keySeed}_${seg.href}_${i}`);
      markDefs.push({
        _key: markKey,
        _type: "link",
        href: seg.href,
        blank: !seg.href.startsWith("/") && !seg.href.startsWith("https://codingcat.dev"),
      });
      marks.push(markKey);
    }
    children.push({
      _type: "span",
      _key: makeKey(`sp${i}`, `${keySeed}_${i}_${rawText.slice(0, 18)}`),
      marks,
      text: rawText,
    });
  });

  const block = {
    _type: "block",
    _key: makeKey("blk", keySeed || JSON.stringify(segments).slice(0, 40)),
    style,
    markDefs,
    children,
  };
  if (listItem) {
    block.listItem = listItem;
    block.level = level || 1;
  }
  return normalizeBlockSpacing(block);
}

function createTableBlock(rows, keySeed) {
  return {
    _type: "table",
    _key: makeKey("tbl", keySeed),
    rows: rows.map((cells, rIdx) => ({
      _type: "row",
      _key: makeKey(`row${rIdx}`, `${keySeed}_r${rIdx}`),
      cells: cells.map((cell) => cleanDashes(String(cell))),
    })),
  };
}

function createCodeBlock(code, language = "typescript", keySeed = code.slice(0, 32)) {
  return {
    _type: "code",
    _key: makeKey("code", keySeed),
    language,
    code: String(code).trim(),
  };
}

function createImageBlock(assetRef, alt, caption, keySeed) {
  return {
    _type: "image",
    _key: makeKey("img", keySeed),
    asset: {
      _type: "reference",
      _ref: assetRef,
    },
    alt: cleanDashes(alt),
    caption: cleanDashes(caption),
  };
}

async function uploadJpegToSanity(filename, targetDataset) {
  const filePath = path.join(IMAGE_DIR, filename);
  const buffer = fs.readFileSync(filePath);
  if (isDryRun) {
    return `image-dryrun-${filename.replace(/[^a-z0-9]/gi, "")}-1408x768-jpg`;
  }
  const res = await fetch(
    `https://${projectId}.api.sanity.io/v2024-01-01/assets/images/${targetDataset}?filename=${encodeURIComponent(
      filename
    )}`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "image/jpeg",
      },
      body: buffer,
    }
  );
  if (!res.ok) {
    throw new Error(`Failed uploading ${filename}: ${res.status} ${await res.text()}`);
  }
  const { document } = await res.json();
  console.log(`Uploaded ${filename} to ${targetDataset}: ${document._id}`);
  return document._id;
}

export async function buildCircularAiPost(assetRefs) {
  const blocks = [];

  // 1. 15-Second Hook
  blocks.push(
    createRichBlock(
      [
        {
          text: "While reading through ",
        },
        {
          text: "Anthropic's Form S-1 SEC registration statement",
          href: "https://www.sec.gov/Archives/edgar/data/2130357/000162828026067168/anthropicpbc-sx1.htm",
          strong: true,
        },
        {
          text: " for its proposed Nasdaq IPO under ticker ",
        },
        { text: "ANT", code: true },
        {
          text: " today, a few infrastructure and accounting details in the footnotes stood out that show how much of Big Tech's AI revenue is the same pile of capital circulating between seven companies.",
        },
      ],
      { style: "normal", keySeed: "hook_p1" }
    )
  );

  blocks.push(
    createRichBlock(
      [
        {
          text: "On October 26, 2026, ",
        },
        {
          text: "Anthropic officially announced its S-1 filing with the SEC",
          href: "https://www.anthropic.com/news/s1-sec",
          strong: true,
        },
        {
          text: ". Within minutes of the EDGAR upload (",
        },
        { text: "CIK 0002130357", code: true },
        {
          text: ", Accession No. ",
        },
        { text: "0001628280-26-067168", code: true },
        {
          text: "), developers and financial analysts started digging through the footnotes. What those footnotes reveal is not just the story of Claude. It is the blueprint for a $500B+ circular vendor-financing loop connecting ",
        },
        {
          text: "Sundar Pichai",
          href: "https://www.google.com/search?kgmid=%2Fm%2F09gds74&q=Sundar+Pichai",
          strong: true,
        },
        { text: " (Google), " },
        {
          text: "Satya Nadella",
          href: "https://www.google.com/search?kgmid=%2Fm%2F0q40xjj&q=Satya+Nadella",
          strong: true,
        },
        { text: " (Microsoft), " },
        {
          text: "Jensen Huang",
          href: "https://www.google.com/search?kgmid=%2Fm%2F06n774&q=Jensen+Huang",
          strong: true,
        },
        { text: " (NVIDIA), " },
        {
          text: "Mark Zuckerberg",
          href: "https://www.google.com/search?kgmid=%2Fm%2F086dny&q=Mark+Zuckerberg",
          strong: true,
        },
        { text: " (Meta), " },
        {
          text: "Elon Musk",
          href: "https://www.google.com/search?kgmid=%2Fm%2F03nzf1&q=Elon+Musk",
          strong: true,
        },
        { text: " (xAI and Tesla), " },
        {
          text: "Tim Cook",
          href: "https://www.google.com/search?kgmid=%2Fm%2F05r65m&q=Tim+Cook",
          strong: true,
        },
        {
          text: " (Apple), Andy Jassy (AWS), and Dario Amodei (Anthropic).",
        },
      ],
      { style: "normal", keySeed: "hook_p2" }
    )
  );

  // Embedded Tweet from @anthropicai
  blocks.push({
    _type: "twitter",
    _key: makeKey("tw", "anthropic_s1_tweet_2114705042817110293"),
    id: "2114705042817110293",
    url: "https://x.com/anthropicai/status/2114705042817110293?s=46&t=KnvZDYli0fqcMPwCZUmAeg",
    author: "Anthropic",
    handle: "anthropicai",
    date: "October 26, 2026",
    text: "Anthropic has filed an S-1 registration statement with the SEC related to its proposed IPO.\n\nRead more: anthropic.com/news/s1-sec\n\nLegal disclaimer: A registration statement relating to these securities has been filed with the SEC but has not yet become effective. These securities may not be sold nor may offers to buy be accepted prior to the time the registration statement becomes effective.",
  });

  // Hero Portrait Inline
  blocks.push(
    createImageBlock(
      assetRefs.hero,
      "The Heads of AI (Elon Musk, Mark Zuckerberg, Satya Nadella, Dario Amodei, Jensen Huang, Sundar Pichai, and Tim Cook) wearing black company logo t-shirts and shaking hands in a criss-cross web while speech bubbles explain their circular cloud and GPU investments",
      "Visual Diagram: The Trillion-Dollar Handshake. How Elon Musk, Mark Zuckerberg, Satya Nadella, Dario Amodei, Jensen Huang, Sundar Pichai, and Tim Cook trade venture investments for cloud compute and GPU orders.",
      "hero_inline"
    )
  );

  // 2. Section: Anthropic's S-1 by the Numbers
  blocks.push(
    createTextBlock(
      "Inside Anthropic's Form S-1: $16.3B H1 Revenue, an $80.7B GAAP Loss, and $518B in Cloud Lock-In",
      "h2",
      "h2_s1_numbers"
    )
  );

  blocks.push(
    createRichBlock(
      [
        {
          text: "Let's look at the raw numbers inside ",
        },
        {
          text: "Anthropic's S-1 filing (anthropicpbc-sx1.htm)",
          href: "https://www.sec.gov/Archives/edgar/data/2130357/000162828026067168/anthropicpbc-sx1.htm",
          strong: true,
        },
        {
          text: " before we trace where the money goes. On the surface, Anthropic's top-line growth is the fastest enterprise software ramp in Silicon Valley history, driven by Claude Code and enterprise API adoption. Full-year revenue jumped 12x from roughly $381 million in FY 2024 to $4.6 billion in FY 2025. In the first six months of 2026 alone (H1 2026), revenue hit $16.286 billion, with Q2 2026 generating $11.555 billion in a single quarter.",
        },
      ],
      { style: "normal", keySeed: "s1_p1" }
    )
  );

  blocks.push(
    createRichBlock(
      [
        {
          text: "Then you look down the income statement and contractual footnotes, and two massive realities jump off the page:",
        },
      ],
      { style: "normal", keySeed: "s1_p2" }
    )
  );

  blocks.push(
    createRichBlock(
      [
        { text: "The $80.748 Billion H1 2026 GAAP Net Loss: ", strong: true },
        {
          text: "While Anthropic narrowed its H1 2026 core operating loss to $693 million and generated $3.929 billion in positive operating cash flow, its GAAP net loss for those six months was a jaw-dropping $80.748 billion. Why? Because $72.388 billion of that loss came from non-cash mark-to-market revaluations of convertible notes and derivative liabilities issued to hyperscaler backers like Amazon and Google as Anthropic's private valuation surged toward $965 billion.",
        },
      ],
      { style: "normal", listItem: "bullet", keySeed: "s1_b1" }
    )
  );

  blocks.push(
    createRichBlock(
      [
        { text: "The $518 Billion Take-or-Pay Cloud Mortgage: ", strong: true },
        {
          text: "As reported by ",
        },
        {
          text: "The New York Times on Google's $40B Anthropic commitment",
          href: "https://www.nytimes.com/2026/04/24/technology/google-anthropic-investment-artificial-intelligence.html",
          strong: true,
        },
        {
          text: ", Google committed up to $40 billion ($10 billion immediate cash plus $30 billion milestone-contingent financing) on top of its earlier $3B+ stake, while Amazon expanded its $8 billion investment by up to another $25 billion (up to $33 billion total). In exchange, Anthropic signed non-cancellable multi-year cloud purchase commitments totaling $111.1B to $114.5B to Google Cloud through July 2033, $110B to AWS through April 2036, and $31.4B to $44.9B to Microsoft Azure through 2033. Including Broadcom TPU leases and GPU neoclouds, Anthropic is locked into roughly $450B to $518B+ of fixed infrastructure obligations over the next decade, with nearly 80% structured as rigid take-or-pay contracts.",
        },
      ],
      { style: "normal", listItem: "bullet", keySeed: "s1_b2" }
    )
  );

  blocks.push(
    createRichBlock(
      [
        { text: "The 16% Cloud Marketplace Toll: ", strong: true },
        {
          text: "In 2025, 47% of Anthropic's total revenue ($2.16 billion) flowed through AWS Bedrock and Google Cloud Vertex AI marketplaces. For every dollar an enterprise spends on Claude through Bedrock or Vertex AI, Amazon and Google skim roughly 16 cents off the top in distribution fees before Anthropic pays those exact same clouds billions more to rent the underlying Trainium2 and TPU silicon.",
        },
      ],
      { style: "normal", listItem: "bullet", keySeed: "s1_b3" }
    )
  );

  // Table 1: S-1 Breakdown
  blocks.push(
    createTableBlock(
      [
        [
          "S-1 Metric / Governance Tier",
          "Filing Figure (SEC CIK 0002130357)",
          "Counterparty / Holder",
          "Why It Matters for Developers & Investors",
        ],
        [
          "H1 2026 Revenue vs. FY 2025",
          "$16.286B (H1 2026) vs. $4.6B (FY 2025)",
          "Claude Code, API & Enterprise",
          "14x YoY H1 growth, but 47% of 2025 sales ran through AWS/GCP marketplaces at a ~16% fee.",
        ],
        [
          "H1 2026 GAAP Net Loss",
          "-$80.748B (-$693M operating loss)",
          "Convertible Note Holders (AMZN, GOOGL)",
          "$72.388B is non-cash fair-value adjustment on convertible debt as valuation hit $965B.",
        ],
        [
          "Google Cloud Purchase Obligation",
          "$111.1B to $114.5B (2026 to 2033)",
          "Alphabet / Google Cloud (TPU v5p, Trillium)",
          "Paired with Google's up to $40B investment commitment; recycles cash into GCP revenue.",
        ],
        [
          "AWS Purchase Obligation",
          "$110.0B (2026 to 2036)",
          "Amazon Web Services (Trainium2, Bedrock)",
          "Paired with Amazon's up to $33B investment; locks Anthropic into AWS custom silicon.",
        ],
        [
          "Microsoft Azure Obligation",
          "$31.4B to $44.9B (through 2033)",
          "Microsoft Azure AI Foundry",
          "Even OpenAI's biggest backer gets tens of billions in guaranteed Anthropic cloud spend.",
        ],
        [
          "Total Compute Commitments",
          "$450B to $518B+ (~80% Take-or-Pay)",
          "GCP, AWS, Azure, Broadcom, Lambda, Nscale",
          "Anthropic must pay for multi-gigawatt clusters regardless of future model pricing drops.",
        ],
        [
          "Class A / Class F / Class T / Class N Shares",
          "Class A capped at 49.9%; 1 Class F share = 50.1%",
          "Public (A), Founders (F), LTBT Trust (T), GOOGL/AMZN (N)",
          "Public IPO buyers get minority voting power; Long-Term Benefit Trust controls the board.",
        ],
      ],
      "table_s1_metrics"
    )
  );

  // Diagram 1: Circular Revenue Loop
  blocks.push(
    createImageBlock(
      assetRefs.diagram1,
      "Architecture Diagram of the AI Circular Revenue Loop showing how Google, AWS, Microsoft, and NVIDIA invest billions into Anthropic, OpenAI, xAI, and CoreWeave, which immediately flows back as booked Cloud and GPU revenue",
      "Architecture Diagram: The AI Circular Revenue Loop (Round-Tripping). One dollar of hyperscaler venture capital immediately returns as one dollar of booked cloud and GPU revenue.",
      "diag_1_circular_loop"
    )
  );

  // 3. Section: Dario Amodei's Two Essays vs. S-1 Reality
  blocks.push(
    createTextBlock(
      "Dario Amodei's Two Essays vs. The S-1 Balance Sheet: How Much Does a 'Country of Geniuses' Cost?",
      "h2",
      "h2_dario_essays"
    )
  );

  blocks.push(
    createRichBlock(
      [
        {
          text: "To understand why Anthropic signed $518 billion in non-cancellable cloud leases, you have to read Dario Amodei's two foundational essays side by side with the S-1 risk factors. In October 2024, Dario published ",
        },
        {
          text: "Machines of Loving Grace: How AI Could Transform the World for the Better",
          href: "https://darioamodei.com/essay/machines-of-loving-grace",
          strong: true,
        },
        {
          text: ". In that essay, he coined the phrase ",
        },
        { text: "\"a country of geniuses in a datacenter\"", em: true },
        {
          text: ": millions of autonomous frontier model instances smarter than Nobel Prize winners, running at 10x to 100x human speed, compressing 50 to 100 years of biological research, cancer cures, neuroscience, and economic development into a single 5 to 10 year window.",
        },
      ],
      { style: "normal", keySeed: "dario_p1" }
    )
  );

  blocks.push(
    createRichBlock(
      [
        {
          text: "Fifteen months later, in January 2026, Dario published the darker companion essay, ",
        },
        {
          text: "The Adolescence of Technology: Confronting and Overcoming the Risks of Powerful AI",
          href: "https://darioamodei.com/essay/the-adolescence-of-technology",
          strong: true,
        },
        {
          text: ". Opening with Carl Sagan's famous question from ",
        },
        { text: "Contact", em: true },
        {
          text: " (\"How did you survive this technological adolescence without destroying yourself?\"), Dario mapped out five existential danger zones: autonomous alignment failures (",
        },
        { text: "\"I'm sorry, Dave\"", em: true },
        { text: "), biological and cyber weaponization (" },
        { text: "\"A surprising and terrible empowerment\"", em: true },
        { text: "), authoritarian surveillance (" },
        { text: "\"The odious apparatus\"", em: true },
        { text: "), and in Section 4, titled " },
        { text: "\"Player piano\"", em: true },
        {
          text: " after Kurt Vonnegut's novel, the risk of extreme economic disruption and wealth concentration in a tiny handful of compute-owning entities.",
        },
      ],
      { style: "normal", keySeed: "dario_p2" }
    )
  );

  // Diagram 3: Dario Essays vs S-1 Reality
  blocks.push(
    createImageBlock(
      assetRefs.diagram3,
      "Architecture Diagram comparing Dario Amodei's essays Machines of Loving Grace and The Adolescence of Technology on the left against Anthropic's S-1 SEC filing reality on the right",
      "Visual Diagram: Dario Amodei's Philosophical Vision vs. Anthropic's S-1 Financial Reality. Building a 'country of geniuses in a datacenter' required mortgaging $518B to the world's largest cloud monopolies.",
      "diag_3_dario_vs_s1"
    )
  );

  blocks.push(
    createRichBlock(
      [
        {
          text: "Here is the central paradox exposed by the S-1 filing: in ",
        },
        {
          text: "The Adolescence of Technology",
          href: "https://darioamodei.com/essay/the-adolescence-of-technology",
          strong: true,
        },
        {
          text: ", Dario warns that AI could concentrate unprecedented economic power in a few giant corporations. Yet nine months later, Anthropic's S-1 proves that surviving the compute race to build that \"country of geniuses\" required signing over $518 billion in take-or-pay infrastructure contracts to Google, Amazon, Microsoft, NVIDIA, and Broadcom. Even with Anthropic's Long-Term Benefit Trust (",
        },
        { text: "Class T", code: true },
        {
          text: " shares) and founder super-voting stock (",
        },
        { text: "Class F", code: true },
        {
          text: " controlling 50.1%), a Public Benefit Corporation that owes half a trillion dollars in non-cancellable cloud rent cannot simply pause the treadmill when Wall Street expects quarterly growth.",
        },
      ],
      { style: "normal", keySeed: "dario_p3" }
    )
  );

  // 4. Section: Deep Research on the 6+ AI Titans & Frenemy Stack
  blocks.push(
    createTextBlock(
      "Who Actually Runs on Whom? Deep Breakdown of the 7 AI Titans' Frenemy Stack",
      "h2",
      "h2_frenemy_stack"
    )
  );

  blocks.push(
    createRichBlock(
      [
        {
          text: "In public, ",
        },
        {
          text: "Mark Zuckerberg",
          href: "https://www.google.com/search?kgmid=%2Fm%2F086dny&q=Mark+Zuckerberg",
          strong: true,
        },
        { text: ", " },
        {
          text: "Elon Musk",
          href: "https://www.google.com/search?kgmid=%2Fm%2F03nzf1&q=Elon+Musk",
          strong: true,
        },
        { text: ", " },
        {
          text: "Jensen Huang",
          href: "https://www.google.com/search?kgmid=%2Fm%2F06n774&q=Jensen+Huang",
          strong: true,
        },
        { text: ", " },
        {
          text: "Sundar Pichai",
          href: "https://www.google.com/search?kgmid=%2Fm%2F09gds74&q=Sundar+Pichai",
          strong: true,
        },
        { text: ", " },
        {
          text: "Satya Nadella",
          href: "https://www.google.com/search?kgmid=%2Fm%2F0q40xjj&q=Satya+Nadella",
          strong: true,
        },
        { text: ", and " },
        {
          text: "Tim Cook",
          href: "https://www.google.com/search?kgmid=%2Fm%2F05r65m&q=Tim+Cook",
          strong: true,
        },
        {
          text: " position their companies as fierce rivals fighting for AI dominance. Under the hood, their infrastructure stacks are completely entangled. Every \"competitor\" is simultaneously a customer, supplier, landlord, or venture investor in the others:",
        },
      ],
      { style: "normal", keySeed: "titans_intro" }
    )
  );

  // Diagram 2: Cross-Stack Tech Dependencies
  blocks.push(
    createImageBlock(
      assetRefs.diagram2,
      "Architecture Diagram showing Big Tech's Hidden AI Stack across Anthropic Claude, Meta Llama, Apple Intelligence, and xAI Colossus converging on TSMC and NVIDIA",
      "Architecture Diagram: Who Actually Runs on Whom? Beneath the rival brand logos, Anthropic, Meta, Apple, and xAI cross-license models, cloud capacity, and search grounding while funneling capex into TSMC and NVIDIA.",
      "diag_2_hidden_stack"
    )
  );

  // Diagram 5: Meta / Gemini & Anthropic / GCP + AWS
  blocks.push(
    createImageBlock(
      assetRefs.diagram5,
      "Architecture Diagram showing how Meta AI uses Google Cloud, Gemini, and Google Search grounding on the left, while Anthropic Claude runs on Google Cloud TPUs, AWS Trainium2, and NVIDIA GPUs on the right",
      "Architecture Diagram: Inside the Frenemy Cloud Stack. How Meta combines 1M+ NVIDIA GPUs with Google Cloud and Gemini Search grounding, while Anthropic splits its workload across Google Cloud TPUs and AWS Trainium2.",
      "diag_5_frenemy_cloud"
    )
  );

  // Table 2: The 7 AI Titans Comparison Matrix
  blocks.push(
    createTableBlock(
      [
        [
          "Leader & Company",
          "2026 Annual AI Capex",
          "Circular Investment & Equity Stakes",
          "Hidden Frenemy Stack Dependencies",
        ],
        [
          "Sundar Pichai (Google / Alphabet)",
          "$195B to $205B",
          "Up to $40B in Anthropic (~14% non-voting Class N stake)",
          "Hosts Anthropic on GCP TPUs ($114.5B obligation); powers Apple Intelligence with Gemini; provides Google Cloud & Search grounding to Meta AI.",
        ],
        [
          "Satya Nadella (Microsoft)",
          "~$175B",
          "$14B+ in OpenAI, plus stakes in Anthropic, Mistral, G42",
          "Collects Azure compute spend from both OpenAI and Anthropic ($31.4B to $44.9B S-1 obligation); hosts Llama, Grok, and Claude on Azure Foundry.",
        ],
        [
          "Jensen Huang (NVIDIA)",
          "Hardware Arms Dealer (~80% Gross Margin)",
          "Invests in OpenAI, xAI, CoreWeave, Mistral, Perplexity, Scale AI, Lambda",
          "Gets ~45% to 50%+ of Data Center revenue from Microsoft, Meta, Google, Amazon, and xAI; relies 100% on TSMC 3nm/2nm and CoWoS packaging.",
        ],
        [
          "Mark Zuckerberg (Meta Platforms)",
          "$130B to $145B+",
          "Open-weights Llama strategy to commoditize paid model APIs",
          "Buys 1M+ NVIDIA H100/Blackwell GPUs; uses Google Cloud and Google Search/Gemini grounding plus Microsoft Azure for Meta AI and Ray-Ban Meta glasses.",
        ],
        [
          "Elon Musk (xAI & Tesla)",
          "$12B+ per cluster round (Colossus 1 & 2)",
          "Backed by NVIDIA, AMD, Valor, a16z, and sovereign funds (MGX, QIA, PIF)",
          "Memphis Colossus supercluster runs 200k to 500k+ NVIDIA GPUs via Dell/Supermicro racks; distributes Grok on Microsoft Azure Foundry.",
        ],
        [
          "Tim Cook (Apple)",
          "Capex-light (On-device silicon + Private Cloud)",
          "Zero mega-capex burn; monetizes 2.2B+ iOS/macOS distribution",
          "Routes Apple Intelligence queries to Google Gemini, OpenAI ChatGPT, and Anthropic Claude; depends on TSMC 3nm/2nm fabs for Apple Silicon.",
        ],
        [
          "Andy Jassy & Jeff Bezos (Amazon / AWS)",
          "$100B to $150B+",
          "Up to $33B in Anthropic ($8B initial notes + $25B expansion)",
          "Primary cloud/training partner for Anthropic ($110B commitment through 2036 on AWS Trainium2/Inferentia2 Project Rainier); takes ~16% Bedrock cut.",
        ],
      ],
      "table_7_titans"
    )
  );

  // 5. Show Me the Code
  blocks.push(
    createTextBlock(
      "Show Me the Code: Tracing a 'Multi-Model' Request Through the Frenemy Cloud Tollbooth",
      "h2",
      "h2_code_walkthrough"
    )
  );

  blocks.push(
    createRichBlock(
      [
        {
          text: "As Solutions Engineers and full-stack developers, we often design multi-provider model routers assuming we are diversifying our vendor risk across Anthropic, Meta, Google, and Apple. In reality, when you trace a production request in TypeScript, your API call hits the exact same three cloud balance sheets and two hardware bottlenecks. Here is what a real-world enterprise router telemetry audit looks like when you account for the underlying cloud host, custom silicon, and marketplace cut disclosed in Anthropic's S-1:",
        },
      ],
      { style: "normal", keySeed: "code_intro" }
    )
  );

  blocks.push(
    createCodeBlock(
      `// src/lib/frenemy-stack-audit.ts
export interface ModelRouteAudit {
  logicalProvider: "anthropic-claude" | "meta-llama" | "apple-intelligence" | "xai-grok";
  physicalCloudHost: "google-cloud-vertex" | "aws-bedrock" | "azure-foundry" | "xai-colossus";
  acceleratorSilicon: "gcp-tpu-v5p-trillium" | "aws-trainium2" | "nvidia-blackwell-b200";
  foundryMonopoly: "TSMC-3nm-CoWoS";
  grossSpendUsd: number;
  hyperscalerMarketplaceCutUsd: number;
  recycledCapexObligationBln: number;
}

const S1_MARKETPLACE_FEE_RATE = 0.16; // ~16% AWS Bedrock & GCP Vertex AI fee disclosed in S-1

export function auditFrenemyCloudFlow(
  route: ModelRouteAudit["logicalProvider"],
  backend: ModelRouteAudit["physicalCloudHost"],
  monthlySpendUsd: number
): ModelRouteAudit {
  switch (route) {
    case "anthropic-claude": {
      const isGcp = backend === "google-cloud-vertex";
      return {
        logicalProvider: "anthropic-claude",
        physicalCloudHost: backend,
        acceleratorSilicon: isGcp ? "gcp-tpu-v5p-trillium" : "aws-trainium2",
        foundryMonopoly: "TSMC-3nm-CoWoS",
        grossSpendUsd: monthlySpendUsd,
        // 47% of Anthropic's 2025 revenue ran through AWS/GCP marketplaces at ~16% fee
        hyperscalerMarketplaceCutUsd: Number((monthlySpendUsd * S1_MARKETPLACE_FEE_RATE).toFixed(2)),
        // Google Cloud ($114.5B) + AWS ($110B) + Azure ($44.9B) S-1 commitments
        recycledCapexObligationBln: isGcp ? 114.5 : backend === "aws-bedrock" ? 110.0 : 44.9,
      };
    }
    case "meta-llama":
      return {
        logicalProvider: "meta-llama",
        physicalCloudHost: backend, // Often served via Google Cloud, AWS Bedrock, or Azure
        acceleratorSilicon: "nvidia-blackwell-b200",
        foundryMonopoly: "TSMC-3nm-CoWoS",
        grossSpendUsd: monthlySpendUsd,
        hyperscalerMarketplaceCutUsd: Number((monthlySpendUsd * S1_MARKETPLACE_FEE_RATE).toFixed(2)),
        recycledCapexObligationBln: 140.0, // Meta's 2026 annual AI capex run-rate
      };
    default:
      return {
        logicalProvider: route,
        physicalCloudHost: backend,
        acceleratorSilicon: "nvidia-blackwell-b200",
        foundryMonopoly: "TSMC-3nm-CoWoS",
        grossSpendUsd: monthlySpendUsd,
        hyperscalerMarketplaceCutUsd: 0,
        recycledCapexObligationBln: 100.0,
      };
  }
}`,
      "typescript",
      "code_frenemy_audit"
    )
  );

  blocks.push(
    createRichBlock(
      [
        { text: "AJ Pro-Tip from Alex: ", strong: true },
        {
          text: "If your engineering org routes production traffic to Claude through AWS Bedrock and fails over to Claude on Google Cloud Vertex AI, you have cloud region redundancy, which is great for uptime. Just do not confuse multi-cloud routing with financial independence: both endpoints pay a ~16% marketplace toll to Anthropic's two biggest convertible-note holders, and every single TPU and Trainium2 chip underneath those endpoints is fabricated on TSMC 3nm CoWoS lines.",
        },
      ],
      { style: "blockquote", keySeed: "pro_tip_router" }
    )
  );

  // 6. Section: ETF & Mutual Fund Concentration
  blocks.push(
    createTextBlock(
      "The Passive Index Funnel: How VOO, SPY, QQQ, VTI, FXAIX, and VT Put Every 401(k) in One AI Trade",
      "h2",
      "h2_etf_concentration"
    )
  );

  blocks.push(
    createRichBlock(
      [
        {
          text: "You might think: \"I don't buy private AI venture rounds or IPOs like ",
        },
        { text: "ANT", code: true },
        {
          text: ", I just dollar-cost average into low-cost index funds in my 401(k) and IRA.\" Because modern index funds are market-cap weighted, passive investing has turned into a giant momentum funnel. Every two weeks, automatic paycheck contributions from tens of millions of workers allocate 33% to nearly 50% of every retirement dollar into the exact eight companies passing AI capex back and forth.",
        },
      ],
      { style: "normal", keySeed: "etf_p1" }
    )
  );

  // Diagram 4: ETF & 401k Contagion Dominoes
  blocks.push(
    createImageBlock(
      assetRefs.diagram4,
      "Architecture Diagram of the Passive Index Funnel showing how S&P 500 (VOO, SPY, FXAIX), Nasdaq-100 (QQQ), Total US Market (VTI, VTSAX), and Semiconductor ETFs (SMH) pour retirement savings into 7 interconnected AI balance sheets and the 4-domino global contagion cascade if capex stalls",
      "Visual Diagram: The Passive Index Funnel. How passive 401(k) ETFs concentrate retirement savings into one circular AI capex trade, and the four-stage domino cascade if ROI stalls.",
      "diag_4_etf_funnel"
    )
  );

  // Table 3: ETF & Mutual Fund Holdings Breakdown
  blocks.push(
    createTableBlock(
      [
        [
          "Company (Ticker)",
          "S&P 500 (SPY, VOO, IVV, FXAIX, VFIAX)",
          "Nasdaq-100 (QQQ, QQQM)",
          "Total US Market (VTI, VTSAX)",
          "US Tech Sector (XLK / VGT)",
          "Semiconductors (SMH / SOXX)",
          "Total World & Intl (VT / VXUS)",
        ],
        [
          "NVIDIA (NVDA)",
          "8.1% to 8.4%",
          "9.0% to 9.5%",
          "~7.1%",
          "20.5% (XLK) / 16.8% (VGT)",
          "20.5% (SMH) / 6.8% (SOXX)",
          "4.3% (VT)",
        ],
        [
          "Apple (AAPL)",
          "7.0% to 7.4%",
          "8.5% to 8.9%",
          "~6.6%",
          "14.6% (VGT)",
          "0.0%",
          "3.8% (VT)",
        ],
        [
          "Microsoft (MSFT)",
          "5.7% to 5.8%",
          "7.8% to 8.2%",
          "~5.2%",
          "19.5% (XLK) / 9.5% (VGT)",
          "0.0%",
          "3.2% (VT)",
        ],
        [
          "Alphabet (GOOGL / GOOG)",
          "5.4% to 5.5%",
          "5.2% to 5.6%",
          "~4.9%",
          "Excluded (Comm. Services)",
          "0.0%",
          "3.0% (VT)",
        ],
        [
          "Amazon (AMZN)",
          "3.7% to 3.8%",
          "5.1% to 5.4%",
          "~3.3%",
          "Excluded (Cons. Discret.)",
          "0.0%",
          "2.1% (VT)",
        ],
        [
          "Broadcom (AVGO)",
          "2.6% to 2.7%",
          "4.5% to 5.0%",
          "~2.3%",
          "4.8% (XLK) / 4.1% (VGT)",
          "8.5% (SMH) / 6.1% (SOXX)",
          "1.3% (VT)",
        ],
        [
          "Meta Platforms (META)",
          "1.9% to 2.5%",
          "3.5% to 4.5%",
          "1.7% to 2.1%",
          "Excluded (Comm. Services)",
          "0.0%",
          "1.2% (VT)",
        ],
        [
          "Tesla (TSLA)",
          "1.5% to 2.0%",
          "2.5% to 3.2%",
          "1.4% to 1.7%",
          "Excluded (Cons. Discret.)",
          "0.0%",
          "0.9% (VT)",
        ],
        [
          "TSMC (TSM) + ASML + SK Hynix",
          "Excluded (Non-US)",
          "~0.8% (ASML only)",
          "Excluded (Non-US)",
          "Excluded",
          "16.3% (SMH: TSM + ASML)",
          "2.4% (VT) / 7.0%+ (VXUS)",
        ],
        [
          "Combined AI Capex Cohort Weight",
          "36.0% to 38.0% of S&P 500",
          "46.0% to 49.0% of Nasdaq-100",
          "32.5% to 34.0% of Total US",
          "45% to 55% in 3 to 4 stocks",
          "45%+ in NVDA, TSM, AVGO, ASML",
          "22.2% of Planet (VT) / 8.5% Intl",
        ],
      ],
      "table_etf_weights"
    )
  );

  blocks.push(
    createRichBlock(
      [
        {
          text: "Look closely at the rightmost column of that table. Even investors who buy ",
        },
        { text: "VXUS", code: true },
        {
          text: " (Vanguard Total International Stock ETF) thinking they are diversifying outside US Big Tech find that their #1 international holding is ",
        },
        { text: "TSMC (~4.1%)", strong: true },
        {
          text: ", followed closely by ",
        },
        { text: "ASML (~1.5%)", strong: true },
        {
          text: ", ",
        },
        { text: "SK Hynix (~1.4%)", strong: true },
        {
          text: ", and Samsung. And once Anthropic completes its Nasdaq listing under ",
        },
        { text: "ANT", code: true },
        {
          text: " at a projected $1T to $2T valuation, it will be added directly into ",
        },
        { text: "QQQ", code: true },
        { text: ", " },
        { text: "VTI", code: true },
        { text: ", and eventually " },
        { text: "VOO", code: true },
        { text: " and " },
        { text: "SPY", code: true },
        {
          text: ". That means passive 401(k) holders will simultaneously own Anthropic (and its $518B cloud debt) AND the hyperscaler landlords collecting that debt.",
        },
      ],
      { style: "normal", keySeed: "etf_p2" }
    )
  );

  // 7. Section: US & Global Macroeconomic Contagion If It Fails
  blocks.push(
    createTextBlock(
      "What Happens to the US and Global Economy If the Circular AI Capex Loop Fails?",
      "h2",
      "h2_macro_contagion"
    )
  );

  blocks.push(
    createRichBlock(
      [
        {
          text: "What happens if enterprise AI revenue grows slower than required to justify $700 billion to $800 billion per year in hyperscaler capital expenditures, or if algorithmic breakthroughs allow smaller models to run at 10% of today's compute cost? Because the circular loop connects corporate earnings, GDP accounting, utility grids, and global semiconductor exports, an unwind hits five macroeconomic fault lines at once:",
        },
      ],
      { style: "normal", keySeed: "macro_intro" }
    )
  );

  // Table 4: Macro Contagion Matrix
  blocks.push(
    createTableBlock(
      [
        [
          "Contagion Vector",
          "Current 2026 Exposure Scale",
          "Accounting / Structural Mechanism",
          "Impact If Hyperscaler Capex Cuts 30% to 40%",
        ],
        [
          "1. Real US GDP Growth",
          "$700B to $800B/yr CapEx (~2.6% of US GDP)",
          "BEA counts AI servers, GPUs, and data center construction as Non-Residential Fixed Investment (30% to 50%+ of recent GDP growth).",
          "Immediate 0.75% to 1.2% subtraction from headline US GDP, triggering a technical recession before layoffs even peak.",
        ],
        [
          "2. S&P 500 Earnings & Depreciation Trap",
          "~50% of S&P 500 EPS growth tied to AI cycle",
          "NVIDIA/Broadcom book GPU sales as immediate revenue; MSFT/GOOGL/AMZN capitalize GPUs as PP&E and depreciate over 4 to 6 years.",
          "Double whammy: chipmaker revenue drops immediately while hyperscalers are crushed by $150B+/yr in locked-in depreciation charges.",
        ],
        [
          "3. US 401(k)s & Consumer Wealth Effect",
          "42% to 48% of US household financial assets in equities",
          "Top 8 AI stocks represent ~$20T in market cap; every $1 lost in equity wealth reduces consumer spending by $0.03 to $0.05.",
          "A 40% AI valuation reset wipes out $8T to $10T in household net worth and cuts US consumer spending by $300B to $500B.",
        ],
        [
          "4. Power Grids & Municipal Bonds",
          "Multi-gigawatt gas/nuclear buildouts (VA, TX, OH, TN)",
          "Data centers take 24 months to build; utility turbines and transmission lines take 5 to 10 years and amortize over 30 to 40 years.",
          "Stranded utility debt is socialized onto residential electricity bills via rate-base hikes; municipal bond downgrades in data center towns.",
        ],
        [
          "5. Global Semiconductor & Sovereign Contagion",
          "Taiwan (TSMC), Korea (SK Hynix), Europe (ASML), Gulf SWFs",
          "US designs the models, while Asia and Europe own the high-fixed-cost physical fabs; Sovereign funds (MGX, PIF, QIA, GIC) hold private equity.",
          "Immediate export recession in Taiwan and South Korea (HBM memory glut), EUV order cancellations in Europe, and sovereign write-downs.",
        ],
      ],
      "table_macro_contagion"
    )
  );

  blocks.push(
    createRichBlock(
      [
        {
          text: "The most dangerous accounting detail in that table is the ",
        },
        { text: "Capex-to-Depreciation asymmetry", strong: true },
        {
          text: ". When Microsoft, Google, or Amazon spends $100 billion on NVIDIA Blackwell racks and Broadcom TPUs today, NVIDIA and Broadcom book $100 billion of immediate top-line revenue and $60B+ of net profit in the current quarter. Meanwhile, Microsoft, Google, and Amazon do not expense that $100 billion on their income statements today: they capitalize the servers as Property, Plant, and Equipment (PP&E) and depreciate them over four to six years. That makes S&P 500 earnings look artificially high during the buildout phase, and guarantees a multi-year depreciation hangover the moment capex growth slows down.",
        },
      ],
      { style: "normal", keySeed: "macro_depreciation" }
    )
  );

  // 8. FAQ Section for AEO/SEO
  blocks.push(
    createTextBlock(
      "Frequently Asked Questions (FAQ)",
      "h2",
      "h2_faq"
    )
  );

  blocks.push(
    createTextBlock(
      "What did Anthropic disclose in its 2026 Form S-1 SEC filing?",
      "h3",
      "h3_faq_1"
    )
  );
  blocks.push(
    createRichBlock(
      [
        {
          text: "In its October 26, 2026 Form S-1 registration statement (CIK 0002130357, ticker ANT), Anthropic disclosed $16.286 billion in H1 2026 revenue (up from $4.6 billion in full-year 2025), an $80.748 billion H1 2026 GAAP net loss driven by $72.388 billion in non-cash convertible note mark-to-market revaluations, and between $450 billion and $518 billion in multi-year non-cancellable cloud compute commitments across Google Cloud ($111.1B to $114.5B), AWS ($110B), and Microsoft Azure ($31.4B to $44.9B).",
        },
      ],
      { style: "normal", keySeed: "p_faq_1" }
    )
  );

  blocks.push(
    createTextBlock(
      "How does circular AI financing (round-tripping) work between Google, AWS, Microsoft, NVIDIA, and AI labs?",
      "h3",
      "h3_faq_2"
    )
  );
  blocks.push(
    createRichBlock(
      [
        {
          text: "In circular AI financing, hyperscalers and chipmakers (Google, Amazon, Microsoft, NVIDIA) invest tens of billions of dollars in equity or convertible notes into AI model labs and neoclouds (Anthropic, OpenAI, xAI, CoreWeave). In exchange, those AI labs sign multi-decade take-or-pay contracts obligating them to spend that capital, plus roughly 16% marketplace distribution fees, renting cloud TPUs, Trainium2 chips, and NVIDIA GPUs right back from the investors.",
        },
      ],
      { style: "normal", keySeed: "p_faq_2" }
    )
  );

  blocks.push(
    createTextBlock(
      "How much of the S&P 500 and Nasdaq-100 ETFs is concentrated in the circular AI economy?",
      "h3",
      "h3_faq_3"
    )
  );
  blocks.push(
    createRichBlock(
      [
        {
          text: "As of late 2026, the eight primary US AI capex stocks (NVIDIA, Apple, Microsoft, Alphabet, Amazon, Broadcom, Meta, and Tesla) account for roughly 36% to 38% of S&P 500 ETFs and mutual funds (VOO, SPY, IVV, FXAIX, VFIAX), 46% to 49% of the Nasdaq-100 (QQQ), and 32.5% to 34% of the Total US Stock Market (VTI, VTSAX), while TSMC, ASML, and SK Hynix represent over 7% of international index funds (VXUS).",
        },
      ],
      { style: "normal", keySeed: "p_faq_3" }
    )
  );

  // 9. Conclusion in Alex Patterson's Voice
  blocks.push(
    createTextBlock(
      "Conclusion: Build on the Models, Watch the Balance Sheets",
      "h2",
      "h2_conclusion"
    )
  );

  blocks.push(
    createRichBlock(
      [
        {
          text: "Make no mistake: the engineering breakthroughs inside Claude, Gemini, Llama, and Grok are real, and we use them every single day in production at CodingCat.dev. But as Anthropic's Form S-1 makes crystal clear, the financial plumbing underneath those models is a high-wire act of $518 billion take-or-pay cloud mortgages and circular hyperscaler capex. Come tell us on ",
        },
        {
          text: "X (@CodingCatDev)",
          href: "https://x.com/CodingCatDev",
          strong: true,
        },
        { text: " and " },
        {
          text: "LinkedIn",
          href: "https://www.linkedin.com/company/codingcatdev",
          strong: true,
        },
        {
          text: " what you think of Anthropic's S-1 numbers, watch our architectural deep dives on the ",
        },
        {
          text: "CodingCat.dev YouTube Channel",
          href: "https://www.youtube.com/@CodingCatDev?sub_confirmation=1",
          strong: true,
        },
        { text: ", and explore more hands-on " },
        { text: "Courses", href: "/courses", strong: true },
        { text: ", " },
        { text: "Podcasts", href: "/podcasts", strong: true },
        { text: ", and " },
        { text: "Blog Posts", href: "/blog", strong: true },
        { text: " right here on CodingCat.dev." },
      ],
      { style: "normal", keySeed: "p_conclusion" }
    )
  );

  const postDoc = {
    _id: DOC_ID,
    _type: "post",
    title: cleanDashes(
      "Anthropic's S-1, $518B in cloud commitments, and circular AI capex"
    ),
    slug: {
      _type: "slug",
      current: SLUG,
    },
    date: "2026-10-26T16:30:00.000Z",
    excerpt: cleanDashes(
      "Anthropic just filed its Form S-1 for a Nasdaq IPO under ticker ANT, revealing $518B in take-or-pay cloud commitments to Google, AWS, and Microsoft. Here is how Mark Zuckerberg, Elon Musk, Jensen Huang, Sundar Pichai, Satya Nadella, Tim Cook, and Dario Amodei built a circular revenue machine, and what happens to your S&P 500 ETF if it stalls."
    ),
    featured: 1,
    coverImage: {
      _type: "image",
      asset: {
        _type: "reference",
        _ref: assetRefs.hero,
      },
      alt: "The Heads of AI wearing black company logo t-shirts and shaking hands in a circular web of cloud and GPU investments",
    },
    author: [
      {
        _type: "reference",
        _key: "author_alex",
        _ref: ALEX_AUTHOR_REF,
      },
    ],
    tags: [
      { _key: "tag_ai", label: "AI", value: "ai" },
      { _key: "tag_anthropic", label: "Anthropic", value: "anthropic" },
      { _key: "tag_gcp", label: "Google Cloud", value: "google-cloud" },
      { _key: "tag_aws", label: "AWS", value: "aws" },
      { _key: "tag_arch", label: "Architecture", value: "architecture" },
    ],
    content: blocks,
  };

  return postDoc;
}

async function main() {
  console.log(`Publishing Anthropic S-1 & Circular AI Economy Post to Sanity (${dataset})...`);

  const assetRefs = {
    hero: await uploadJpegToSanity("ai-titans-circular-handshake-hero.jpg", dataset),
    diagram1: await uploadJpegToSanity("diagram-1-ai-circular-investment-loop.jpg", dataset),
    diagram2: await uploadJpegToSanity("diagram-2-cross-stack-tech-dependencies.jpg", dataset),
    diagram3: await uploadJpegToSanity("diagram-3-dario-amodei-vision-vs-s1-reality.jpg", dataset),
    diagram4: await uploadJpegToSanity("diagram-4-etf-401k-contagion-dominoes.jpg", dataset),
    diagram5: await uploadJpegToSanity("diagram-5-meta-gemini-anthropic-google-cloud.jpg", dataset),
  };

  const postDoc = await buildCircularAiPost(assetRefs);

  if (isDryRun) {
    console.log(
      `[DRY RUN] Built ${postDoc._id} (/post/${postDoc.slug.current}) with ${postDoc.content.length} Portable Text blocks.`
    );
    return;
  }

  const mutRes = await fetch(
    `https://${projectId}.api.sanity.io/v2024-01-01/data/mutate/${dataset}`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        mutations: [{ createOrReplace: postDoc }],
      }),
    }
  );

  if (!mutRes.ok) {
    throw new Error(`Sanity mutate failed: ${mutRes.status} ${await mutRes.text()}`);
  }
  console.log(`Successfully published ${postDoc._id} to Sanity (${dataset}): https://codingcat.dev/post/${postDoc.slug.current}`);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
