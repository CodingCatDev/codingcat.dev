import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const projectId = process.env.SANITY_STUDIO_PROJECT_ID || "hfh83o0w";
const dataset = process.env.SANITY_STUDIO_DATASET || "production";
const token =
  process.env.SANITY_API_WRITE_TOKEN || process.env.SANITY_AUTH_TOKEN;

if (!token) {
  throw new Error(
    "Neither SANITY_API_WRITE_TOKEN nor SANITY_AUTH_TOKEN is defined in the environment."
  );
}

const apiVersion = "2025-02-19";

async function uploadImage(filePath, filename) {
  const buffer = fs.readFileSync(filePath);
  const url = `https://${projectId}.api.sanity.io/v${apiVersion}/assets/images/${dataset}?filename=${encodeURIComponent(filename)}`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "image/jpeg",
    },
    body: buffer,
  });
  if (!res.ok) {
    throw new Error(`Upload failed (${res.status}): ${await res.text()}`);
  }
  const data = await res.json();
  return data.document._id;
}

const key = () => crypto.randomBytes(6).toString("hex");

function block(style, parts) {
  const markDefs = [];
  const children = parts.map((p) => {
    if (typeof p === "string") {
      return { _type: "span", _key: key(), text: p, marks: [] };
    }
    if (p.href) {
      const markKey = key();
      markDefs.push({ _type: "link", _key: markKey, href: p.href });
      return {
        _type: "span",
        _key: key(),
        text: p.text,
        marks: p.marks ? [...p.marks, markKey] : [markKey],
      };
    }
    return {
      _type: "span",
      _key: key(),
      text: p.text,
      marks: p.marks || [],
    };
  });
  return {
    _type: "block",
    _key: key(),
    style,
    markDefs,
    children,
  };
}

function bullet(parts, level = 1) {
  const b = block("normal", parts);
  b.listItem = "bullet";
  b.level = level;
  return b;
}

function codeBlock(language, code) {
  return {
    _type: "code",
    _key: key(),
    language,
    code,
  };
}

