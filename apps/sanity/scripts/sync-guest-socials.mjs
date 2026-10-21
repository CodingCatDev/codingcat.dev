#!/usr/bin/env node
/**
 * Syncs enriched public guest social handles into the target Sanity dataset
 * and explicitly unsets any private fields (socials.email, portalToken).
 */

const projectId = process.env.SANITY_STUDIO_PROJECT_ID || "hfh83o0w";
const dataset = process.env.SANITY_STUDIO_DATASET || "dev";
const token =
  process.env.SANITY_API_WRITE_TOKEN ||
  process.env.SANITY_AUTH_TOKEN ||
  "";

if (!token) {
  console.log("[sync-guest-socials] No SANITY_AUTH_TOKEN or SANITY_API_WRITE_TOKEN provided, skipping.");
  process.exit(0);
}

const ENRICHED_GUESTS = [
  {
    "id": "RIgC5r4TJ0hCGOzxHt5W4m",
    "socials": {
      "github": "https://github.com/aaronfrost",
      "twitter": "https://twitter.com/aaronfrost"
    }
  },
  {
    "id": "RIgC5r4TJ0hCGOzxHt52Uf",
    "socials": {
      "github": "https://github.com/argyleink",
      "twitter": "https://twitter.com/argyleink",
      "youtube": "https://www.youtube.com/c/AdamArgyleInk",
      "mastodon": "https://front-end.social/@argyleink",
      "bluesky": "https://bsky.app/profile/nerdy.dev",
      "linkedin": "https://www.linkedin.com/in/adamargyle"
    }
  },
  {
    "id": "RIgC5r4TJ0hCGOzxHt5Qpc",
    "socials": {
      "github": "https://github.com/adamdbradley",
      "twitter": "https://twitter.com/adamdbradley",
      "instagram": "https://www.instagram.com/figma",
      "bluesky": "https://bsky.app/profile/adambradley.bsky.social",
      "threads": "https://www.threads.net/@figma"
    }
  },
  {
    "id": "RIgC5r4TJ0hCGOzxHt55CK",
    "socials": {
      "github": "https://github.com/acekyd",
      "linkedin": "https://www.linkedin.com/in/acekyd/",
      "stackoverflow": "https://stackoverflow.com/users/1945274/acekyd",
      "twitch": "https://www.twitch.tv/elpunish3rr/",
      "twitter": "https://twitter.com/Ace_KYD",
      "youtube": "https://www.youtube.com/acekyd",
      "instagram": "https://instagram.com/acekydtv",
      "tiktok": "https://tiktok.com/@acekydtv",
      "bluesky": "https://bsky.app/profile/acekyd.bsky.social",
      "threads": "https://www.threads.net/@acekydtv"
    }
  },
  {
    "id": "RIgC5r4TJ0hCGOzxHt52AL",
    "socials": {
      "linkedin": "https://www.linkedin.com/in/alexanderfeldman/",
      "bluesky": "https://bsky.app/profile/hafeldman17.bsky.social"
    }
  },
  {
    "id": "RIgC5r4TJ0hCGOzxHt50CP",
    "socials": {
      "github": "https://github.com/alx-andru",
      "twitter": "https://twitter.com/alexg0g",
      "linkedin": "https://www.linkedin.com/in/agogan/",
      "bluesky": "https://bsky.app/profile/alx-andru.bsky.social"
    }
  },
  {
    "id": "RIgC5r4TJ0hCGOzxHt4w1I",
    "socials": {
      "github": "https://github.com/alexjoverm",
      "linkedin": "https://www.linkedin.com/in/alex-jover-morales-994752102/",
      "twitter": "https://twitter.com/alexjoverm"
    }
  },
  {
    "id": "RIgC5r4TJ0hCGOzxHt51q1",
    "socials": {
      "github": "https://github.com/ruheni",
      "twitter": "https://twitter.com/ruheni_alex",
      "bluesky": "https://bsky.app/profile/ruheni.blue",
      "mastodon": "https://hachyderm.io/@ruheni"
    }
  },
  {
    "id": "RIgC5r4TJ0hCGOzxHt4r1N",
    "socials": {
      "github": "https://github.com/a-trost",
      "twitch": "https://www.twitch.tv/trostcodes",
      "twitter": "https://twitter.com/trostcodes",
      "bluesky": "https://bsky.app/profile/trost.codes",
      "linkedin": "https://www.linkedin.com/in/trostcodes/",
      "tiktok": "https://www.tiktok.com/@trostcodes"
    }
  },
  {
    "id": "RIgC5r4TJ0hCGOzxHt4hvQ",
    "socials": {
      "github": "https://github.com/emaxerrno",
      "twitter": "https://twitter.com/emaxerrno",
      "linkedin": "https://www.linkedin.com/in/alexandergallego/"
    }
  },
  {
    "id": "RIgC5r4TJ0hCGOzxHt4lh8",
    "socials": {
      "github": "https://github.com/manniL/",
      "linkedin": "https://www.linkedin.com/in/alexanderlichter/",
      "mastodon": "https://hachyderm.io/@manniL",
      "twitch": "https://www.twitch.tv/TheAlexLichter/",
      "twitter": "https://twitter.com/thealexlichter",
      "youtube": "https://www.youtube.com/@TheAlexLichter",
      "bluesky": "https://bsky.app/profile/thealexlichter.com"
    }
  },
  {
    "id": "RIgC5r4TJ0hCGOzxHt4lHj",
    "socials": {
      "github": "https://github.com/aspittel",
      "twitter": "https://twitter.com/ASpittel",
      "youtube": "https://www.youtube.com/alispitteldev",
      "bluesky": "https://bsky.app/profile/alispit.tel"
    }
  },
  {
    "id": "RIgC5r4TJ0hCGOzxHt4cR1",
    "socials": {
      "github": "https://github.com/alyssamichelle",
      "twitch": "https://www.twitch.tv/CodeItLive",
      "twitter": "https://twitter.com/alyssanicoll",
      "youtube": "https://www.youtube.com/channel/UC_VUp1NHZnnh8DAS2d-c46A",
      "linkedin": "https://www.linkedin.com/in/alyssa-nicoll",
      "bluesky": "https://bsky.app/profile/alyssanicoll.bsky.social",
      "mastodon": "https://www.youtube.com/@AngularAirPodcast"
    }
  },
  {
    "id": "b5d8b34a-0ff3-417a-9fe7-73659931d9c6",
    "socials": {
      "github": "https://github.com/amdcavallaro",
      "linkedin": "https://www.linkedin.com/in/amandacavallaro/",
      "twitter": "https://twitter.com/amdcavallaro"
    }
  },
  {
    "id": "RIgC5r4TJ0hCGOzxHt4bhI",
    "socials": {
      "github": "https://github.com/agiannelli",
      "twitter": "https://twitter.com/GiannelliTech"
    }
  },
  {
    "id": "RIgC5r4TJ0hCGOzxHt4eZ7",
    "socials": {
      "github": "https://github.com/ahaywood",
      "linkedin": "https://www.linkedin.com/in/amy-dutton/",
      "twitter": "https://twitter.com/selfteachme",
      "youtube": "http://youtube.com/c/selfteachme",
      "instagram": "http://instagram.com/selfteachme",
      "bluesky": "https://bsky.app/profile/selfteach.me",
      "threads": "https://www.threads.net/@selfteachme"
    }
  },
  {
    "id": "4c91217a-f5f9-44ba-a22a-18af2329da3a",
    "socials": {
      "github": "http://github.com/andreaowu",
      "medium": "https://andreaowu.medium.com/",
      "linkedin": "https://www.linkedin.com/in/andreaowu"
    }
  },
  {
    "id": "RIgC5r4TJ0hCGOzxHt4aYA",
    "socials": {
      "linkedin": "https://www.linkedin.com/in/kulkarniankita/",
      "twitter": "https://twitter.com/kulkarniankita9",
      "youtube": "https://www.youtube.com/channel/UCbklMsA4tFtq4DEf1dyViQw",
      "bluesky": "https://bsky.app/profile/kulkarniankita.com"
    }
  },
  {
    "id": "RIgC5r4TJ0hCGOzxHt4YfJ",
    "socials": {
      "github": "https://github.com/ajcwebdev",
      "twitter": "https://twitter.com/ajcwebdev",
      "youtube": "https://youtube.com/@ajcwebdev",
      "linkedin": "https://www.linkedin.com/in/ajcwebdev"
    }
  },
  {
    "id": "RIgC5r4TJ0hCGOzxHt4ZjM",
    "socials": {
      "github": "https://github.com/antoniolofiego",
      "linkedin": "https://www.linkedin.com/in/antoniolofiego/",
      "twitter": "https://twitter.com/antonio_lofiego"
    }
  },
  {
    "id": "RIgC5r4TJ0hCGOzxHt4Y5k",
    "socials": {
      "github": "https://github.com/SarcevicAntonio",
      "linkedin": "https://www.linkedin.com/in/sarcevic/",
      "twitter": "https://twitter.com/SarcevicAntonio"
    }
  },
  {
    "id": "RIgC5r4TJ0hCGOzxHt4Yzd",
    "socials": {
      "devto": "https://dev.to/anuradhakumari",
      "github": "https://github.com/anuk79",
      "linkedin": "https://www.linkedin.com/in/anuradha15/",
      "twitter": "https://twitter.com/miracle_404",
      "youtube": "https://www.youtube.com/channel/UCzv8q9-tSIQuTDzgB1BgXMQ",
      "instagram": "https://www.instagram.com/anuradha_404/",
      "threads": "https://www.threads.net/@anuradha_404"
    }
  },
  {
    "id": "RIgC5r4TJ0hCGOzxHt4BTU",
    "socials": {
      "github": "https://github.com/aprilw",
      "twitter": "https://twitter.com/aprilwensel",
      "linkedin": "https://linkedin.com/in/aprilwensel",
      "mastodon": "https://mastodon.social/@aprilwensel",
      "bluesky": "https://bsky.app/profile/aprilwensel.com"
    }
  },
  {
    "id": "2795b7e9-0450-410d-942c-7f21f2ecbce8",
    "socials": {
      "linkedin": "https://www.linkedin.com/in/balkikodarapu/"
    }
  },
  {
    "id": "RIgC5r4TJ0hCGOzxHt4XR6",
    "socials": {
      "github": "https://github.com/BatuhanW",
      "twitter": "https://twitter.com/kakamelatte"
    }
  },
  {
    "id": "RIgC5r4TJ0hCGOzxHt3yr4",
    "socials": {
      "github": "https://twitter.com/BekahHW",
      "instagram": "https://www.instagram.com/BekahHW",
      "linkedin": "https://www.linkedin.com/in/bekah-hawrot-weigel/",
      "twitter": "https://twitter.com/BekahHW",
      "youtube": "https://www.youtube.com/@bekahhw",
      "bluesky": "https://bsky.app/profile/bekahhw.com",
      "threads": "https://www.threads.net/@BekahHW"
    }
  },
  {
    "id": "RIgC5r4TJ0hCGOzxHt48CG",
    "socials": {
      "github": "https://github.com/bencodezen",
      "mastodon": "https://m.webtoo.ls/@bencodezen",
      "twitter": "https://twitter.com/bencodezen",
      "youtube": "https://www.youtube.com/bencodezen",
      "bluesky": "https://bsky.app/profile/bencodezen.io",
      "linkedin": "https://linkedin.com/in/bencodezen",
      "instagram": "https://www.instagram.com/bencodezen",
      "threads": "https://www.threads.net/@bencodezen"
    }
  },
  {
    "id": "RIgC5r4TJ0hCGOzxHt3zBO",
    "socials": {
      "github": "https://github.com/BenDMyers",
      "linkedin": "https://www.linkedin.com/in/BenDMyers/",
      "mastodon": "https://a11y.info/@ben",
      "twitch": "https://www.twitch.tv/SomeAnticsDev",
      "twitter": "https://twitter.com/BenDMyers",
      "youtube": "https://www.youtube.com/channel/UCoc1J1XEEtg4sNrt3V-tNRw",
      "bluesky": "https://bsky.app/profile/benmyers.dev"
    }
  },
  {
    "id": "97a6824d-8fc4-4385-9966-a27497f131cb",
    "socials": {
      "facebook": "https://www.facebook.com/automateboring",
      "linkedin": "https://www.linkedin.com/company/automateboring",
      "youtube": "https://www.youtube.com/@theAutomateBoring"
    }
  },
  {
    "id": "RIgC5r4TJ0hCGOzxHt3ybp",
    "socials": {
      "codepen": "http://codepen.io/bradfrost/",
      "github": "https://github.com/bradfrost",
      "instagram": "http://instagram.com/brad_frost",
      "lastfm": "http://www.last.fm/user/brad_frost",
      "linkedin": "https://www.linkedin.com/in/bradfrost",
      "mastodon": "https://mastodon.social/@brad_frost",
      "spotify": "https://open.spotify.com/user/ienjoyhotsoup",
      "twitter": "https://twitter.com/brad_frost/",
      "youtube": "https://www.youtube.com/@brad_frost",
      "bluesky": "https://bsky.app/profile/bradfrost.bsky.social",
      "threads": "https://www.threads.net/@brad_frost"
    }
  },
  {
    "id": "RIgC5r4TJ0hCGOzxHt4XlQ",
    "socials": {
      "discord": "https://bradgarropy.com/discord",
      "github": "https://github.com/bradgarropy",
      "twitch": "https://twitch.tv/bradgarropy",
      "twitter": "https://twitter.com/bradgarropy",
      "youtube": "https://youtube.com/bradgarropy",
      "mastodon": "https://youtube.com/@bradgarropy",
      "instagram": "https://instagram.com/bradgarropy",
      "bluesky": "https://bsky.app/profile/bradgarropy.com",
      "linkedin": "https://linkedin.com/in/bradgarropy",
      "threads": "https://www.threads.net/@bradgarropy"
    }
  },
  {
    "id": "RIgC5r4TJ0hCGOzxHt3yMa",
    "socials": {
      "linkedin": "https://www.linkedin.com/in/braden-sidoti-25676537/",
      "twitter": "https://twitter.com/bsinthewild",
      "bluesky": "https://bsky.app/profile/bs14.bsky.social"
    }
  },
  {
    "id": "RIgC5r4TJ0hCGOzxHt3g5b",
    "socials": {
      "github": "https://github.com/flybayer",
      "twitter": "https://twitter.com/flybayer"
    }
  },
  {
    "id": "RIgC5r4TJ0hCGOzxHt3fqM",
    "socials": {
      "github": "https://github.com/brandonroberts",
      "twitter": "https://twitter.com/brandontroberts",
      "youtube": "https://www.youtube.com/@BrandonRobertsDev",
      "linkedin": "https://www.linkedin.com/in/brandontroberts/",
      "bluesky": "https://bsky.app/profile/brandonroberts.dev"
    }
  },
  {
    "id": "RIgC5r4TJ0hCGOzxHt3pGd",
    "socials": {
      "linkedin": "https://www.linkedin.com/in/brettgfitzgerald/"
    }
  },
  {
    "id": "c14bf99a-2345-47d9-b3cb-81b6ed30bfe4",
    "socials": {
      "github": "https://github.com/clarkio",
      "instagram": "https://www.instagram.com/_clarkio/?hl=en",
      "linkedin": "https://www.linkedin.com/in/brianclarkdev/",
      "polywork": "https://www.polywork.com/clarkio",
      "twitch": "https://www.twitch.tv/clarkio",
      "twitter": "https://x.com/_clarkio",
      "youtube": "https://www.youtube.com/channel/UCID02LhTNYYhWbok3zyggOw",
      "tiktok": "https://tiktok.com/@clarkio",
      "bluesky": "https://bsky.app/profile/brianclark.social",
      "threads": "https://www.threads.net/@_clarkio"
    }
  },
  {
    "id": "RIgC5r4TJ0hCGOzxHt3Mpe",
    "socials": {
      "github": "https://github.com/bdougie",
      "linkedin": "https://www.linkedin.com/in/brianldouglas/",
      "twitter": "https://twitter.com/bdougieYO",
      "bluesky": "https://bsky.app/profile/bizza.pizza",
      "instagram": "https://instagram.com/bdougieyo",
      "youtube": "https://youtube.com/@bdougie",
      "threads": "https://www.threads.net/@bdougieyo"
    }
  },
  {
    "id": "RIgC5r4TJ0hCGOzxHt3Lvl",
    "socials": {
      "github": "https://github.com/bwhli",
      "linkedin": "https://www.linkedin.com/in/bwhli/?originalSubdomain=jp",
      "twitter": "https://twitter.com/bwhli",
      "instagram": "https://instagram.com/bwhli",
      "threads": "https://www.threads.net/@bwhli"
    }
  },
  {
    "id": "RIgC5r4TJ0hCGOzxHt3MG5",
    "socials": {
      "github": "https://github.com/remotesynth",
      "linkedin": "https://www.linkedin.com/in/brianrinaldi/",
      "twitter": "https://twitter.com/remotesynth",
      "mastodon": "https://mastodon.xyz/@remotesynth",
      "bluesky": "https://bsky.app/profile/remotesynthesis.com"
    }
  },
  {
    "id": "RIgC5r4TJ0hCGOzxHt3MVK",
    "socials": {
      "github": "https://github.com/brittanyrw",
      "linkedin": "https://www.linkedin.com/in/brittanyrwalker/",
      "polywork": "https://www.polywork.com/musicalwebdev",
      "twitter": "https://twitter.com/musicalwebdev",
      "bluesky": "https://bsky.app/profile/musicalwebdev.bsky.social"
    }
  },
  {
    "id": "9ea0a439-2219-455b-97a2-4c21559ce8e5",
    "socials": {
      "twitter": "https://x.com/BrittneyPostma",
      "bluesky": "https://bsky.app/profile/brittneypostma.bsky.social",
      "github": "https://github.com/brittneypostma",
      "linkedin": "https://www.linkedin.com/in/brittneypostma/",
      "youtube": "https://www.youtube.com/@BrittneyPostma"
    }
  },
  {
    "id": "RIgC5r4TJ0hCGOzxHt31Rb",
    "socials": {
      "github": "https://github.com/brob",
      "mastodon": "https://hachyderm.io/@brob",
      "twitch": "https://www.twitch.tv/bryanlrobinson",
      "twitter": "https://twitter.com/brob",
      "bluesky": "https://bsky.app/profile/brob.dev",
      "youtube": "https://www.youtube.com/@bryanlrobinson",
      "linkedin": "https://linkedin.com/in/bryanlrobinson"
    }
  },
  {
    "id": "RIgC5r4TJ0hCGOzxHt25LQ",
    "socials": {
      "codepen": "https://codepen.io/cassidoo/",
      "github": "https://github.com/cassidoo",
      "linkedin": "https://www.linkedin.com/in/cassidoo/",
      "twitter": "https://twitter.com/cassidoo",
      "bluesky": "https://bsky.app/profile/cassidoo.co",
      "mastodon": "https://notacult.social/@cassidoo"
    }
  },
  {
    "id": "RIgC5r4TJ0hCGOzxHt2aeE",
    "socials": {
      "dribbble": "https://dribbble.com/chrisbiscardi",
      "github": "https://github.com/christopherbiscardi",
      "twitter": "https://twitter.com/chrisbiscardi",
      "youtube": "http://youtube.com/c/chrisbiscardi",
      "bluesky": "https://bsky.app/profile/chrisbiscardi.bsky.social",
      "mastodon": "https://hachyderm.io/@chrisbiscardi"
    }
  },
  {
    "id": "6cd2fb87-5431-424c-a0cc-267f6890f4ba",
    "socials": {
      "linkedin": "https://www.linkedin.com/in/cferdinandi/",
      "mastodon": "https://mastodon.social/@cferdinandi",
      "bluesky": "https://bsky.app/profile/cferdinandi.bsky.social"
    }
  },
  {
    "id": "5cb367ce-a218-4c3d-8614-a64e188a08c1",
    "socials": {
      "github": "https://github.com/chris-sev",
      "linkedin": "https://www.linkedin.com/in/chrissev",
      "twitter": "https://twitter.com/chris__sev",
      "youtube": "https://www.youtube.com/c/ChrisSev",
      "bluesky": "https://bsky.app/profile/chrissev.bsky.social"
    }
  },
  {
    "id": "RIgC5r4TJ0hCGOzxHt1ll9",
    "socials": {
      "github": "https://github.com/delucis/",
      "mastodon": "https://m.webtoo.ls/@swithinbank",
      "twitter": "https://twitter.com/swithinbank",
      "bluesky": "https://bsky.app/profile/chrisswithin.bsky.social"
    }
  },
  {
    "id": "RIgC5r4TJ0hCGOzxHt1Hvn",
    "socials": {
      "github": "https://github.com/burnedchris",
      "linkedin": "https://www.linkedin.com/in/burnedchris/",
      "twitch": "https://www.twitch.tv/burnedchris",
      "twitter": "https://twitter.com/burnedchris",
      "bluesky": "https://bsky.app/profile/inth.com"
    }
  },
  {
    "id": "RIgC5r4TJ0hCGOzxHt0uzD",
    "socials": {
      "linkedin": "https://www.linkedin.com/in/enniskloote/",
      "medium": "https://enniskloote.medium.com/",
      "twitter": "https://twitter.com/EnnisKloote"
    }
  },
  {
    "id": "RIgC5r4TJ0hCGOzxHt0IdT",
    "socials": {
      "github": "https://github.com/theClarkSell",
      "twitter": "https://twitter.com/theclarksell",
      "linkedin": "https://www.linkedin.com/in/theclarksell/",
      "youtube": "https://www.youtube.com/clarksell",
      "instagram": "https://instagram.com/theClarkSell",
      "bluesky": "https://bsky.app/profile/clarksell.bsky.social",
      "threads": "https://www.threads.net/@theClarkSell"
    }
  },
  {
    "id": "RIgC5r4TJ0hCGOzxHt0UgK",
    "socials": {
      "github": "https://github.com/colbyfayock",
      "mastodon": "https://hachyderm.io/@colbyfayock",
      "twitch": "https://www.twitch.tv/colbyfayock",
      "twitter": "https://twitter.com/colbyfayock",
      "youtube": "https://www.youtube.com/colbyfayock",
      "bluesky": "https://bsky.app/profile/colbyfayock.com",
      "instagram": "https://www.instagram.com/colbyfayock/",
      "threads": "https://www.threads.net/@colbyfayock"
    }
  },
  {
    "id": "8c1a2a76-b615-430b-96d8-0f80097dc370",
    "socials": {
      "discord": "https://discord.com/invite/FMcvc6T",
      "github": "https://github.com/crutchcorn",
      "twitch": "https://www.twitch.tv/crutchcorn",
      "twitter": "https://twitter.com/crutchcorn/",
      "bluesky": "https://bsky.app/profile/crutchcorn.dev",
      "linkedin": "https://www.linkedin.com/in/corbincrutchley/"
    }
  },
  {
    "id": "fcd7ce46-7e73-4802-8ec9-9fbaf5f13ee5",
    "socials": {
      "linkedin": "https://www.linkedin.com/in/dan-hafner-35066a39/"
    }
  },
  {
    "id": "RIgC5r4TJ0hCGOzxHt0IJ9",
    "socials": {
      "github": "https://github.com/DanRibbens",
      "linkedin": "https://www.linkedin.com/in/danribbens/",
      "twitter": "https://twitter.com/DanielRibbens",
      "instagram": "https://www.instagram.com/payloadcms/",
      "threads": "https://www.threads.net/@payloadcms"
    }
  },
  {
    "id": "RIgC5r4TJ0hCGOzxHt0Hyp",
    "socials": {
      "github": "https://github.com/danielroe",
      "mastodon": "https://mastodon.roe.dev/@daniel",
      "twitch": "https://www.twitch.tv/danielroe",
      "twitter": "https://twitter.com/danielcroe",
      "youtube": "https://www.youtube.com/@danielroe",
      "bluesky": "https://bsky.app/profile/danielroe.dev",
      "linkedin": "https://www.linkedin.com/in/daniel-roe/",
      "instagram": "https://www.instagram.com/daniel.c.roe",
      "threads": "https://www.threads.net/@daniel.c.roe"
    }
  },
  {
    "id": "RIgC5r4TJ0hCGOzxHt0HeV",
    "socials": {
      "github": "https://github.com/debs-obrien",
      "linkedin": "https://www.linkedin.com/in/debbie-o-brien-1a199975/",
      "twitter": "https://twitter.com/debs_obrien",
      "youtube": "https://www.youtube.com/c/DebbieOBrien",
      "bluesky": "https://bsky.app/profile/debbie.codes"
    }
  },
  {
    "id": "RIgC5r4TJ0hCGOzxHt0HPG",
    "socials": {
      "github": "https://github.com/domitriusclark",
      "twitch": "https://twitch.com/domitriusclark",
      "twitter": "https://twitter.com/domitriusclark",
      "linkedin": "https://www.linkedin.com/in/domitriusclark/",
      "bluesky": "https://bsky.app/profile/domitriusclark.bsky.social"
    }
  },
  {
    "id": "RIgC5r4TJ0hCGOzxHt0H4w",
    "socials": {
      "github": "https://github.com/DouweM",
      "linkedin": "https://www.linkedin.com/in/douwem/",
      "twitter": "https://twitter.com/DouweM"
    }
  },
  {
    "id": "RIgC5r4TJ0hCGOzxHt0GB3",
    "socials": {
      "github": "https://github.com/DAlperin",
      "twitter": "https://twitter.com/dovunderscore",
      "mastodon": "https://mastodon.social/@dov",
      "linkedin": "https://www.linkedin.com/in/dov-alperin"
    }
  },
  {
    "id": "RIgC5r4TJ0hCGOzxHt0Gkc",
    "socials": {
      "github": "https://github.com/posva",
      "mastodon": "https://m.webtoo.ls/@posva",
      "twitter": "https://twitter.com/posva",
      "bluesky": "https://bsky.app/profile/esm.dev"
    }
  },
  {
    "id": "RIgC5r4TJ0hCGOzxHt0GQI",
    "socials": {
      "github": "https://github.com/kenny-io",
      "twitter": "https://twitter.com/kenny_io",
      "youtube": "https://www.youtube.com/c/EkeneEze",
      "linkedin": "https://www.linkedin.com/in/ekeneeze/"
    }
  },
  {
    "id": "RIgC5r4TJ0hCGOzxHt0Fvo",
    "socials": {
      "devto": "https://dev.to/elenalape",
      "github": "https://github.com/elenalape",
      "linkedin": "https://www.linkedin.com/in/ElenaLape/",
      "twitter": "https://twitter.com/elena_lape",
      "youtube": "https://www.youtube.com/elenalape"
    }
  },
  {
    "id": "RIgC5r4TJ0hCGOzxHt0FMF",
    "socials": {
      "linkedin": "https://www.linkedin.com/in/elizabethbush/"
    }
  },
  {
    "id": "RIgC5r4TJ0hCGOzxHt0F70",
    "socials": {
      "linkedin": "https://www.linkedin.com/in/elizabethtrumanwilson/",
      "twitter": "https://twitter.com/TruWil",
      "bluesky": "https://bsky.app/profile/wilsones13.bsky.social"
    }
  },
  {
    "id": "RIgC5r4TJ0hCGOzxHt0FbU",
    "socials": {
      "github": "https://github.com/twerske",
      "instagram": "https://www.instagram.com/twerske/",
      "linkedin": "https://www.linkedin.com/in/emmatwersky/",
      "twitter": "https://twitter.com/twerske",
      "bluesky": "https://bsky.app/profile/twerk.bsky.social",
      "threads": "https://www.threads.net/@twerske"
    }
  },
  {
    "id": "RIgC5r4TJ0hCGOzxHt0Erl",
    "socials": {
      "github": "https://github.com/EricSimons",
      "linkedin": "https://www.linkedin.com/in/eric-simons-a464a664/",
      "twitter": "https://twitter.com/ericsimons40",
      "bluesky": "https://bsky.app/profile/esft.bsky.social"
    }
  },
  {
    "id": "RIgC5r4TJ0hCGOzxHt0CKG",
    "socials": {
      "github": "https://github.com/ErikCH",
      "twitter": "https://twitter.com/ErikCH",
      "youtube": "https://www.youtube.com/c/programwitherik",
      "bluesky": "https://bsky.app/profile/erikch.bsky.social"
    }
  },
  {
    "id": "RIgC5r4TJ0hCGOzxHt0EcW",
    "socials": {
      "github": "https://github.com/fgiuliani",
      "linkedin": "https://www.linkedin.com/in/facundogiuliani/",
      "twitter": "https://twitter.com/facundozurdo",
      "bluesky": "https://bsky.app/profile/fgiuliani.bsky.social"
    }
  },
  {
    "id": "RIgC5r4TJ0hCGOzxHt0C51",
    "socials": {
      "linkedin": "https://www.linkedin.com/in/florantara/",
      "twitter": "https://twitter.com/techflor"
    }
  },
  {
    "id": "RIgC5r4TJ0hCGOzxHt0Bpm",
    "socials": {
      "github": "https://github.com/fredkschott",
      "linkedin": "https://www.linkedin.com/in/fredkschott/",
      "twitter": "https://twitter.com/fredkschott"
    }
  },
  {
    "id": "RIgC5r4TJ0hCGOzxHt0BLI",
    "socials": {
      "github": "https://github.com/graysonhicks",
      "twitter": "https://twitter.com/graysonhicks",
      "instagram": "https://instagram.com/jgraysonhicks",
      "threads": "https://www.threads.net/@jgraysonhicks"
    }
  },
  {
    "id": "RIgC5r4TJ0hCGOzxHt0B63",
    "socials": {
      "github": "https://github.com/gregwhitworth",
      "twitter": "https://twitter.com/gregwhitworth",
      "linkedin": "https://www.linkedin.com/in/gregwhitworth/",
      "bluesky": "https://bsky.app/profile/gregwhitworth.bsky.social"
    }
  },
  {
    "id": "RIgC5r4TJ0hCGOzxHt0BaX",
    "socials": {
      "github": "https://github.com/rauchg",
      "instagram": "https://www.instagram.com/rauchg/",
      "linkedin": "https://www.linkedin.com/in/guillermo-rauch-b834b917b/",
      "twitter": "https://twitter.com/rauchg",
      "bluesky": "https://bsky.app/profile/rauchg.blue",
      "threads": "https://www.threads.net/@rauchg"
    }
  },
  {
    "id": "RIgC5r4TJ0hCGOzxHt0Aqo",
    "socials": {
      "linkedin": "https://www.linkedin.com/in/heather-buchel-92bb5b64/",
      "mastodon": "https://hachyderm.io/@hbuchel",
      "twitter": "https://twitter.com/hbuchel",
      "bluesky": "https://bsky.app/profile/heather-buchel.com"
    }
  },
  {
    "id": "RIgC5r4TJ0hCGOzxHt0AbZ",
    "socials": {
      "twitter": "https://twitter.com/hdjirdeh",
      "bluesky": "https://bsky.app/profile/houssein.bsky.social"
    }
  },
  {
    "id": "RIgC5r4TJ0hCGOzxHt0A20",
    "socials": {
      "twitter": "https://twitter.com/igorzij"
    }
  },
  {
    "id": "RIgC5r4TJ0hCGOzxHt0AHF",
    "socials": {
      "twitter": "https://twitter.com/jakob_rosenberg",
      "bluesky": "https://bsky.app/profile/jakerosenberg.bsky.social"
    }
  },
  {
    "id": "RIgC5r4TJ0hCGOzxHt09XW",
    "socials": {
      "github": "https://github.com/perkinsjr/",
      "twitter": "https://twitter.com/james_r_perkins",
      "youtube": "https://www.youtube.com/@james-perkins",
      "bluesky": "https://bsky.app/profile/jamesperkins.bsky.social"
    }
  },
  {
    "id": "RIgC5r4TJ0hCGOzxHt09ml",
    "socials": {
      "github": "https://github.com/jamesqquick",
      "instagram": "https://instagram.com/jamesqquick",
      "linkedin": "https://www.linkedin.com/in/jamesqquick/",
      "tiktok": "https://www.tiktok.com/@jamesqquick",
      "twitch": "https://www.twitch.tv/jamesqquick",
      "twitter": "https://twitter.com/jamesqquick",
      "youtube": "https://www.youtube.com/jamesqquick",
      "bluesky": "https://bsky.app/profile/jamesqquick.bsky.social",
      "threads": "https://www.threads.net/@jamesqquick"
    }
  },
  {
    "id": "RIgC5r4TJ0hCGOzxHt08OO",
    "socials": {
      "github": "https://github.com/jamesvidler",
      "linkedin": "https://www.linkedin.com/in/jameskvidler/",
      "twitter": "https://twitter.com/jameskvidler",
      "bluesky": "https://bsky.app/profile/fownhopeboy.bsky.social"
    }
  },
  {
    "id": "RIgC5r4TJ0hCGOzxHt0899",
    "socials": {
      "twitter": "https://twitter.com/jasonbahl"
    }
  },
  {
    "id": "RIgC5r4TJ0hCGOzxHt07tu",
    "socials": {
      "github": "https://github.com/jlengstorf",
      "linkedin": "https://www.linkedin.com/in/jlengstorf/",
      "twitch": "https://www.twitch.tv/jlengstorf",
      "twitter": "https://twitter.com/jlengstorf",
      "youtube": "https://www.youtube.com/channel/UCnty0z0pNRDgnuoirYXnC5A",
      "mastodon": "https://youtube.com/@codetv-dev",
      "bluesky": "https://bsky.app/profile/jason.energy",
      "instagram": "https://instagram.com/jlengstorf",
      "threads": "https://www.threads.net/@jlengstorf"
    }
  },
  {
    "id": "RIgC5r4TJ0hCGOzxHt07ef",
    "socials": {
      "github": "https://github.com/codediodeio",
      "linkedin": "https://www.linkedin.com/in/jeff-delaney/",
      "twitter": "https://twitter.com/jeffdelaney23",
      "youtube": "https://www.youtube.com/fireship"
    }
  },
  {
    "id": "RIgC5r4TJ0hCGOzxHt07AB",
    "socials": {
      "linkedin": "https://www.linkedin.com/in/jennjunod/",
      "twitch": "https://www.twitch.tv/jennjunod",
      "twitter": "https://twitter.com/jennjunod",
      "youtube": "https://www.youtube.com/channel/UCOYqYy7ebj5j63TbdGB-Lcg",
      "bluesky": "https://bsky.app/profile/jennjunod.bsky.social"
    }
  },
  {
    "id": "RIgC5r4TJ0hCGOzxHt06QS",
    "socials": {
      "discord": "https://discord.com/invite/A9CnsVzzkZ",
      "github": "https://github.com/codestackr",
      "linkedin": "https://www.linkedin.com/in/codestackr/",
      "twitch": "https://www.twitch.tv/elpunish3rr/",
      "twitter": "https://twitter.com/codeSTACKr",
      "youtube": "https://www.youtube.com/codestackr",
      "bluesky": "https://bsky.app/profile/codestackr.com"
    }
  },
  {
    "id": "RIgC5r4TJ0hCGOzxHt07PQ",
    "socials": {
      "twitter": "https://twitter.com/jh3yy"
    }
  },
  {
    "id": "RIgC5r4TJ0hCGOzxHt06fh",
    "socials": {
      "github": "https://github.com/wolfenrain",
      "linkedin": "https://www.linkedin.com/in/jochum-van-der-ploeg/",
      "stackoverflow": "https://stackoverflow.com/users/1945274/acekyd",
      "twitch": "https://www.twitch.tv/elpunish3rr/",
      "twitter": "https://twitter.com/wolfenrain",
      "youtube": "https://www.youtube.com/acekyd",
      "mastodon": "https://mastodon.social/@wolfenrain",
      "bluesky": "https://bsky.app/profile/wolfenra.in"
    }
  },
  {
    "id": "9a8d9256-114c-479d-af51-7fc9176b7abf",
    "socials": {
      "bluesky": "https://bsky.app/profile/casabona.org",
      "github": "https://github.com/jcasabona",
      "instagram": "https://instagram.com/jcasabona",
      "linkedin": "https://www.linkedin.com/in/jcasabona/",
      "youtube": "https://www.youtube.com/@JoeCasa",
      "threads": "https://www.threads.net/@jcasabona"
    }
  },
  {
    "id": "RIgC5r4TJ0hCGOzxHt06uw",
    "socials": {
      "linkedin": "https://www.linkedin.com/in/joelvarty",
      "twitter": "https://twitter.com/joelvarty",
      "bluesky": "https://bsky.app/profile/joelvarty.com"
    }
  },
  {
    "id": "RIgC5r4TJ0hCGOzxHt06BD",
    "socials": {
      "github": "https://github.com/dijonmusters",
      "twitter": "https://twitter.com/jonmeyers_io",
      "youtube": "https://youtube.com/supabase",
      "bluesky": "https://bsky.app/profile/jonmeyers.io"
    }
  },
  {
    "id": "dc5819bf-2835-40e2-8f94-73d6b6518329",
    "socials": {
      "github": "https://github.com/jonathanwilke",
      "linkedin": "https://www.linkedin.com/in/jonathan-wilke-766a83b8/",
      "twitter": "https://x.com/jonathan_wilke",
      "bluesky": "https://bsky.app/profile/jonathanwilke.bsky.social"
    }
  },
  {
    "id": "RIgC5r4TJ0hCGOzxHt05vy",
    "socials": {
      "facebook": "https://www.facebook.com/thejordanpowell",
      "github": "https://github.com/jordanpowell88",
      "instagram": "https://www.instagram.com/thejordanpowell",
      "linkedin": "https://www.linkedin.com/in/jordanpowell88/",
      "twitter": "https://twitter.com/JordanPowell88",
      "youtube": "https://www.youtube.com/channel/UCDNwR4FvrnQTYABq_rJuvAg",
      "bluesky": "https://bsky.app/profile/jordanpowell.bsky.social",
      "threads": "https://www.threads.net/@thejordanpowell"
    }
  },
  {
    "id": "RIgC5r4TJ0hCGOzxHt05gj",
    "socials": {
      "twitter": "https://twitter.com/JsfnSchfr"
    }
  },
  {
    "id": "RIgC5r4TJ0hCGOzxHt04x0",
    "socials": {
      "github": "https://github.com/juanwmedia",
      "twitter": "https://twitter.com/juanwmedia",
      "linkedin": "https://www.linkedin.com/in/juanwmedia/",
      "youtube": "https://www.youtube.com/@juanwmedia",
      "bluesky": "https://bsky.app/profile/juanandreses.bsky.social"
    }
  },
  {
    "id": "RIgC5r4TJ0hCGOzxHt05CF",
    "socials": {
      "github": "https://github.com/juristr",
      "twitter": "https://twitter.com/juristr",
      "bluesky": "https://bsky.app/profile/juri.dev",
      "linkedin": "https://linkedin.com/in/juristr/",
      "youtube": "https://youtube.com/@juristr"
    }
  },
  {
    "id": "RIgC5r4TJ0hCGOzxHt04IM",
    "socials": {
      "github": "https://github.com/jmduke",
      "twitter": "https://twitter.com/jmduke",
      "bluesky": "https://bsky.app/profile/jmduke.com"
    }
  },
  {
    "id": "RIgC5r4TJ0hCGOzxHt04hl",
    "socials": {
      "github": "https://github.com/jschwarty",
      "linkedin": "https://www.linkedin.com/in/justinschwartzenberger/",
      "stackoverflow": "https://stackoverflow.com/users/349596/justin-schwartzenberger",
      "twitter": "https://twitter.com/schwarty",
      "bluesky": "https://bsky.app/profile/schwarty.com"
    }
  },
  {
    "id": "RIgC5r4TJ0hCGOzxHt0437",
    "socials": {
      "github": "https://github.com/mandarini",
      "linkedin": "https://www.linkedin.com/in/katerinaskroumpelou/",
      "medium": "https://pakotinia.medium.com/",
      "twitter": "https://twitter.com/psybercity",
      "bluesky": "https://bsky.app/profile/psyber.city"
    }
  },
  {
    "id": "RIgC5r4TJ0hCGOzxHt0349",
    "socials": {
      "devto": "https://dev.to/kathryngrayson",
      "github": "https://github.com/kathryngraysonnanz",
      "linkedin": "https://www.linkedin.com/in/kathryngrayson/",
      "polywork": "https://www.polywork.com/kathrynkay",
      "twitter": "https://twitter.com/kathryngrayson",
      "bluesky": "https://bsky.app/profile/kgrayson.com"
    }
  },
  {
    "id": "RIgC5r4TJ0hCGOzxHt03JO",
    "socials": {
      "linkedin": "https://www.linkedin.com/in/katienfranco/",
      "twitter": "https://twitter.com/girldevelopit"
    }
  },
  {
    "id": "RIgC5r4TJ0hCGOzxHt02ou",
    "socials": {
      "github": "https://github.com/kellenmace",
      "linkedin": "https://www.linkedin.com/in/kellenmace/",
      "twitter": "https://twitter.com/kellenmace",
      "bluesky": "https://bsky.app/profile/kellenmace.bsky.social"
    }
  },
  {
    "id": "RIgC5r4TJ0hCGOzxHt025B",
    "socials": {
      "github": "https://github.com/kellyvaughn",
      "instagram": "https://www.instagram.com/kelllyvaughn/",
      "linkedin": "https://www.linkedin.com/in/kellyvaughn/",
      "substack": "https://substack.com/@kvlly",
      "twitter": "https://twitter.com/kvlly",
      "bluesky": "https://bsky.app/profile/kvlly.com",
      "threads": "https://www.threads.net/@kelllyvaughn"
    }
  },
  {
    "id": "RIgC5r4TJ0hCGOzxHt02KQ",
    "socials": {
      "github": "https://github.com/kentcdodds",
      "twitter": "https://twitter.com/kentcdodds",
      "youtube": "https://www.youtube.com/@kentcdodds-vids",
      "bluesky": "https://bsky.app/profile/kentcdodds.com"
    }
  },
  {
    "id": "RIgC5r4TJ0hCGOzxHt01pw",
    "socials": {
      "github": "https://github.com/kmelve",
      "linkedin": "https://www.linkedin.com/in/knutmelvaer/",
      "twitter": "https://twitter.com/kmelve",
      "bluesky": "https://bsky.app/profile/knut.fyi"
    }
  },
  {
    "id": "RIgC5r4TJ0hCGOzxHt02Zf",
    "socials": {
      "github": "https://github.com/wagslane",
      "linkedin": "https://www.linkedin.com/in/wagslane/",
      "twitter": "https://twitter.com/wagslane",
      "bluesky": "https://bsky.app/profile/wagslane.bsky.social"
    }
  },
  {
    "id": "RIgC5r4TJ0hCGOzxHt01ah",
    "socials": {
      "github": "https://github.com/laurenelee",
      "linkedin": "https://www.linkedin.com/in/dev-lauren-lee/",
      "twitter": "https://twitter.com/LoLoCoding",
      "youtube": "https://www.youtube.com/channel/UCAXRntzYPySoBGSZJClcRlg",
      "bluesky": "https://bsky.app/profile/laurenlee.bsky.social"
    }
  },
  {
    "id": "RIgC5r4TJ0hCGOzxHt01LS",
    "socials": {
      "devto": "https://dev.to/laurieontech",
      "github": "https://github.com/laurieontech",
      "linkedin": "https://www.linkedin.com/in/lauriebarth/",
      "polywork": "https://timeline.laurieontech.com/",
      "twitter": "https://twitter.com/laurieontech",
      "bluesky": "https://bsky.app/profile/laurieontech.dev"
    }
  },
  {
    "id": "RIgC5r4TJ0hCGOzxHszy9J",
    "socials": {
      "github": "https://github.com/jaxxstorm",
      "linkedin": "https://www.linkedin.com/in/briggsl/",
      "twitter": "https://twitter.com/briggsl",
      "bluesky": "https://bsky.app/profile/brig.gs"
    }
  },
  {
    "id": "RIgC5r4TJ0hCGOzxHszyTd",
    "socials": {
      "github": "https://github.com/leerob",
      "linkedin": "https://www.linkedin.com/in/leeerob/",
      "twitter": "https://twitter.com/leeerob",
      "youtube": "https://www.youtube.com/@leerob",
      "bluesky": "https://bsky.app/profile/leerobinson.bsky.social"
    }
  },
  {
    "id": "740e85e5-0635-4a59-9426-714467259091",
    "socials": {
      "github": "https://github.com/lforst",
      "linkedin": "https://www.linkedin.com/in/luca-forstner-10807a231/",
      "twitter": "https://x.com/LucaForstner",
      "bluesky": "https://bsky.app/profile/handle.invalid"
    }
  },
  {
    "id": "RIgC5r4TJ0hCGOzxHszpSl",
    "socials": {
      "github": "https://github.com/spydon",
      "linkedin": "https://www.linkedin.com/in/spydon/",
      "twitter": "https://twitter.com/spyd0n",
      "mastodon": "https://fosstodon.org/@spydon",
      "bluesky": "https://bsky.app/profile/spydon.dev"
    }
  },
  {
    "id": "f2a116ab-731a-4bc8-9a30-59b22f602f34",
    "socials": {
      "twitter": "https://twitter.com/mhuggins1978"
    }
  },
  {
    "id": "RIgC5r4TJ0hCGOzxHszpDW",
    "socials": {
      "github": "https://github.com/patak-dev",
      "twitter": "https://twitter.com/patak_dev"
    }
  },
  {
    "id": "RIgC5r4TJ0hCGOzxHszoj2",
    "socials": {
      "github": "https://github.com/matthewp",
      "twitter": "https://twitter.com/matthewcp",
      "bluesky": "https://bsky.app/profile/spooky.click"
    }
  },
  {
    "id": "91c2331d-0fa1-4905-8bfe-8f5b78f00c64",
    "socials": {
      "github": "https://github.com/maxwellgerber",
      "linkedin": "https://www.linkedin.com/in/maxwellgerber/",
      "bluesky": "https://bsky.app/profile/maxgerber.bsky.social"
    }
  },
  {
    "id": "RIgC5r4TJ0hCGOzxHszoTn",
    "socials": {
      "github": "https://github.com/mxcl",
      "twitter": "https://twitter.com/mxcl",
      "linkedin": "https://www.linkedin.com/in/mxcl"
    }
  },
  {
    "id": "RIgC5r4TJ0hCGOzxHszoEY",
    "socials": {
      "facebook": "https://www.facebook.com/mayashavin",
      "github": "https://github.com/mayashavin",
      "linkedin": "https://www.linkedin.com/in/mayashavin/",
      "twitter": "https://twitter.com/MayaShavin",
      "youtube": "https://www.youtube.com/@mayashavin",
      "bluesky": "https://bsky.app/profile/mayashavin.com"
    }
  },
  {
    "id": "RIgC5r4TJ0hCGOzxHsznzJ",
    "socials": {
      "discord": "http://discord.gg/lunchdev",
      "github": "https://github.com/chantastic",
      "twitter": "https://twitter.com/chantastic",
      "youtube": "https://www.youtube.com/c/chantastic",
      "mastodon": "https://www.youtube.com/@chantastic",
      "instagram": "https://www.instagram.com/chantastic/",
      "bluesky": "https://bsky.app/profile/michaelcwchan.bsky.social",
      "threads": "https://www.threads.net/@chantastic"
    }
  },
  {
    "id": "RIgC5r4TJ0hCGOzxHsznk4",
    "socials": {
      "github": "https://github.com/mrdowden",
      "linkedin": "https://www.linkedin.com/in/mrdowden/",
      "medium": "https://mrdowden.medium.com/",
      "tiktok": "https://www.tiktok.com/@mrdowden",
      "twitch": "https://www.twitch.tv/andromedagalactic",
      "twitter": "https://twitter.com/mrdowden",
      "youtube": "https://www.youtube.com/@mrdowden",
      "mastodon": "https://mastodon.social/@mrdowden",
      "bluesky": "https://bsky.app/profile/mrdowden.bsky.social"
    }
  },
  {
    "id": "RIgC5r4TJ0hCGOzxHsznUp",
    "socials": {
      "github": "https://github.com/mhartington",
      "linkedin": "https://www.linkedin.com/in/mike-hartington-63638362/",
      "twitter": "https://twitter.com/mhartington",
      "bluesky": "http://bsky.app/profile/mhartington.io"
    }
  },
  {
    "id": "RIgC5r4TJ0hCGOzxHszn0L",
    "socials": {
      "github": "https://github.com/mhevery",
      "twitter": "https://twitter.com/mhevery",
      "bluesky": "https://bsky.app/profile/misko.dev"
    }
  },
  {
    "id": "162bab87-d65d-4c20-b625-6ee593ebaa45",
    "socials": {
      "github": "https://github.com/ahsanayaz",
      "linkedin": "https://www.linkedin.com/in/muhammad-ahsan-ayaz",
      "twitter": "https://twitter.com/muhammad_ahsan",
      "bluesky": "https://bsky.app/profile/codewithahsan.bsky.social",
      "instagram": "https://instagram.com/code.with.ahsan",
      "threads": "https://www.threads.net/@code.with.ahsan"
    }
  },
  {
    "id": "RIgC5r4TJ0hCGOzxHsznFa",
    "socials": {
      "github": "https://github.com/dabit3",
      "linkedin": "https://www.linkedin.com/in/naderdabit/",
      "twitter": "https://twitter.com/dabit3",
      "youtube": "https://www.youtube.com/naderdabit",
      "bluesky": "https://bsky.app/profile/dabit3.bsky.social"
    }
  },
  {
    "id": "RIgC5r4TJ0hCGOzxHszml6",
    "socials": {
      "github": "https://github.com/Dayhaysoos",
      "twitter": "https://twitter.com/dayhaysoos",
      "bluesky": "https://bsky.app/profile/dayhaysoos.bsky.social"
    }
  },
  {
    "id": "RIgC5r4TJ0hCGOzxHszeyR",
    "socials": {
      "github": "https://github.com/nickhodges",
      "linkedin": "https://www.linkedin.com/in/nickhodges/",
      "medium": "https://nickhodges.medium.com/",
      "twitter": "https://twitter.com/nickhodges",
      "bluesky": "https://bsky.app/profile/nickhodges.bsky.social"
    }
  },
  {
    "id": "RIgC5r4TJ0hCGOzxHszgWy",
    "socials": {
      "linkedin": "https://www.linkedin.com/in/nickrouech/"
    }
  },
  {
    "id": "f3ff8de1-9b48-4768-898e-a84cb2efb228",
    "socials": {
      "discord": "https://discord.com/invite/FkGSHMxbTe",
      "github": "https://github.com/nickytonline",
      "instagram": "https://www.instagram.com/nickytonline",
      "linkedin": "https://www.linkedin.com/in/nickytonline/https://www.polywork.com/nickytonline",
      "mastodon": "https://toot.cafe/@nickytonline",
      "polywork": "https://www.polywork.com/nickytonline",
      "twitch": "https://www.twitch.tv/nickytonline",
      "twitter": "https://twitter.com/nickytonline",
      "youtube": "https://www.youtube.com/@nickytonline",
      "bluesky": "https://bsky.app/profile/nickyt.online",
      "threads": "https://www.threads.net/@nickytonline"
    }
  },
  {
    "id": "RIgC5r4TJ0hCGOzxHsziAa",
    "socials": {
      "github": "https://github.com/omedhabib",
      "instagram": "https://www.instagram.com/omed.habib",
      "linkedin": "https://www.linkedin.com/in/omed/",
      "twitter": "https://twitter.com/omedhabib",
      "threads": "https://www.threads.net/@omed.habib"
    }
  },
  {
    "id": "RIgC5r4TJ0hCGOzxHszjYx",
    "socials": {
      "facebook": "https://www.facebook.com/profile.php?id=100063550929698",
      "github": "https://github.com/ayende",
      "linkedin": "https://www.linkedin.com/in/ravendb/",
      "twitter": "https://twitter.com/ayende"
    }
  },
  {
    "id": "RIgC5r4TJ0hCGOzxHszeTx",
    "socials": {
      "linkedin": "https://www.linkedin.com/in/ovidiunegrean/",
      "twitter": "https://twitter.com/OviNegrean"
    }
  },
  {
    "id": "RIgC5r4TJ0hCGOzxHsze4Y",
    "socials": {
      "github": "https://github.com/paoloricciuti",
      "twitter": "https://twitter.com/PaoloRicciuti",
      "bluesky": "https://bsky.app/profile/paolo.ricciuti.me"
    }
  },
  {
    "id": "RIgC5r4TJ0hCGOzxHszejC",
    "socials": {
      "twitter": "https://twitter.com/parissathena"
    }
  },
  {
    "id": "RIgC5r4TJ0hCGOzxHszdAf",
    "socials": {
      "devto": "https://dev.to/devpato",
      "github": "https://github.com/devpato",
      "twitter": "https://twitter.com/devpato"
    }
  },
  {
    "id": "RIgC5r4TJ0hCGOzxHszdUz",
    "socials": {
      "github": "https://github.com/patm1987",
      "linkedin": "https://www.linkedin.com/in/patrick-martin-268a85a/",
      "medium": "https://medium.com/@pux0r3",
      "twitter": "https://twitter.com/pux0r3",
      "bluesky": "https://bsky.app/profile/pcnmartin.bsky.social"
    }
  },
  {
    "id": "RIgC5r4TJ0hCGOzxHszdkE",
    "socials": {
      "github": "https://github.com/peduarte",
      "linkedin": "https://www.linkedin.com/in/peduarteltd/?originalSubdomain=es",
      "twitter": "https://twitter.com/peduarte",
      "bluesky": "https://bsky.app/profile/ped.ro"
    }
  },
  {
    "id": "RIgC5r4TJ0hCGOzxHszcgB",
    "socials": {
      "github": "https://github.com/maxcell",
      "linkedin": "https://www.linkedin.com/in/maxcell/",
      "mastodon": "https://hachyderm.io/@maxcell",
      "twitch": "https://www.twitch.tv/maxcellw",
      "twitter": "https://twitter.com/maxcell",
      "bluesky": "https://bsky.app/profile/maxcell.bsky.social"
    }
  },
  {
    "id": "RIgC5r4TJ0hCGOzxHszcBh",
    "socials": {
      "linkedin": "https://www.linkedin.com/in/randalschwartz/",
      "twitter": "https://twitter.com/RandalSchwartz",
      "bluesky": "https://bsky.app/profile/randalschwartz.bsky.social"
    }
  },
  {
    "id": "69fe600a-1626-442f-8331-3423f3aadacc",
    "socials": {
      "codepen": "https://codepen.io/cfjedimaster",
      "github": "https://github.com/cfjedimaster",
      "linkedin": "https://www.linkedin.com/in/raymondcamden/",
      "mastodon": "https://mastodon.social/@raymondcamden",
      "youtube": "https://www.youtube.com/user/theraymondcamden"
    }
  },
  {
    "id": "RIgC5r4TJ0hCGOzxHszbwS",
    "socials": {
      "github": "https://github.com/renancaraujo",
      "linkedin": "https://www.linkedin.com/in/renancaraujo/",
      "twitter": "https://twitter.com/reNotANumber",
      "mastodon": "https://fluttercommunity.social/@renan",
      "bluesky": "https://bsky.app/profile/renanminx.bsky.social"
    }
  },
  {
    "id": "RIgC5r4TJ0hCGOzxHszbRy",
    "socials": {
      "github": "https://github.com/renebrandel",
      "linkedin": "https://www.linkedin.com/in/renebrandel/",
      "twitter": "https://twitter.com/renebrandel",
      "bluesky": "https://bsky.app/profile/renebrandel.bsky.social"
    }
  },
  {
    "id": "RIgC5r4TJ0hCGOzxHszbhD",
    "socials": {
      "github": "https://github.com/Rich-Harris",
      "linkedin": "https://www.linkedin.com/in/rich-harris/",
      "twitter": "https://twitter.com/rich_harris",
      "bluesky": "https://bsky.app/profile/rich-harris.dev"
    }
  },
  {
    "id": "RIgC5r4TJ0hCGOzxHszbCj",
    "socials": {
      "github": "https://github.com/RichardBray",
      "medium": "https://richbray.medium.com/",
      "tiktok": "https://www.tiktok.com/@richardoliverbray?lang=en",
      "twitter": "https://twitter.com/RichOBray",
      "youtube": "https://www.youtube.com/c/RichardBray"
    }
  },
  {
    "id": "RIgC5r4TJ0hCGOzxHszaNv",
    "socials": {
      "linkedin": "https://www.linkedin.com/in/robsutter/",
      "twitter": "https://twitter.com/rts_rob",
      "bluesky": "https://bsky.app/profile/robsutter.dev"
    }
  },
  {
    "id": "9fc9b65d-cfa3-4407-9f94-be7eb8cd32be",
    "socials": {
      "github": "https://github.com/romanejaquez",
      "twitter": "https://twitter.com/drcoderz",
      "bluesky": "https://bsky.app/profile/romanjaquez.bsky.social"
    }
  },
  {
    "id": "RIgC5r4TJ0hCGOzxHszaiF",
    "socials": {
      "devto": "https://dev.to/ryansolid",
      "github": "https://github.com/ryansolid",
      "twitter": "https://twitter.com/RyanCarniato",
      "bluesky": "https://bsky.app/profile/ryansolid.bsky.social"
    }
  },
  {
    "id": "RIgC5r4TJ0hCGOzxHszYkJ",
    "socials": {
      "github": "https://github.com/whitep4nth3r",
      "linkedin": "https://www.linkedin.com/in/whitep4nth3r/?originalSubdomain=uk",
      "twitch": "https://www.twitch.tv/whitep4nth3r",
      "twitter": "https://twitter.com/whitep4nth3r",
      "bluesky": "https://bsky.app/profile/whitep4nth3r.com"
    }
  },
  {
    "id": "RIgC5r4TJ0hCGOzxHszVnP",
    "socials": {
      "github": "https://github.com/calcsam",
      "linkedin": "https://www.linkedin.com/in/sambhagwat/",
      "twitter": "https://twitter.com/calcsam",
      "bluesky": "https://bsky.app/profile/calcsam.bsky.social"
    }
  },
  {
    "id": "7146388d-9566-40d9-bf71-c21da61dc133",
    "socials": {
      "github": "https://github.com/samkim",
      "linkedin": "https://www.linkedin.com/in/samskim/"
    }
  },
  {
    "id": "RIgC5r4TJ0hCGOzxHszVT5",
    "socials": {
      "github": "https://github.com/samlfair",
      "linkedin": "https://www.linkedin.com/in/samlittlefair/?originalSubdomain=ca",
      "twitter": "https://twitter.com/samlfair",
      "bluesky": "https://bsky.app/profile/littlefair.ca"
    }
  },
  {
    "id": "RIgC5r4TJ0hCGOzxHszVDq",
    "socials": {
      "github": "https://github.com/kapehe-ok",
      "linkedin": "https://www.linkedin.com/in/kapehe/",
      "twitter": "https://twitter.com/kapehe_ok",
      "youtube": "https://www.youtube.com/c/betterdevs"
    }
  },
  {
    "id": "ad09a6a8-84e1-49ea-b5ab-18e2bb1247b8",
    "socials": {
      "twitter": "https://twitter.com/saronyitbarek",
      "bluesky": "https://bsky.app/profile/saron.bsky.social"
    }
  },
  {
    "id": "0a915c5b-1da4-460d-b966-61bc18356131",
    "socials": {
      "github": "https://github.com/Sathyvs",
      "linkedin": "https://www.linkedin.com/in/sathieshveera/"
    }
  },
  {
    "id": "0ccc6e7b-24b9-4e13-87dc-ca95d86c2298",
    "socials": {
      "linkedin": "https://www.linkedin.com/in/scott-rees-3800a814/",
      "mastodon": "https://hachyderm.io/@hbuchel",
      "twitter": "https://x.com/reesscot?lang=en",
      "bluesky": "https://bsky.app/profile/scott-rees.bsky.social"
    }
  },
  {
    "id": "RIgC5r4TJ0hCGOzxHszUyb",
    "socials": {
      "github": "https://github.com/spences10",
      "twitter": "https://twitter.com/spences10",
      "bluesky": "https://bsky.app/profile/scottspence.dev"
    }
  },
  {
    "id": "RIgC5r4TJ0hCGOzxHszcQw",
    "socials": {
      "github": "https://github.com/stolinski",
      "linkedin": "https://www.linkedin.com/in/stolinski/",
      "twitter": "https://twitter.com/stolinski",
      "youtube": "https://www.youtube.com/c/leveluptuts",
      "bluesky": "https://bsky.app/profile/tolin.ski"
    }
  },
  {
    "id": "RIgC5r4TJ0hCGOzxHszUjM",
    "socials": {
      "github": "https://github.com/thefalc",
      "linkedin": "https://www.linkedin.com/in/seanf/",
      "twitter": "https://twitter.com/seanfalconer",
      "bluesky": "https://bsky.app/profile/seanfalconer.bsky.social"
    }
  },
  {
    "id": "RIgC5r4TJ0hCGOzxHszUU7",
    "socials": {
      "github": "https://github.com/shairez",
      "twitter": "https://twitter.com/shai_reznik",
      "youtube": "https://www.youtube.com/user/hirezio",
      "bluesky": "https://bsky.app/profile/shairez.bsky.social"
    }
  },
  {
    "id": "RIgC5r4TJ0hCGOzxHszSva",
    "socials": {
      "github": "https://github.com/swyxio",
      "linkedin": "https://www.linkedin.com/in/shawnswyxwang/",
      "stackoverflow": "https://stackoverflow.com/users/1106414/swyx",
      "twitter": "https://twitter.com/swyx",
      "youtube": "https://www.youtube.com/swyxTV"
    }
  },
  {
    "id": "RIgC5r4TJ0hCGOzxHszUEs",
    "socials": {
      "github": "https://github.com/shivaylamba",
      "mastodon": "https://mastodon.social/@shivaylamba",
      "twitter": "https://twitter.com/howdevelop",
      "bluesky": "https://bsky.app/profile/shivaylamba.bsky.social"
    }
  },
  {
    "id": "RIgC5r4TJ0hCGOzxHszTkO",
    "socials": {
      "github": "https://github.com/saimon24",
      "twitter": "https://twitter.com/schlimmson",
      "youtube": "https://www.youtube.com/channel/UCZZPgUIorPao48a1tBYSDgg",
      "mastodon": "https://www.youtube.com/@galaxies_dev",
      "linkedin": "https://www.linkedin.com/in/simongr/",
      "instagram": "https://www.instagram.com/simongrimm_/",
      "bluesky": "https://bsky.app/profile/galaxies.dev",
      "threads": "https://www.threads.net/@simongrimm_"
    }
  },
  {
    "id": "RIgC5r4TJ0hCGOzxHszTV9",
    "socials": {
      "twitter": "https://twitter.com/stefankingham",
      "bluesky": "https://bsky.app/profile/stefankingham.bsky.social"
    }
  },
  {
    "id": "RIgC5r4TJ0hCGOzxHszTAp",
    "socials": {
      "github": "https://github.com/steve8708",
      "linkedin": "https://www.linkedin.com/in/ssewell/",
      "tiktok": "https://www.tiktok.com/@steve8708",
      "twitter": "https://twitter.com/Steve8708",
      "youtube": "https://www.youtube.com/@Builderio",
      "bluesky": "https://bsky.app/profile/steve8708.bsky.social"
    }
  },
  {
    "id": "dfa8f1c2-1fef-4556-b061-2ea0422ec537",
    "socials": {
      "twitter": "https://x.com/tpiros",
      "youtube": "https://www.youtube.com/@WebDevFrontiers"
    }
  },
  {
    "id": "RIgC5r4TJ0hCGOzxHszSgL",
    "socials": {
      "instagram": "https://instagram.com/tdesseyn",
      "linkedin": "https://linkedin.com/in/taylordesseyn",
      "spotify": "https://open.spotify.com/show/2UBzvscEgepXLUKvA5c24x",
      "tiktok": "https://tiktok.com/@tdesseyn",
      "twitter": "https://x.com/tdesseyn",
      "youtube": "https://youtube.com/channel/UCNqJ-P5d9RUCUsQ-grhlUHw",
      "bluesky": "https://bsky.app/profile/tdesseyn.bsky.social",
      "threads": "https://www.threads.net/@tdesseyn"
    }
  },
  {
    "id": "RIgC5r4TJ0hCGOzxHszSR6",
    "socials": {
      "linkedin": "https://www.linkedin.com/in/tessamero/",
      "twitter": "https://twitter.com/TessaMero",
      "bluesky": "https://bsky.app/profile/tessamero.bsky.social"
    }
  },
  {
    "id": "RIgC5r4TJ0hCGOzxHszSBr",
    "socials": {
      "github": "https://github.com/TGlide",
      "twitter": "https://twitter.com/thomasglopes",
      "bluesky": "https://bsky.app/profile/thomasglopes.com",
      "linkedin": "https://www.linkedin.com/in/thomas-gl/"
    }
  },
  {
    "id": "c04bf8ca-ecba-4ab9-9a6b-7e5002291277",
    "socials": {
      "github": "https://github.com/tomjohnson3",
      "linkedin": "https://www.linkedin.com/in/tomjohnson3/",
      "twitter": "https://x.com/tomjohnson3",
      "bluesky": "https://bsky.app/profile/multiplayer.app",
      "threads": "https://www.threads.net/@trymultiplayer"
    }
  },
  {
    "id": "RIgC5r4TJ0hCGOzxHszRrX",
    "socials": {
      "github": "https://github.com/timbenniks",
      "linkedin": "https://www.linkedin.com/in/timbenniks/",
      "twitter": "https://twitter.com/timbenniks",
      "bluesky": "https://bsky.app/profile/timbenniks.dev"
    }
  },
  {
    "id": "RIgC5r4TJ0hCGOzxHszRcI",
    "socials": {
      "github": "https://github.com/timneutkens",
      "linkedin": "https://www.linkedin.com/in/tim-neutkens-5a6733168/",
      "twitter": "https://twitter.com/timneutkens",
      "bluesky": "https://bsky.app/profile/timneutkens.bsky.social"
    }
  },
  {
    "id": "35aedae9-ff20-4ac0-8310-52b04fa3e444",
    "socials": {
      "twitter": "https://x.com/TobinSouth",
      "linkedin": "https://www.linkedin.com/in/tobinsouth/",
      "github": "https://github.com/tobinsouth",
      "bluesky": "https://bsky.app/profile/tobinsouth.com"
    }
  },
  {
    "id": "RIgC5r4TJ0hCGOzxHszRCt",
    "socials": {
      "github": "https://github.com/mojombo",
      "linkedin": "https://www.linkedin.com/in/mojombo/",
      "twitter": "https://twitter.com/mojombo",
      "bluesky": "https://bsky.app/profile/mojombo.bsky.social"
    }
  },
  {
    "id": "RIgC5r4TJ0hCGOzxHszPUC",
    "socials": {
      "github": "https://github.com/sulco",
      "linkedin": "https://www.linkedin.com/in/tsulkowski/",
      "twitter": "https://twitter.com/sulco",
      "bluesky": "https://bsky.app/profile/sulco.dev"
    }
  },
  {
    "id": "6a4a7c7c-a288-4acd-b980-8849c360b2df",
    "socials": {
      "linkedin": "https://www.linkedin.com/in/tylersuncrowe/"
    }
  },
  {
    "id": "RIgC5r4TJ0hCGOzxHszP4n",
    "socials": {
      "github": "https://github.com/tylermcginnis",
      "linkedin": "https://www.linkedin.com/in/tylermcginnis33/",
      "twitch": "https://www.twitch.tv/elpunish3rr/",
      "twitter": "https://twitter.com/tylermcginnis",
      "youtube": "https://www.youtube.com/acekyd",
      "bluesky": "https://bsky.app/profile/tyler.ui.dev"
    }
  },
  {
    "id": "RIgC5r4TJ0hCGOzxHszOfO",
    "socials": {
      "github": "https://github.com/Una",
      "twitter": "https://twitter.com/Una",
      "bluesky": "https://bsky.app/profile/una.im",
      "mastodon": "https://front-end.social/@una",
      "tiktok": "https://tiktok.com/@unacode",
      "linkedin": "https://www.linkedin.com/in/unakravets"
    }
  },
  {
    "id": "RIgC5r4TJ0hCGOzxHszN1m",
    "socials": {
      "facebook": "https://www.facebook.com/vagishvela/",
      "github": "https://github.com/vagishvela",
      "instagram": "https://www.instagram.com/vagish",
      "twitter": "https://twitter.com/vagish",
      "linkedin": "https://www.linkedin.com/in/vagish/",
      "mastodon": "https://ruby.social/@vagish",
      "bluesky": "https://bsky.app/profile/vagish.bsky.social",
      "threads": "https://www.threads.net/@vagish"
    }
  },
  {
    "id": "0d5cd71e-5b13-4dc2-8b7f-f1ce0a1ed5b1",
    "socials": {
      "github": "https://github.com/gewenyu99",
      "twitter": "https://x.com/WenYuGe1",
      "youtube": "https://www.youtube.com/@umamicomplex6841",
      "bluesky": "https://bsky.app/profile/gewenyu99.bsky.social"
    }
  },
  {
    "id": "RIgC5r4TJ0hCGOzxHszMhS",
    "socials": {
      "github": "https://github.com/subpic",
      "linkedin": "https://www.linkedin.com/in/vladhosu/",
      "bluesky": "https://bsky.app/profile/vlad.socialbee.com"
    }
  },
  {
    "id": "RIgC5r4TJ0hCGOzxHszMN8",
    "socials": {
      "github": "https://github.com/whummer/",
      "twitter": "https://twitter.com/w_hummer",
      "bluesky": "https://bsky.app/profile/whummer.bsky.social"
    }
  },
  {
    "id": "RIgC5r4TJ0hCGOzxHszM2o",
    "socials": {
      "github": "https://github.com/wesbos",
      "linkedin": "https://www.linkedin.com/in/wesbos/",
      "twitter": "https://twitter.com/wesbos",
      "mastodon": "https://tiktok.com/@wesbos",
      "instagram": "https://instagram.com/@wesbos",
      "bluesky": "https://bsky.app/profile/wesbos.com",
      "threads": "https://www.threads.net/@wesbos"
    }
  },
  {
    "id": "RIgC5r4TJ0hCGOzxHszLiU",
    "socials": {
      "github": "https://github.com/ghostdevv",
      "twitter": "https://twitter.com/onlyspaceghost",
      "bluesky": "https://bsky.app/profile/willow.sh",
      "mastodon": "https://fosstodon.org/@onlyspaceghost"
    }
  },
  {
    "id": "RIgC5r4TJ0hCGOzxHszLOA",
    "socials": {
      "github": "https://github.com/ZackDeRose",
      "linkedin": "https://www.linkedin.com/in/zackderose/",
      "twitter": "https://twitter.com/zackderose",
      "youtube": "https://www.youtube.com/c/ZackDeRoseDev",
      "bluesky": "https://bsky.app/profile/zackderose.bsky.social"
    }
  },
  {
    "id": "RIgC5r4TJ0hCGOzxHszL3q",
    "socials": {
      "linkedin": "https://www.linkedin.com/in/zo%C3%AB-wilson-45b8a7b7/",
      "bluesky": "https://bsky.app/profile/zoelwilson.bsky.social"
    }
  },
  {
    "id": "RIgC5r4TJ0hCGOzxHszoyH",
    "socials": {
      "github": "https://github.com/m4dz/",
      "linkedin": "https://www.linkedin.com/in/m4d-z/",
      "twitch": "https://www.twitch.tv/m4dz_devrel/",
      "twitter": "https://twitter.com/m4d_z",
      "bluesky": "https://bsky.app/profile/madz258.wetdry.world.ap.brid.gy"
    }
  },
  {
    "id": "RIgC5r4TJ0hCGOzxHszcvQ",
    "socials": {
      "github": "https://github.com/pngwn",
      "twitter": "https://twitter.com/evilpingwin",
      "bluesky": "https://bsky.app/profile/pngwn.at"
    }
  },
  {
    "id": "RIgC5r4TJ0hCGOzxHt4bCo",
    "socials": {
      "github": "https://github.com/asoglovo",
      "linkedin": "https://www.linkedin.com/in/angelsolaorbaiceta/?originalSubdomain=es"
    }
  }
];

async function main() {
  const mutations = [];
  for (const g of ENRICHED_GUESTS) {
    mutations.push({
      patch: {
        id: g.id,
        set: {
          socials: g.socials,
        },
        unset: ["socials.email", "portalToken", "portalTokenExpiresAt"],
      },
    });
    mutations.push({
      patch: {
        id: `drafts.${g.id}`,
        ifRevisionID: "non-existent-skip-if-missing",
      },
    });
  }

  const patchMutations = ENRICHED_GUESTS.map((g) => ({
    patch: {
      id: g.id,
      set: {
        socials: g.socials,
      },
      unset: ["socials.email", "portalToken", "portalTokenExpiresAt"],
    },
  }));

  const res = await fetch(
    `https://${projectId}.api.sanity.io/v2025-09-30/data/mutate/${dataset}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ mutations: patchMutations }),
    }
  );

  if (!res.ok) {
    const text = await res.text();
    console.error(`[sync-guest-socials] Failed (${res.status}): ${text}`);
    process.exit(1);
  }

  console.log(
    `✔ Synced public socials & scrubbed private fields for ${ENRICHED_GUESTS.length} guests in Sanity (${projectId}/${dataset})`
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
