#!/usr/bin/env node
/**
 * Syncs the 147 enriched guest social profiles (+256 newly discovered social links)
 * into Sanity (production & dev datasets).
 */
const PROJECT_ID = process.env.SANITY_STUDIO_PROJECT_ID || "hfh83o0w";
const DATASET = process.env.SANITY_STUDIO_DATASET || "production";
const TOKEN = process.env.SANITY_API_WRITE_TOKEN || process.env.SANITY_AUTH_TOKEN;

const PATCHES = [
  {
    "_id": "RIgC5r4TJ0hCGOzxHt52Uf",
    "title": "Adam Argyle",
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
    "_id": "RIgC5r4TJ0hCGOzxHt5Qpc",
    "title": "Adam Bradley",
    "socials": {
      "github": "https://github.com/adamdbradley",
      "twitter": "https://twitter.com/adamdbradley",
      "instagram": "https://www.instagram.com/figma",
      "bluesky": "https://bsky.app/profile/adambradley.bsky.social",
      "threads": "https://www.threads.net/@figma"
    }
  },
  {
    "_id": "RIgC5r4TJ0hCGOzxHt55CK",
    "title": "Adewale Abati",
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
    "_id": "RIgC5r4TJ0hCGOzxHt52AL",
    "title": "Alex Feldman",
    "socials": {
      "linkedin": "https://www.linkedin.com/in/alexanderfeldman/",
      "bluesky": "https://bsky.app/profile/hafeldman17.bsky.social"
    }
  },
  {
    "_id": "RIgC5r4TJ0hCGOzxHt50CP",
    "title": "Alex Gogan",
    "socials": {
      "github": "https://github.com/alx-andru",
      "twitter": "https://twitter.com/alexg0g",
      "linkedin": "https://www.linkedin.com/in/agogan/",
      "bluesky": "https://bsky.app/profile/alx-andru.bsky.social"
    }
  },
  {
    "_id": "RIgC5r4TJ0hCGOzxHt51q1",
    "title": "Alex Ruheni",
    "socials": {
      "github": "https://github.com/ruheni",
      "twitter": "https://twitter.com/ruheni_alex",
      "bluesky": "https://bsky.app/profile/ruheni.blue",
      "mastodon": "https://hachyderm.io/@ruheni"
    }
  },
  {
    "_id": "RIgC5r4TJ0hCGOzxHt4r1N",
    "title": "Alex Trost",
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
    "_id": "RIgC5r4TJ0hCGOzxHt4hvQ",
    "title": "Alexander Gallego",
    "socials": {
      "github": "https://github.com/emaxerrno",
      "twitter": "https://twitter.com/emaxerrno",
      "linkedin": "https://www.linkedin.com/in/alexandergallego/"
    }
  },
  {
    "_id": "RIgC5r4TJ0hCGOzxHt4lh8",
    "title": "Alexander Lichter",
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
    "_id": "RIgC5r4TJ0hCGOzxHt4lHj",
    "title": "Ali Spittel",
    "socials": {
      "github": "https://github.com/aspittel",
      "twitter": "https://twitter.com/ASpittel",
      "youtube": "https://www.youtube.com/alispitteldev",
      "bluesky": "https://bsky.app/profile/alispit.tel"
    }
  },
  {
    "_id": "RIgC5r4TJ0hCGOzxHt4cR1",
    "title": "Alyssa Nicoll",
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
    "_id": "RIgC5r4TJ0hCGOzxHt4eZ7",
    "title": "Amy Dutton",
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
    "_id": "4c91217a-f5f9-44ba-a22a-18af2329da3a",
    "title": "Andrea Wu",
    "socials": {
      "github": "http://github.com/andreaowu",
      "medium": "https://andreaowu.medium.com/",
      "linkedin": "https://www.linkedin.com/in/andreaowu"
    }
  },
  {
    "_id": "RIgC5r4TJ0hCGOzxHt4aYA",
    "title": "Ankita Kulkarni",
    "socials": {
      "linkedin": "https://www.linkedin.com/in/kulkarniankita/",
      "twitter": "https://twitter.com/kulkarniankita9",
      "youtube": "https://www.youtube.com/channel/UCbklMsA4tFtq4DEf1dyViQw",
      "bluesky": "https://bsky.app/profile/kulkarniankita.com"
    }
  },
  {
    "_id": "RIgC5r4TJ0hCGOzxHt4YfJ",
    "title": "Anthony Campolo",
    "socials": {
      "github": "https://github.com/ajcwebdev",
      "twitter": "https://twitter.com/ajcwebdev",
      "youtube": "https://youtube.com/@ajcwebdev",
      "linkedin": "https://www.linkedin.com/in/ajcwebdev"
    }
  },
  {
    "_id": "RIgC5r4TJ0hCGOzxHt4Yzd",
    "title": "Anuradha Kumari",
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
    "_id": "RIgC5r4TJ0hCGOzxHt4BTU",
    "title": "April Wensel",
    "socials": {
      "github": "https://github.com/aprilw",
      "twitter": "https://twitter.com/aprilwensel",
      "linkedin": "https://linkedin.com/in/aprilwensel",
      "mastodon": "https://mastodon.social/@aprilwensel",
      "bluesky": "https://bsky.app/profile/aprilwensel.com"
    }
  },
  {
    "_id": "2795b7e9-0450-410d-942c-7f21f2ecbce8",
    "title": "Balki Kodarapu",
    "socials": {
      "linkedin": "https://www.linkedin.com/in/balkikodarapu/"
    }
  },
  {
    "_id": "RIgC5r4TJ0hCGOzxHt3yr4",
    "title": "BekahHW",
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
    "_id": "RIgC5r4TJ0hCGOzxHt48CG",
    "title": "Ben Hong",
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
    "_id": "RIgC5r4TJ0hCGOzxHt3zBO",
    "title": "Ben Myers",
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
    "_id": "RIgC5r4TJ0hCGOzxHt3ybp",
    "title": "Brad Frost",
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
    "_id": "RIgC5r4TJ0hCGOzxHt4XlQ",
    "title": "Brad Garropy",
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
    "_id": "RIgC5r4TJ0hCGOzxHt3yMa",
    "title": "Braden Sidoti",
    "socials": {
      "linkedin": "https://www.linkedin.com/in/braden-sidoti-25676537/",
      "twitter": "https://twitter.com/bsinthewild",
      "bluesky": "https://bsky.app/profile/bs14.bsky.social"
    }
  },
  {
    "_id": "RIgC5r4TJ0hCGOzxHt3fqM",
    "title": "Brandon Roberts",
    "socials": {
      "github": "https://github.com/brandonroberts",
      "twitter": "https://twitter.com/brandontroberts",
      "youtube": "https://www.youtube.com/@BrandonRobertsDev",
      "linkedin": "https://www.linkedin.com/in/brandontroberts/",
      "bluesky": "https://bsky.app/profile/brandonroberts.dev"
    }
  },
  {
    "_id": "c14bf99a-2345-47d9-b3cb-81b6ed30bfe4",
    "title": "Brian Clark",
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
    "_id": "RIgC5r4TJ0hCGOzxHt3Mpe",
    "title": "Brian Douglas",
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
    "_id": "RIgC5r4TJ0hCGOzxHt3Lvl",
    "title": "Brian Li",
    "socials": {
      "github": "https://github.com/bwhli",
      "linkedin": "https://www.linkedin.com/in/bwhli/?originalSubdomain=jp",
      "twitter": "https://twitter.com/bwhli",
      "instagram": "https://instagram.com/bwhli",
      "threads": "https://www.threads.net/@bwhli"
    }
  },
  {
    "_id": "RIgC5r4TJ0hCGOzxHt3MG5",
    "title": "Brian Rinaldi",
    "socials": {
      "github": "https://github.com/remotesynth",
      "linkedin": "https://www.linkedin.com/in/brianrinaldi/",
      "twitter": "https://twitter.com/remotesynth",
      "mastodon": "https://mastodon.xyz/@remotesynth",
      "bluesky": "https://bsky.app/profile/remotesynthesis.com"
    }
  },
  {
    "_id": "RIgC5r4TJ0hCGOzxHt3MVK",
    "title": "Brittany Walker",
    "socials": {
      "github": "https://github.com/brittanyrw",
      "linkedin": "https://www.linkedin.com/in/brittanyrwalker/",
      "polywork": "https://www.polywork.com/musicalwebdev",
      "twitter": "https://twitter.com/musicalwebdev",
      "bluesky": "https://bsky.app/profile/musicalwebdev.bsky.social"
    }
  },
  {
    "_id": "9ea0a439-2219-455b-97a2-4c21559ce8e5",
    "title": "Brittney Postma (Guest)",
    "socials": {
      "twitter": "https://x.com/BrittneyPostma",
      "bluesky": "https://bsky.app/profile/brittneypostma.bsky.social",
      "github": "https://github.com/brittneypostma",
      "linkedin": "https://www.linkedin.com/in/brittneypostma/",
      "youtube": "https://www.youtube.com/@BrittneyPostma"
    }
  },
  {
    "_id": "RIgC5r4TJ0hCGOzxHt31Rb",
    "title": "Bryan Robinson",
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
    "_id": "RIgC5r4TJ0hCGOzxHt25LQ",
    "title": "Cassidy Williams",
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
    "_id": "RIgC5r4TJ0hCGOzxHt2aeE",
    "title": "Chris Biscardi",
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
    "_id": "6cd2fb87-5431-424c-a0cc-267f6890f4ba",
    "title": "Chris Ferdinandi",
    "socials": {
      "linkedin": "https://www.linkedin.com/in/cferdinandi/",
      "mastodon": "https://mastodon.social/@cferdinandi",
      "bluesky": "https://bsky.app/profile/cferdinandi.bsky.social"
    }
  },
  {
    "_id": "5cb367ce-a218-4c3d-8614-a64e188a08c1",
    "title": "Chris Sev",
    "socials": {
      "github": "https://github.com/chris-sev",
      "linkedin": "https://www.linkedin.com/in/chrissev",
      "twitter": "https://twitter.com/chris__sev",
      "youtube": "https://www.youtube.com/c/ChrisSev",
      "bluesky": "https://bsky.app/profile/chrissev.bsky.social"
    }
  },
  {
    "_id": "RIgC5r4TJ0hCGOzxHt1ll9",
    "title": "Chris Swithinbank",
    "socials": {
      "github": "https://github.com/delucis/",
      "mastodon": "https://m.webtoo.ls/@swithinbank",
      "twitter": "https://twitter.com/swithinbank",
      "bluesky": "https://bsky.app/profile/chrisswithin.bsky.social"
    }
  },
  {
    "_id": "RIgC5r4TJ0hCGOzxHt1Hvn",
    "title": "Christopher Burns",
    "socials": {
      "github": "https://github.com/burnedchris",
      "linkedin": "https://www.linkedin.com/in/burnedchris/",
      "twitch": "https://www.twitch.tv/burnedchris",
      "twitter": "https://twitter.com/burnedchris",
      "bluesky": "https://bsky.app/profile/inth.com"
    }
  },
  {
    "_id": "RIgC5r4TJ0hCGOzxHt0IdT",
    "title": "Clark Sell",
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
    "_id": "RIgC5r4TJ0hCGOzxHt0UgK",
    "title": "Colby Fayock",
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
    "_id": "8c1a2a76-b615-430b-96d8-0f80097dc370",
    "title": "Corbin Crutchley",
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
    "_id": "RIgC5r4TJ0hCGOzxHt0IJ9",
    "title": "Daniel Ribbens",
    "socials": {
      "github": "https://github.com/DanRibbens",
      "linkedin": "https://www.linkedin.com/in/danribbens/",
      "twitter": "https://twitter.com/DanielRibbens",
      "instagram": "https://www.instagram.com/payloadcms/",
      "threads": "https://www.threads.net/@payloadcms"
    }
  },
  {
    "_id": "RIgC5r4TJ0hCGOzxHt0Hyp",
    "title": "Daniel Roe",
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
    "_id": "RIgC5r4TJ0hCGOzxHt0HeV",
    "title": "Debbie O'Brien",
    "socials": {
      "github": "https://github.com/debs-obrien",
      "linkedin": "https://www.linkedin.com/in/debbie-o-brien-1a199975/",
      "twitter": "https://twitter.com/debs_obrien",
      "youtube": "https://www.youtube.com/c/DebbieOBrien",
      "bluesky": "https://bsky.app/profile/debbie.codes"
    }
  },
  {
    "_id": "RIgC5r4TJ0hCGOzxHt0HPG",
    "title": "Domitrius Clark",
    "socials": {
      "github": "https://github.com/domitriusclark",
      "twitch": "https://twitch.com/domitriusclark",
      "twitter": "https://twitter.com/domitriusclark",
      "linkedin": "https://www.linkedin.com/in/domitriusclark/",
      "bluesky": "https://bsky.app/profile/domitriusclark.bsky.social"
    }
  },
  {
    "_id": "RIgC5r4TJ0hCGOzxHt0GB3",
    "title": "Dov Alperin",
    "socials": {
      "github": "https://github.com/DAlperin",
      "twitter": "https://twitter.com/dovunderscore",
      "mastodon": "https://mastodon.social/@dov",
      "linkedin": "https://www.linkedin.com/in/dov-alperin"
    }
  },
  {
    "_id": "RIgC5r4TJ0hCGOzxHt0Gkc",
    "title": "Eduardo San Martin Morote",
    "socials": {
      "github": "https://github.com/posva",
      "mastodon": "https://m.webtoo.ls/@posva",
      "twitter": "https://twitter.com/posva",
      "bluesky": "https://bsky.app/profile/esm.dev"
    }
  },
  {
    "_id": "RIgC5r4TJ0hCGOzxHt0GQI",
    "title": "Ekene Eze (Kenny)",
    "socials": {
      "github": "https://github.com/kenny-io",
      "twitter": "https://twitter.com/kenny_io",
      "youtube": "https://www.youtube.com/c/EkeneEze",
      "linkedin": "https://www.linkedin.com/in/ekeneeze/"
    }
  },
  {
    "_id": "RIgC5r4TJ0hCGOzxHt0F70",
    "title": "Elizabeth Wilson",
    "socials": {
      "linkedin": "https://www.linkedin.com/in/elizabethtrumanwilson/",
      "twitter": "https://twitter.com/TruWil",
      "bluesky": "https://bsky.app/profile/wilsones13.bsky.social"
    }
  },
  {
    "_id": "RIgC5r4TJ0hCGOzxHt0FbU",
    "title": "Emma Twersky",
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
    "_id": "RIgC5r4TJ0hCGOzxHt0Erl",
    "title": "Eric Simons",
    "socials": {
      "github": "https://github.com/EricSimons",
      "linkedin": "https://www.linkedin.com/in/eric-simons-a464a664/",
      "twitter": "https://twitter.com/ericsimons40",
      "bluesky": "https://bsky.app/profile/esft.bsky.social"
    }
  },
  {
    "_id": "RIgC5r4TJ0hCGOzxHt0CKG",
    "title": "Erik Hanchett",
    "socials": {
      "github": "https://github.com/ErikCH",
      "twitter": "https://twitter.com/ErikCH",
      "youtube": "https://www.youtube.com/c/programwitherik",
      "bluesky": "https://bsky.app/profile/erikch.bsky.social"
    }
  },
  {
    "_id": "RIgC5r4TJ0hCGOzxHt0EcW",
    "title": "Facundo Giuliani",
    "socials": {
      "github": "https://github.com/fgiuliani",
      "linkedin": "https://www.linkedin.com/in/facundogiuliani/",
      "twitter": "https://twitter.com/facundozurdo",
      "bluesky": "https://bsky.app/profile/fgiuliani.bsky.social"
    }
  },
  {
    "_id": "RIgC5r4TJ0hCGOzxHt0BLI",
    "title": "Grayson Hicks",
    "socials": {
      "github": "https://github.com/graysonhicks",
      "twitter": "https://twitter.com/graysonhicks",
      "instagram": "https://instagram.com/jgraysonhicks",
      "threads": "https://www.threads.net/@jgraysonhicks"
    }
  },
  {
    "_id": "RIgC5r4TJ0hCGOzxHt0B63",
    "title": "Greg Whitworth",
    "socials": {
      "github": "https://github.com/gregwhitworth",
      "twitter": "https://twitter.com/gregwhitworth",
      "linkedin": "https://www.linkedin.com/in/gregwhitworth/",
      "bluesky": "https://bsky.app/profile/gregwhitworth.bsky.social"
    }
  },
  {
    "_id": "RIgC5r4TJ0hCGOzxHt0BaX",
    "title": "Guillermo Rauch",
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
    "_id": "RIgC5r4TJ0hCGOzxHt0Aqo",
    "title": "Heather Buchel",
    "socials": {
      "linkedin": "https://www.linkedin.com/in/heather-buchel-92bb5b64/",
      "mastodon": "https://hachyderm.io/@hbuchel",
      "twitter": "https://twitter.com/hbuchel",
      "bluesky": "https://bsky.app/profile/heather-buchel.com"
    }
  },
  {
    "_id": "RIgC5r4TJ0hCGOzxHt0AbZ",
    "title": "Houssein Djirdeh",
    "socials": {
      "twitter": "https://twitter.com/hdjirdeh",
      "bluesky": "https://bsky.app/profile/houssein.bsky.social"
    }
  },
  {
    "_id": "RIgC5r4TJ0hCGOzxHt0AHF",
    "title": "Jake Rosenberg",
    "socials": {
      "twitter": "https://twitter.com/jakob_rosenberg",
      "bluesky": "https://bsky.app/profile/jakerosenberg.bsky.social"
    }
  },
  {
    "_id": "RIgC5r4TJ0hCGOzxHt09XW",
    "title": "James Perkins",
    "socials": {
      "github": "https://github.com/perkinsjr/",
      "twitter": "https://twitter.com/james_r_perkins",
      "youtube": "https://www.youtube.com/@james-perkins",
      "bluesky": "https://bsky.app/profile/jamesperkins.bsky.social"
    }
  },
  {
    "_id": "RIgC5r4TJ0hCGOzxHt09ml",
    "title": "James Q Quick",
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
    "_id": "RIgC5r4TJ0hCGOzxHt08OO",
    "title": "James Vidler",
    "socials": {
      "github": "https://github.com/jamesvidler",
      "linkedin": "https://www.linkedin.com/in/jameskvidler/",
      "twitter": "https://twitter.com/jameskvidler",
      "bluesky": "https://bsky.app/profile/fownhopeboy.bsky.social"
    }
  },
  {
    "_id": "RIgC5r4TJ0hCGOzxHt07tu",
    "title": "Jason Lengstorf",
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
    "_id": "RIgC5r4TJ0hCGOzxHt07AB",
    "title": "Jenn Junod",
    "socials": {
      "linkedin": "https://www.linkedin.com/in/jennjunod/",
      "twitch": "https://www.twitch.tv/jennjunod",
      "twitter": "https://twitter.com/jennjunod",
      "youtube": "https://www.youtube.com/channel/UCOYqYy7ebj5j63TbdGB-Lcg",
      "bluesky": "https://bsky.app/profile/jennjunod.bsky.social"
    }
  },
  {
    "_id": "RIgC5r4TJ0hCGOzxHt06QS",
    "title": "Jesse Hall",
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
    "_id": "RIgC5r4TJ0hCGOzxHt06fh",
    "title": "Jochum (wolfen)",
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
    "_id": "9a8d9256-114c-479d-af51-7fc9176b7abf",
    "title": "Joe Casabona",
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
    "_id": "RIgC5r4TJ0hCGOzxHt06uw",
    "title": "Joel Varty",
    "socials": {
      "linkedin": "https://www.linkedin.com/in/joelvarty",
      "twitter": "https://twitter.com/joelvarty",
      "bluesky": "https://bsky.app/profile/joelvarty.com"
    }
  },
  {
    "_id": "RIgC5r4TJ0hCGOzxHt06BD",
    "title": "Jon Meyers",
    "socials": {
      "github": "https://github.com/dijonmusters",
      "twitter": "https://twitter.com/jonmeyers_io",
      "youtube": "https://youtube.com/supabase",
      "bluesky": "https://bsky.app/profile/jonmeyers.io"
    }
  },
  {
    "_id": "dc5819bf-2835-40e2-8f94-73d6b6518329",
    "title": "Jonathan Wilke",
    "socials": {
      "github": "https://github.com/jonathanwilke",
      "linkedin": "https://www.linkedin.com/in/jonathan-wilke-766a83b8/",
      "twitter": "https://x.com/jonathan_wilke",
      "bluesky": "https://bsky.app/profile/jonathanwilke.bsky.social"
    }
  },
  {
    "_id": "RIgC5r4TJ0hCGOzxHt05vy",
    "title": "Jordan Powell",
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
    "_id": "RIgC5r4TJ0hCGOzxHt04x0",
    "title": "Juan Andrés",
    "socials": {
      "github": "https://github.com/juanwmedia",
      "twitter": "https://twitter.com/juanwmedia",
      "linkedin": "https://www.linkedin.com/in/juanwmedia/",
      "youtube": "https://www.youtube.com/@juanwmedia",
      "bluesky": "https://bsky.app/profile/juanandreses.bsky.social"
    }
  },
  {
    "_id": "RIgC5r4TJ0hCGOzxHt05CF",
    "title": "Juri Strumpflohner",
    "socials": {
      "github": "https://github.com/juristr",
      "twitter": "https://twitter.com/juristr",
      "bluesky": "https://bsky.app/profile/juri.dev",
      "linkedin": "https://linkedin.com/in/juristr/",
      "youtube": "https://youtube.com/@juristr"
    }
  },
  {
    "_id": "RIgC5r4TJ0hCGOzxHt04IM",
    "title": "Justin Duke",
    "socials": {
      "github": "https://github.com/jmduke",
      "twitter": "https://twitter.com/jmduke",
      "bluesky": "https://bsky.app/profile/jmduke.com"
    }
  },
  {
    "_id": "RIgC5r4TJ0hCGOzxHt04hl",
    "title": "Justin Schwartzenberger",
    "socials": {
      "github": "https://github.com/jschwarty",
      "linkedin": "https://www.linkedin.com/in/justinschwartzenberger/",
      "stackoverflow": "https://stackoverflow.com/users/349596/justin-schwartzenberger",
      "twitter": "https://twitter.com/schwarty",
      "bluesky": "https://bsky.app/profile/schwarty.com"
    }
  },
  {
    "_id": "RIgC5r4TJ0hCGOzxHt0437",
    "title": "Katerina Skroumpelou",
    "socials": {
      "github": "https://github.com/mandarini",
      "linkedin": "https://www.linkedin.com/in/katerinaskroumpelou/",
      "medium": "https://pakotinia.medium.com/",
      "twitter": "https://twitter.com/psybercity",
      "bluesky": "https://bsky.app/profile/psyber.city"
    }
  },
  {
    "_id": "RIgC5r4TJ0hCGOzxHt0349",
    "title": "Kathryn Grayson",
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
    "_id": "RIgC5r4TJ0hCGOzxHt02ou",
    "title": "Kellen Mace",
    "socials": {
      "github": "https://github.com/kellenmace",
      "linkedin": "https://www.linkedin.com/in/kellenmace/",
      "twitter": "https://twitter.com/kellenmace",
      "bluesky": "https://bsky.app/profile/kellenmace.bsky.social"
    }
  },
  {
    "_id": "RIgC5r4TJ0hCGOzxHt025B",
    "title": "Kelly Vaughn",
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
    "_id": "RIgC5r4TJ0hCGOzxHt02KQ",
    "title": "Kent C. Dodds",
    "socials": {
      "github": "https://github.com/kentcdodds",
      "twitter": "https://twitter.com/kentcdodds",
      "youtube": "https://www.youtube.com/@kentcdodds-vids",
      "bluesky": "https://bsky.app/profile/kentcdodds.com"
    }
  },
  {
    "_id": "RIgC5r4TJ0hCGOzxHt01pw",
    "title": "Knut Melvaer",
    "socials": {
      "github": "https://github.com/kmelve",
      "linkedin": "https://www.linkedin.com/in/knutmelvaer/",
      "twitter": "https://twitter.com/kmelve",
      "bluesky": "https://bsky.app/profile/knut.fyi"
    }
  },
  {
    "_id": "RIgC5r4TJ0hCGOzxHt02Zf",
    "title": "Lane Wagner",
    "socials": {
      "github": "https://github.com/wagslane",
      "linkedin": "https://www.linkedin.com/in/wagslane/",
      "twitter": "https://twitter.com/wagslane",
      "bluesky": "https://bsky.app/profile/wagslane.bsky.social"
    }
  },
  {
    "_id": "RIgC5r4TJ0hCGOzxHt01ah",
    "title": "Lauren Lee",
    "socials": {
      "github": "https://github.com/laurenelee",
      "linkedin": "https://www.linkedin.com/in/dev-lauren-lee/",
      "twitter": "https://twitter.com/LoLoCoding",
      "youtube": "https://www.youtube.com/channel/UCAXRntzYPySoBGSZJClcRlg",
      "bluesky": "https://bsky.app/profile/laurenlee.bsky.social"
    }
  },
  {
    "_id": "RIgC5r4TJ0hCGOzxHt01LS",
    "title": "Laurie Barth",
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
    "_id": "RIgC5r4TJ0hCGOzxHszy9J",
    "title": "Lee Briggs",
    "socials": {
      "github": "https://github.com/jaxxstorm",
      "linkedin": "https://www.linkedin.com/in/briggsl/",
      "twitter": "https://twitter.com/briggsl",
      "bluesky": "https://bsky.app/profile/brig.gs"
    }
  },
  {
    "_id": "RIgC5r4TJ0hCGOzxHszyTd",
    "title": "Lee Robinson",
    "socials": {
      "github": "https://github.com/leerob",
      "linkedin": "https://www.linkedin.com/in/leeerob/",
      "twitter": "https://twitter.com/leeerob",
      "youtube": "https://www.youtube.com/@leerob",
      "bluesky": "https://bsky.app/profile/leerobinson.bsky.social"
    }
  },
  {
    "_id": "740e85e5-0635-4a59-9426-714467259091",
    "title": "Luca Forstner",
    "socials": {
      "github": "https://github.com/lforst",
      "linkedin": "https://www.linkedin.com/in/luca-forstner-10807a231/",
      "twitter": "https://x.com/LucaForstner",
      "bluesky": "https://bsky.app/profile/handle.invalid"
    }
  },
  {
    "_id": "RIgC5r4TJ0hCGOzxHszpSl",
    "title": "Lukas (spydon) Klingsbro",
    "socials": {
      "github": "https://github.com/spydon",
      "linkedin": "https://www.linkedin.com/in/spydon/",
      "twitter": "https://twitter.com/spyd0n",
      "mastodon": "https://fosstodon.org/@spydon",
      "bluesky": "https://bsky.app/profile/spydon.dev"
    }
  },
  {
    "_id": "RIgC5r4TJ0hCGOzxHszoj2",
    "title": "Matthew Phillips",
    "socials": {
      "github": "https://github.com/matthewp",
      "twitter": "https://twitter.com/matthewcp",
      "bluesky": "https://bsky.app/profile/spooky.click"
    }
  },
  {
    "_id": "91c2331d-0fa1-4905-8bfe-8f5b78f00c64",
    "title": "Max Gerber",
    "socials": {
      "github": "https://github.com/maxwellgerber",
      "linkedin": "https://www.linkedin.com/in/maxwellgerber/",
      "bluesky": "https://bsky.app/profile/maxgerber.bsky.social"
    }
  },
  {
    "_id": "RIgC5r4TJ0hCGOzxHszoTn",
    "title": "Max Howell",
    "socials": {
      "github": "https://github.com/mxcl",
      "twitter": "https://twitter.com/mxcl",
      "linkedin": "https://www.linkedin.com/in/mxcl"
    }
  },
  {
    "_id": "RIgC5r4TJ0hCGOzxHszoEY",
    "title": "Maya Shavin",
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
    "_id": "RIgC5r4TJ0hCGOzxHsznzJ",
    "title": "Michael Chan",
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
    "_id": "RIgC5r4TJ0hCGOzxHsznk4",
    "title": "Michael Dowden",
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
    "_id": "RIgC5r4TJ0hCGOzxHsznUp",
    "title": "Mike Hartington",
    "socials": {
      "github": "https://github.com/mhartington",
      "linkedin": "https://www.linkedin.com/in/mike-hartington-63638362/",
      "twitter": "https://twitter.com/mhartington",
      "bluesky": "http://bsky.app/profile/mhartington.io"
    }
  },
  {
    "_id": "RIgC5r4TJ0hCGOzxHszn0L",
    "title": "Miško Hevery",
    "socials": {
      "github": "https://github.com/mhevery",
      "twitter": "https://twitter.com/mhevery",
      "bluesky": "https://bsky.app/profile/misko.dev"
    }
  },
  {
    "_id": "162bab87-d65d-4c20-b625-6ee593ebaa45",
    "title": "Muhammad Ahsan Ayaz",
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
    "_id": "RIgC5r4TJ0hCGOzxHsznFa",
    "title": "Nader Dabit",
    "socials": {
      "github": "https://github.com/dabit3",
      "linkedin": "https://www.linkedin.com/in/naderdabit/",
      "twitter": "https://twitter.com/dabit3",
      "youtube": "https://www.youtube.com/naderdabit",
      "bluesky": "https://bsky.app/profile/dabit3.bsky.social"
    }
  },
  {
    "_id": "RIgC5r4TJ0hCGOzxHszml6",
    "title": "Nick DeJesus",
    "socials": {
      "github": "https://github.com/Dayhaysoos",
      "twitter": "https://twitter.com/dayhaysoos",
      "bluesky": "https://bsky.app/profile/dayhaysoos.bsky.social"
    }
  },
  {
    "_id": "RIgC5r4TJ0hCGOzxHszeyR",
    "title": "Nick Hodges",
    "socials": {
      "github": "https://github.com/nickhodges",
      "linkedin": "https://www.linkedin.com/in/nickhodges/",
      "medium": "https://nickhodges.medium.com/",
      "twitter": "https://twitter.com/nickhodges",
      "bluesky": "https://bsky.app/profile/nickhodges.bsky.social"
    }
  },
  {
    "_id": "f3ff8de1-9b48-4768-898e-a84cb2efb228",
    "title": "Nick Taylor",
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
    "_id": "RIgC5r4TJ0hCGOzxHsziAa",
    "title": "Omed Habib",
    "socials": {
      "github": "https://github.com/omedhabib",
      "instagram": "https://www.instagram.com/omed.habib",
      "linkedin": "https://www.linkedin.com/in/omed/",
      "twitter": "https://twitter.com/omedhabib",
      "threads": "https://www.threads.net/@omed.habib"
    }
  },
  {
    "_id": "RIgC5r4TJ0hCGOzxHsze4Y",
    "title": "Paolo Ricciuti",
    "socials": {
      "github": "https://github.com/paoloricciuti",
      "twitter": "https://twitter.com/PaoloRicciuti",
      "bluesky": "https://bsky.app/profile/paolo.ricciuti.me"
    }
  },
  {
    "_id": "RIgC5r4TJ0hCGOzxHszdUz",
    "title": "Patrick Martin",
    "socials": {
      "github": "https://github.com/patm1987",
      "linkedin": "https://www.linkedin.com/in/patrick-martin-268a85a/",
      "medium": "https://medium.com/@pux0r3",
      "twitter": "https://twitter.com/pux0r3",
      "bluesky": "https://bsky.app/profile/pcnmartin.bsky.social"
    }
  },
  {
    "_id": "RIgC5r4TJ0hCGOzxHszdkE",
    "title": "Pedro Duarte",
    "socials": {
      "github": "https://github.com/peduarte",
      "linkedin": "https://www.linkedin.com/in/peduarteltd/?originalSubdomain=es",
      "twitter": "https://twitter.com/peduarte",
      "bluesky": "https://bsky.app/profile/ped.ro"
    }
  },
  {
    "_id": "RIgC5r4TJ0hCGOzxHszcgB",
    "title": "Prince Wilson",
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
    "_id": "RIgC5r4TJ0hCGOzxHszcBh",
    "title": "Randal Schwartz",
    "socials": {
      "linkedin": "https://www.linkedin.com/in/randalschwartz/",
      "twitter": "https://twitter.com/RandalSchwartz",
      "bluesky": "https://bsky.app/profile/randalschwartz.bsky.social"
    }
  },
  {
    "_id": "RIgC5r4TJ0hCGOzxHszbwS",
    "title": "Renan",
    "socials": {
      "github": "https://github.com/renancaraujo",
      "linkedin": "https://www.linkedin.com/in/renancaraujo/",
      "twitter": "https://twitter.com/reNotANumber",
      "mastodon": "https://fluttercommunity.social/@renan",
      "bluesky": "https://bsky.app/profile/renanminx.bsky.social"
    }
  },
  {
    "_id": "RIgC5r4TJ0hCGOzxHszbRy",
    "title": "René Brandel",
    "socials": {
      "github": "https://github.com/renebrandel",
      "linkedin": "https://www.linkedin.com/in/renebrandel/",
      "twitter": "https://twitter.com/renebrandel",
      "bluesky": "https://bsky.app/profile/renebrandel.bsky.social"
    }
  },
  {
    "_id": "RIgC5r4TJ0hCGOzxHszbhD",
    "title": "Rich Harris",
    "socials": {
      "github": "https://github.com/Rich-Harris",
      "linkedin": "https://www.linkedin.com/in/rich-harris/",
      "twitter": "https://twitter.com/rich_harris",
      "bluesky": "https://bsky.app/profile/rich-harris.dev"
    }
  },
  {
    "_id": "RIgC5r4TJ0hCGOzxHszaNv",
    "title": "Rob Sutter",
    "socials": {
      "linkedin": "https://www.linkedin.com/in/robsutter/",
      "twitter": "https://twitter.com/rts_rob",
      "bluesky": "https://bsky.app/profile/robsutter.dev"
    }
  },
  {
    "_id": "9fc9b65d-cfa3-4407-9f94-be7eb8cd32be",
    "title": "Roman Jaquez",
    "socials": {
      "github": "https://github.com/romanejaquez",
      "twitter": "https://twitter.com/drcoderz",
      "bluesky": "https://bsky.app/profile/romanjaquez.bsky.social"
    }
  },
  {
    "_id": "RIgC5r4TJ0hCGOzxHszaiF",
    "title": "Ryan Carniato",
    "socials": {
      "devto": "https://dev.to/ryansolid",
      "github": "https://github.com/ryansolid",
      "twitter": "https://twitter.com/RyanCarniato",
      "bluesky": "https://bsky.app/profile/ryansolid.bsky.social"
    }
  },
  {
    "_id": "RIgC5r4TJ0hCGOzxHszYkJ",
    "title": "Salma Alam-Naylor",
    "socials": {
      "github": "https://github.com/whitep4nth3r",
      "linkedin": "https://www.linkedin.com/in/whitep4nth3r/?originalSubdomain=uk",
      "twitch": "https://www.twitch.tv/whitep4nth3r",
      "twitter": "https://twitter.com/whitep4nth3r",
      "bluesky": "https://bsky.app/profile/whitep4nth3r.com"
    }
  },
  {
    "_id": "RIgC5r4TJ0hCGOzxHszVnP",
    "title": "Sam Bhagwat",
    "socials": {
      "github": "https://github.com/calcsam",
      "linkedin": "https://www.linkedin.com/in/sambhagwat/",
      "twitter": "https://twitter.com/calcsam",
      "bluesky": "https://bsky.app/profile/calcsam.bsky.social"
    }
  },
  {
    "_id": "RIgC5r4TJ0hCGOzxHszVT5",
    "title": "Sam Littlefair",
    "socials": {
      "github": "https://github.com/samlfair",
      "linkedin": "https://www.linkedin.com/in/samlittlefair/?originalSubdomain=ca",
      "twitter": "https://twitter.com/samlfair",
      "bluesky": "https://bsky.app/profile/littlefair.ca"
    }
  },
  {
    "_id": "ad09a6a8-84e1-49ea-b5ab-18e2bb1247b8",
    "title": "Saron Yitbarek",
    "socials": {
      "twitter": "https://twitter.com/saronyitbarek",
      "bluesky": "https://bsky.app/profile/saron.bsky.social"
    }
  },
  {
    "_id": "0ccc6e7b-24b9-4e13-87dc-ca95d86c2298",
    "title": "Scott Rees",
    "socials": {
      "linkedin": "https://www.linkedin.com/in/scott-rees-3800a814/",
      "mastodon": "https://hachyderm.io/@hbuchel",
      "twitter": "https://x.com/reesscot?lang=en",
      "bluesky": "https://bsky.app/profile/scott-rees.bsky.social"
    }
  },
  {
    "_id": "RIgC5r4TJ0hCGOzxHszUyb",
    "title": "Scott Spence",
    "socials": {
      "github": "https://github.com/spences10",
      "twitter": "https://twitter.com/spences10",
      "bluesky": "https://bsky.app/profile/scottspence.dev"
    }
  },
  {
    "_id": "RIgC5r4TJ0hCGOzxHszcQw",
    "title": "Scott Tolinski",
    "socials": {
      "github": "https://github.com/stolinski",
      "linkedin": "https://www.linkedin.com/in/stolinski/",
      "twitter": "https://twitter.com/stolinski",
      "youtube": "https://www.youtube.com/c/leveluptuts",
      "bluesky": "https://bsky.app/profile/tolin.ski"
    }
  },
  {
    "_id": "RIgC5r4TJ0hCGOzxHszUjM",
    "title": "Sean Falconer",
    "socials": {
      "github": "https://github.com/thefalc",
      "linkedin": "https://www.linkedin.com/in/seanf/",
      "twitter": "https://twitter.com/seanfalconer",
      "bluesky": "https://bsky.app/profile/seanfalconer.bsky.social"
    }
  },
  {
    "_id": "RIgC5r4TJ0hCGOzxHszUU7",
    "title": "Shai Reznik",
    "socials": {
      "github": "https://github.com/shairez",
      "twitter": "https://twitter.com/shai_reznik",
      "youtube": "https://www.youtube.com/user/hirezio",
      "bluesky": "https://bsky.app/profile/shairez.bsky.social"
    }
  },
  {
    "_id": "RIgC5r4TJ0hCGOzxHszUEs",
    "title": "Shivay Lamba",
    "socials": {
      "github": "https://github.com/shivaylamba",
      "mastodon": "https://mastodon.social/@shivaylamba",
      "twitter": "https://twitter.com/howdevelop",
      "bluesky": "https://bsky.app/profile/shivaylamba.bsky.social"
    }
  },
  {
    "_id": "RIgC5r4TJ0hCGOzxHszTkO",
    "title": "Simon Grimm",
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
    "_id": "RIgC5r4TJ0hCGOzxHszTV9",
    "title": "Stefan Kingham",
    "socials": {
      "twitter": "https://twitter.com/stefankingham",
      "bluesky": "https://bsky.app/profile/stefankingham.bsky.social"
    }
  },
  {
    "_id": "RIgC5r4TJ0hCGOzxHszTAp",
    "title": "Steve Sewell",
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
    "_id": "RIgC5r4TJ0hCGOzxHszSgL",
    "title": "Taylor Desseyn",
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
    "_id": "RIgC5r4TJ0hCGOzxHszSR6",
    "title": "Tessa Mero",
    "socials": {
      "linkedin": "https://www.linkedin.com/in/tessamero/",
      "twitter": "https://twitter.com/TessaMero",
      "bluesky": "https://bsky.app/profile/tessamero.bsky.social"
    }
  },
  {
    "_id": "RIgC5r4TJ0hCGOzxHszSBr",
    "title": "Thomas G. Lopes",
    "socials": {
      "github": "https://github.com/TGlide",
      "twitter": "https://twitter.com/thomasglopes",
      "bluesky": "https://bsky.app/profile/thomasglopes.com",
      "linkedin": "https://www.linkedin.com/in/thomas-gl/"
    }
  },
  {
    "_id": "c04bf8ca-ecba-4ab9-9a6b-7e5002291277",
    "title": "Thomas Johnson",
    "socials": {
      "github": "https://github.com/tomjohnson3",
      "linkedin": "https://www.linkedin.com/in/tomjohnson3/",
      "twitter": "https://x.com/tomjohnson3",
      "bluesky": "https://bsky.app/profile/multiplayer.app",
      "threads": "https://www.threads.net/@trymultiplayer"
    }
  },
  {
    "_id": "RIgC5r4TJ0hCGOzxHszRrX",
    "title": "Tim Benniks",
    "socials": {
      "github": "https://github.com/timbenniks",
      "linkedin": "https://www.linkedin.com/in/timbenniks/",
      "twitter": "https://twitter.com/timbenniks",
      "bluesky": "https://bsky.app/profile/timbenniks.dev"
    }
  },
  {
    "_id": "RIgC5r4TJ0hCGOzxHszRcI",
    "title": "Tim Neutkens",
    "socials": {
      "github": "https://github.com/timneutkens",
      "linkedin": "https://www.linkedin.com/in/tim-neutkens-5a6733168/",
      "twitter": "https://twitter.com/timneutkens",
      "bluesky": "https://bsky.app/profile/timneutkens.bsky.social"
    }
  },
  {
    "_id": "35aedae9-ff20-4ac0-8310-52b04fa3e444",
    "title": "Tobin South",
    "socials": {
      "twitter": "https://x.com/TobinSouth",
      "linkedin": "https://www.linkedin.com/in/tobinsouth/",
      "github": "https://github.com/tobinsouth",
      "bluesky": "https://bsky.app/profile/tobinsouth.com"
    }
  },
  {
    "_id": "RIgC5r4TJ0hCGOzxHszRCt",
    "title": "Tom Preston-Werner",
    "socials": {
      "github": "https://github.com/mojombo",
      "linkedin": "https://www.linkedin.com/in/mojombo/",
      "twitter": "https://twitter.com/mojombo",
      "bluesky": "https://bsky.app/profile/mojombo.bsky.social"
    }
  },
  {
    "_id": "RIgC5r4TJ0hCGOzxHszPUC",
    "title": "Tomek Sułkowski",
    "socials": {
      "github": "https://github.com/sulco",
      "linkedin": "https://www.linkedin.com/in/tsulkowski/",
      "twitter": "https://twitter.com/sulco",
      "bluesky": "https://bsky.app/profile/sulco.dev"
    }
  },
  {
    "_id": "RIgC5r4TJ0hCGOzxHszP4n",
    "title": "Tyler McGinnis",
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
    "_id": "RIgC5r4TJ0hCGOzxHszOfO",
    "title": "Una Kravets",
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
    "_id": "RIgC5r4TJ0hCGOzxHszN1m",
    "title": "Vagish Vela",
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
    "_id": "0d5cd71e-5b13-4dc2-8b7f-f1ce0a1ed5b1",
    "title": "Vincent (Wen Yu) Ge",
    "socials": {
      "github": "https://github.com/gewenyu99",
      "twitter": "https://x.com/WenYuGe1",
      "youtube": "https://www.youtube.com/@umamicomplex6841",
      "bluesky": "https://bsky.app/profile/gewenyu99.bsky.social"
    }
  },
  {
    "_id": "RIgC5r4TJ0hCGOzxHszMhS",
    "title": "Vlad Hosu",
    "socials": {
      "github": "https://github.com/subpic",
      "linkedin": "https://www.linkedin.com/in/vladhosu/",
      "bluesky": "https://bsky.app/profile/vlad.socialbee.com"
    }
  },
  {
    "_id": "RIgC5r4TJ0hCGOzxHszMN8",
    "title": "Waldemar Hummer",
    "socials": {
      "github": "https://github.com/whummer/",
      "twitter": "https://twitter.com/w_hummer",
      "bluesky": "https://bsky.app/profile/whummer.bsky.social"
    }
  },
  {
    "_id": "RIgC5r4TJ0hCGOzxHszM2o",
    "title": "Wes Bos",
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
    "_id": "RIgC5r4TJ0hCGOzxHszLiU",
    "title": "Willow (GHOST)",
    "socials": {
      "github": "https://github.com/ghostdevv",
      "twitter": "https://twitter.com/onlyspaceghost",
      "bluesky": "https://bsky.app/profile/willow.sh",
      "mastodon": "https://fosstodon.org/@onlyspaceghost"
    }
  },
  {
    "_id": "RIgC5r4TJ0hCGOzxHszLOA",
    "title": "Zack DeRose",
    "socials": {
      "github": "https://github.com/ZackDeRose",
      "linkedin": "https://www.linkedin.com/in/zackderose/",
      "twitter": "https://twitter.com/zackderose",
      "youtube": "https://www.youtube.com/c/ZackDeRoseDev",
      "bluesky": "https://bsky.app/profile/zackderose.bsky.social"
    }
  },
  {
    "_id": "RIgC5r4TJ0hCGOzxHszL3q",
    "title": "Zoë Wilson",
    "socials": {
      "linkedin": "https://www.linkedin.com/in/zo%C3%AB-wilson-45b8a7b7/",
      "bluesky": "https://bsky.app/profile/zoelwilson.bsky.social"
    }
  },
  {
    "_id": "RIgC5r4TJ0hCGOzxHszoyH",
    "title": "m4dz",
    "socials": {
      "github": "https://github.com/m4dz/",
      "linkedin": "https://www.linkedin.com/in/m4d-z/",
      "twitch": "https://www.twitch.tv/m4dz_devrel/",
      "twitter": "https://twitter.com/m4d_z",
      "bluesky": "https://bsky.app/profile/madz258.wetdry.world.ap.brid.gy"
    }
  },
  {
    "_id": "RIgC5r4TJ0hCGOzxHszcvQ",
    "title": "pngwn",
    "socials": {
      "github": "https://github.com/pngwn",
      "twitter": "https://twitter.com/evilpingwin",
      "bluesky": "https://bsky.app/profile/pngwn.at"
    }
  }
];

async function main() {
  if (!TOKEN) {
    console.log("[sync-guest-socials] No SANITY token set, skipping.");
    return;
  }
  const mutations = PATCHES.map((p) => ({
    patch: {
      id: p._id,
      set: {
        socials: p.socials,
      },
    },
  }));

  const res = await fetch(`https://${PROJECT_ID}.api.sanity.io/v2025-09-30/data/mutate/${DATASET}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${TOKEN}`,
    },
    body: JSON.stringify({ mutations }),
  });
  if (!res.ok) {
    const text = await res.text();
    console.warn(`[sync-guest-socials] HTTP ${res.status}: ${text}`);
    return;
  }
  console.log(`✔ Synced enriched socials for ${PATCHES.length} guests into Sanity (${PROJECT_ID}/${DATASET})`);
}

main().catch((err) => console.error(err));