export async function publishPhp2ShellPost() {
  console.log(`Uploading PHP2Shell cover and meme images to Sanity (${dataset})...`);
  const coverAssetId = await uploadImage(
    path.join(__dirname, "assets/php2shell-cover.jpg"),
    "php2shell-excalidraw-cover.jpg"
  );
  const memeAssetId = await uploadImage(
    path.join(__dirname, "assets/php2shell-meme.jpg"),
    "php2shell-meme.jpg"
  );
  console.log("Uploaded assets:", { coverAssetId, memeAssetId });

  const content = [
    block("normal", [
      "Every single year since 2010, someone on Hacker News or X posts a hot take declaring that PHP is dead. And then, in October 2026, frontier AI models uncovered a decade-old memory corruption flaw in the core PHP runtime engine, and suddenly ",
      { text: "70% of the internet", marks: ["strong"] },
      " had to scramble into emergency patching mode.",
    ]),
    {
      _type: "image",
      _key: key(),
      alt: "Developer meme showing a hipster web developer saying 'Nobody uses PHP anymore, PHP is dead' contrasted with October 2026 when AI finds one bug in PHP (CVE-2026-109618 PHP2Shell) and 70% of the internet goes into emergency lockdown while the purple PHP elephant holds up the world.",
      asset: {
        _type: "reference",
        _ref: memeAssetId,
      },
    },
    block("normal", [
      "As ",
      {
        text: "reported by BBC News",
        href: "https://www.bbc.com/news/articles/c3qjnwye0ep5o",
      },
      ", government portals, Wikimedia systems supporting Wikipedia, public health boards in Scotland, Edinburgh Council, the Finnish government, and even the Netherlands National Cyber Security Centre (NCSC) temporarily pulled services offline this week as a precaution against two critical vulnerabilities collectively dubbed ",
      { text: "PHP2Shell", marks: ["strong"] },
      " (",
      { text: "CVE-2026-109618", marks: ["code"] },
      " and ",
      { text: "CVE-2026-109619", marks: ["code"] },
      ").",
    ]),
    block("normal", [
      "Both vulnerabilities carry a critical ",
      { text: "CVSS v4.0 score of 9.2", marks: ["strong"] },
      " and affect every release of PHP from ",
      { text: "PHP 5.4 through PHP 8.5", marks: ["strong"] },
      ". Here is a technical breakdown of what happened, how AI models from OpenAI and Google Gemini accelerated the discovery, what actually breaks inside the Zend Engine, and how to verify and patch your servers right now.",
    ]),

    block("h2", ["What Is PHP2Shell (CVE-2026-109618 and CVE-2026-109619)?"]),
    block("normal", [
      "Unlike application-level vulnerabilities in a specific WordPress plugin or Composer package, ",
      {
        text: "PHP2Shell",
        href: "https://en.wikipedia.org/wiki/PHP2Shell",
      },
      " sits directly inside the C-based PHP interpreter itself, specifically in the paths responsible for ",
      { text: "request memory management and error handling", marks: ["strong"] },
      ".",
    ]),
    block("normal", [
      "According to ",
      {
        text: "The PHP Foundation's official security retrospective",
        href: "https://thephp.foundation/blog/2026/10/21/todays-php-security-release-and-how-were-strengthening-php-security/",
      },
      ", the underlying Out-of-Memory (OOM) flaw behind ",
      { text: "CVE-2026-109618", marks: ["code"] },
      " was first glimpsed in 2024 after an external security audit by Quarkslab funded by the Sovereign Tech Agency through OSTIF. While fixing one of the audit findings, a contracted core developer noticed that hitting PHP's memory limit at a very specific moment could leave internal engine structures in an inconsistent state.",
    ]),
    block("blockquote", [
      "\"Both issues sit in parts of PHP that nearly every request touches: memory management and error handling. Their central place in PHP is what made both vulnerabilities serious, and also so hard to fix without breaking compatibility, hurting performance, or forcing changes on the large ecosystem of third-party extensions.\" (The PHP Foundation)",
    ]),
    block("normal", [
      "Because no one had demonstrated a concrete Remote Code Execution (RCE) exploit path in 2024, and because every candidate fix risked breaking backward compatibility or C extensions, work on a patch stalled under the PHP security team's consensus model for nearly two years.",
    ]),

    block("h2", ["How Frontier AI Turned a Theoretical Bug into a Global Alert"]),
    block("normal", [
      "What changed in late 2026 was not the underlying C code in PHP. What changed was the arrival of frontier AI models capable of reasoning across deep engine call graphs and synthesizing multi-step memory corruption chains:",
    ]),
    bullet([
      { text: "Calif and OpenAI: ", marks: ["strong"] },
      "In August 2026, security researcher Ryan Austin at Calif used OpenAI's ",
      { text: "GPT-5.6 Sol", marks: ["code"] },
      " under OpenAI's ",
      {
        text: "Patch the Planet coordinated disclosure initiative",
        href: "https://openai.com/index/coordinated-disclosure-of-critical-vulnerabilities/",
      },
      " to turn the theoretical OOM condition into a working pre-authentication RCE exploit chain across popular PHP platforms.",
    ]),
    bullet([
      { text: "Wiz and Google Gemini: ", marks: ["strong"] },
      "Cloud security firm Wiz independently discovered and reported both ",
      { text: "CVE-2026-109618", marks: ["code"] },
      " and ",
      { text: "CVE-2026-109619", marks: ["code"] },
      " using AI-driven vulnerability research agents powered by Google Gemini and GPT models, calling the flaws the most severe vulnerabilities ever uncovered by AI.",
    ]),
    block("normal", [
      "As UNSW Sydney cybersecurity researcher Salil Kanhere told the ",
      {
        text: "BBC",
        href: "https://www.bbc.com/news/articles/c3qjnwye0ep5o",
      },
      ", the underlying bugs were not new; what changed was our ability to find and weaponize them at machine speed.",
    ]),

    block("h2", ["The Embargo Breakdown and Cloudflare's Traffic Spike"]),
    block("normal", [
      "Following coordinated work between Calif, Wiz, OpenAI, and the PHP Foundation's Ecosystem Security Team in August and September 2026, an embargoed release was scheduled for October 21 at 14:00 UTC.",
    ]),
    block("normal", [
      "However, the timeline fractured:",
    ]),
    bullet([
      { text: "October 20, 2026: ", marks: ["strong"] },
      "CVE identifiers and a deleted proof-of-concept video leaked on social media, prompting threat actors to begin probing servers.",
    ]),
    bullet([
      { text: "October 21, 2026 at 07:41 UTC: ", marks: ["strong"] },
      "More than six hours before the coordinated disclosure, container vendor Chainguard broke the embargo and published pre-built container images containing the patch. As ",
      {
        text: "The PHP Foundation noted",
        href: "https://thephp.foundation/blog/2026/10/21/todays-php-security-release-and-how-were-strengthening-php-security/",
      },
      ", any attacker could immediately binary-diff the patched image against the previous build while the rest of the world was still waiting for the official release.",
    ]),
    bullet([
      { text: "October 21, 2026 at 07:43 UTC: ", marks: ["strong"] },
      "Two minutes after the premature image push, ",
      {
        text: "Cloudflare recorded the first wave of automated exploitation attempts",
        href: "https://blog.cloudflare.com/php-vulnerabilities-waf-protection",
      },
      ". Cloudflare CEO Matthew Prince reported that exploit probes jumped from thousands prior to disclosure to tens of thousands within 45 minutes, hundreds of thousands within two hours, and millions across Cloudflare's global edge.",
    ]),

    block("h2", ["Under the Hood: Why Updating WordPress or Composer Is Not Enough"]),
    block("normal", [
      "When a request hits a PHP server, the Zend Engine initializes per-request memory structures, parses incoming request variables, and sets up session and error-handling state. If an attacker crafts a request that triggers an Out-of-Memory (",
      { text: "OOM", marks: ["code"] },
      ") condition during a narrow initialization window, PHP invokes ",
      { text: "zend_bailout()", marks: ["code"] },
      " to abort the request and clean up memory.",
    ]),
    block("normal", [
      "In unpatched versions of PHP (5.4 through 8.5), if ",
      { text: "zend_bailout()", marks: ["code"] },
      " fired before specific internal pointers finished initializing, the shutdown destructor routine still treated those partially initialized structures as valid pointers. By combining ",
      { text: "CVE-2026-109618", marks: ["code"] },
      " and ",
      { text: "CVE-2026-109619", marks: ["code"] },
      ", an unauthenticated remote attacker can corrupt engine memory before application authentication checks ever run.",
    ]),
    block("normal", [
      "According to ",
      {
        text: "Sansec Forensics' technical advisory",
        href: "https://sansec.io/research/php2shell",
      },
      ", Calif demonstrated unauthenticated code execution against clean installations of:",
    ]),
    bullet([{ text: "WordPress 7.1.2 and WooCommerce", marks: ["strong"] }]),
    bullet([{ text: "Laravel 13.11 and Symfony 8.1", marks: ["strong"] }]),
    bullet([{ text: "Magento 2.4.9 and Shopware", marks: ["strong"] }]),
    bullet([{ text: "Drupal 11.4.3 and Joomla 6.1.4", marks: ["strong"] }]),
    bullet([{ text: "MediaWiki 1.46.2, Nextcloud 35.0.1, Roundcube 1.7.4, and phpMyAdmin 5.2.3", marks: ["strong"] }]),
    block("normal", [
      "Because the vulnerability lives in the PHP binary (",
      { text: "php-fpm", marks: ["code"] },
      ", ",
      { text: "mod_php", marks: ["code"] },
      ", or ",
      { text: "php-cgi", marks: ["code"] },
      "), ",
      { text: "updating WordPress plugins, Composer dependencies, or application code will not fix PHP2Shell", marks: ["strong"] },
      ". You must patch the underlying PHP runtime on the host or container.",
    ]),

    block("h2", ["Reality Check: Is PHP2Shell Another Log4Shell?"]),
    block("normal", [
      "While government advisories from the US NSA, UK NCSC, and Japanese Prime Minister Sanae Takaichi urged organizations to patch immediately or temporarily suspend unpatched sites, forensic researchers at ",
      {
        text: "Sansec",
        href: "https://sansec.io/research/php2shell",
      },
      ", ",
      {
        text: "Tenable",
        href: "https://www.tenable.com/blog/php2shell-cve-2026-109618-cve-2026-109619-frequently-asked-questions-about-critical-php-remote",
      },
      ", and ",
      {
        text: "Bitdefender",
        href: "https://www.bitdefender.com/en-us/blog/businessinsights/technical-advisory-php2shell-pre-auth-rce/",
      },
      " point out an important nuance:",
    ]),
    block("normal", [
      "Unlike Log4Shell or Shellshock, where a single static HTTP header could compromise almost any vulnerable server blindly, reliable PHP2Shell exploitation requires target-specific knowledge of the server's memory configuration and application state to hit the exact OOM window. Many noisy proof-of-concept scripts circulating on GitHub right now either fail against default PHP installations or rely on a separate Local File Inclusion (LFI) bug.",
    ]),
    block("normal", [
      "However, with AI-assisted offensive tooling rapidly evolving, as tracked by ",
      {
        text: "Recorded Future's Insikt Group",
        href: "https://www.recordedfuture.com/blog/php2shell-vulnerability-exploitation",
      },
      " and ",
      {
        text: "Sophos X-Ops",
        href: "https://www.sophos.com/en-us/security-advisories/sophos-sa-20261021-php2shell",
      },
      ", leaving an internet-facing PHP runtime unpatched is an unacceptable risk.",
    ]),

    block("h2", ["How to Check and Patch Your PHP Servers Immediately"]),
    block("normal", [
      "The PHP project released official patched versions for all active branches on October 21, 2026:",
    ]),
    bullet([{ text: "PHP 8.5: ", marks: ["strong"] }, "Upgrade to ", { text: "8.5.12", marks: ["code"] }, " or later"]),
    bullet([{ text: "PHP 8.4: ", marks: ["strong"] }, "Upgrade to ", { text: "8.4.27", marks: ["code"] }, " or later"]),
    bullet([{ text: "PHP 8.3: ", marks: ["strong"] }, "Upgrade to ", { text: "8.3.36", marks: ["code"] }, " or later"]),
    bullet([{ text: "PHP 8.2: ", marks: ["strong"] }, "Upgrade to ", { text: "8.2.35", marks: ["code"] }, " or later"]),
    block("normal", [
      "If you are running an End-of-Life (EOL) version of PHP (such as PHP 7.4, 8.0, or 8.1), PHP.net does not publish official binary releases, and official Docker ",
      { text: "php:8.1", marks: ["code"] },
      " images will not receive an update. However, Debian, Ubuntu, CloudLinux, and Remi's RPM repository for RHEL, AlmaLinux, and Rocky Linux have backported the source patches into their distro packages while keeping the base version number.",
    ]),
    block("normal", [
      "Run the following commands on your server to verify whether your PHP package includes the backported fix for ",
      { text: "CVE-2026-109618", marks: ["code"] },
      " and ",
      { text: "CVE-2026-109619", marks: ["code"] },
      ":",
    ]),
    codeBlock(
      "bash",
      `# 1. Check your running PHP version
php -v

# 2. On Debian / Ubuntu, verify the CVE patch in the package changelog
zgrep CVE-2026-109618 /usr/share/doc/php*-common/changelog.Debian.gz

# 3. On RHEL / AlmaLinux / Rocky Linux, check the RPM changelog
rpm -q --changelog php-common | grep CVE-2026-109618

# 4. Apply updates and restart PHP-FPM / Apache
sudo apt update && sudo apt install --only-upgrade 'php*'
sudo systemctl restart php8.4-fpm apache2`
    ),
    block("normal", [
      "If you cannot patch immediately, place your site behind an edge WAF such as ",
      {
        text: "Cloudflare's emergency PHP2Shell WAF rules",
        href: "https://blog.cloudflare.com/php-vulnerabilities-waf-protection",
      },
      " and audit your server logs for abnormal ",
      { text: "Allowed memory size of ... bytes exhausted", marks: ["code"] },
      " spikes paired with unexpected POST payloads.",
    ]),

    block("h2", ["Sources, Advisories, and Further Reading"]),
    block("normal", [
      "To track ongoing updates, vendor backports, and Indicators of Compromise (IoCs), bookmark these primary advisories and technical reports:",
    ]),
    bullet([
      {
        text: "BBC News: What is PHP and why did it spark a global cyber-security scramble?",
        href: "https://www.bbc.com/news/articles/c3qjnwye0ep5o",
      },
    ]),
    bullet([
      {
        text: "The PHP Foundation: Today's PHP Security Release, and How We're Strengthening PHP Security",
        href: "https://thephp.foundation/blog/2026/10/21/todays-php-security-release-and-how-were-strengthening-php-security/",
      },
    ]),
    bullet([
      {
        text: "OpenAI: Coordinated Disclosure of Critical Vulnerabilities (Patch the Planet)",
        href: "https://openai.com/index/coordinated-disclosure-of-critical-vulnerabilities/",
      },
    ]),
    bullet([
      {
        text: "Cloudflare Blog: Protecting Against the PHP2Shell Vulnerabilities with Cloudflare WAF",
        href: "https://blog.cloudflare.com/php-vulnerabilities-waf-protection",
      },
    ]),
    bullet([
      {
        text: "Sansec Forensics: PHP2Shell PHP RCE (CVE-2026-109618, CVE-2026-109619) Technical Guide & Distro Patch Matrix",
        href: "https://sansec.io/research/php2shell",
      },
    ]),
    bullet([
      {
        text: "Tenable Security Response: PHP2Shell CVE-2026-109618 & CVE-2026-109619 Frequently Asked Questions",
        href: "https://www.tenable.com/blog/php2shell-cve-2026-109618-cve-2026-109619-frequently-asked-questions-about-critical-php-remote",
      },
    ]),
    bullet([
      {
        text: "Bitdefender Business Insights: Technical Advisory for PHP2Shell Pre-Auth RCE",
        href: "https://www.bitdefender.com/en-us/blog/businessinsights/technical-advisory-php2shell-pre-auth-rce/",
      },
    ]),
    bullet([
      {
        text: "Recorded Future Insikt Group: PHP2Shell Vulnerability Exploitation Analysis",
        href: "https://www.recordedfuture.com/blog/php2shell-vulnerability-exploitation",
      },
    ]),
    bullet([
      {
        text: "Sophos Security Advisory: SOPHOS-SA-20261021-PHP2SHELL",
        href: "https://www.sophos.com/en-us/security-advisories/sophos-sa-20261021-php2shell",
      },
    ]),
    bullet([
      {
        text: "Wikipedia: PHP2Shell Vulnerability Overview and Disclosure Timeline",
        href: "https://en.wikipedia.org/wiki/PHP2Shell",
      },
    ]),
  ];

  const postDoc = {
    _id: "post-php2shell-cve-2026-109618",
    _type: "post",
    title: "PHP2Shell (CVE-2026-109618): How AI Found a Decade-Old Bug in 70% of the Web",
    slug: {
      _type: "slug",
      current: "php2shell-cve-2026-109618-ai-php-security-scramble",
    },
    date: "2026-10-22T17:30:00.000Z",
    excerpt:
      "Two critical pre-authentication RCE flaws in PHP (CVE-2026-109618 and CVE-2026-109619), uncovered by AI models from OpenAI and Google Gemini, sparked a global patching scramble across 70% of the web. Here is how PHP2Shell works and how to patch your servers.",
    author: [
      {
        _key: key(),
        _type: "reference",
        _ref: "RIgC5r4TJ0hCGOzxHszD1w",
      },
    ],
    coverImage: {
      _type: "image",
      asset: {
        _type: "reference",
        _ref: coverAssetId,
      },
    },
    content,
  };

  const mutations = [
    { createIfNotExists: postDoc },
    {
      patch: {
        id: postDoc._id,
        set: {
          title: postDoc.title,
          slug: postDoc.slug,
          date: postDoc.date,
          excerpt: postDoc.excerpt,
          author: postDoc.author,
          coverImage: postDoc.coverImage,
          content: postDoc.content,
        },
      },
    },
    { patch: { id: "LzgcvqoNSwz5R8loykZyIB", set: { excerpt: "Learn how to customize your Slack workspace theme using SlackThemes.net and contribute custom color themes on GitHub." } } },
    { patch: { id: "ZKdo3vLUqcb4sYreiCMc5A", set: { excerpt: "Learn how to inspect and debug Angular 9 components directly inside the Chrome DevTools console using the new ng global object." } } },
    { patch: { id: "ZKdo3vLUqcb4sYreiCPNnI", set: { excerpt: "Join Alex Patterson and Brittney Postma with special guests Zach DeRose, Facundo Giuliani, Swyx, Jason Lengstorf, and Scott Tolinski for a year-end Holiday AMA." } } },
    { patch: { id: "ZKdo3vLUqcb4sYrehuNXvu", set: { excerpt: "Creator and developer contributing tutorials and videos on CodingCat.dev." } } },
  ];

  const mutateUrl = `https://${projectId}.api.sanity.io/v${apiVersion}/data/mutate/${dataset}`;
  const res = await fetch(mutateUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ mutations }),
  });
  if (!res.ok) {
    throw new Error(`Mutation failed (${res.status}): ${await res.text()}`);
  }
  const result = await res.json();
  console.log("Sanity mutation result:", JSON.stringify(result, null, 2));
}

if (import.meta.url === `file://${process.argv[1]}`) {
  publishPhp2ShellPost().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
