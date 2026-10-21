#!/usr/bin/env node
/**
 * Syncs all 186 enriched guest profiles (+256 social links, 141 resolved emails,
 * and 30-day expiring portalTokens) into Sanity (production & dev datasets).
 */
const PROJECT_ID = process.env.SANITY_STUDIO_PROJECT_ID || "hfh83o0w";
const DATASET = process.env.SANITY_STUDIO_DATASET || "production";
const TOKEN = process.env.SANITY_API_WRITE_TOKEN || process.env.SANITY_AUTH_TOKEN;

const PATCHES = [
  {
    "_id": "RIgC5r4TJ0hCGOzxHt5W4m",
    "title": "Aaron Frost",
    "socials": {
      "github": "https://github.com/aaronfrost",
      "twitter": "https://twitter.com/aaronfrost",
      "email": "aaronfrost@gmail.com"
    },
    "portalToken": "eyJpZCI6IlJJZ0M1cjRUSjBoQ0dPenhIdDVXNG0iLCJzbHVnIjoiYWFyb24tZnJvc3QiLCJleHAiOjE3OTUxOTM5MDA4ODN9.cmQUiDdYx6El5W-XqbpdT4ZF",
    "portalTokenExpiresAt": "2026-11-20T16:58:20.883Z"
  },
  {
    "_id": "RIgC5r4TJ0hCGOzxHt52Uf",
    "title": "Adam Argyle",
    "socials": {
      "github": "https://github.com/argyleink",
      "twitter": "https://twitter.com/argyleink",
      "youtube": "https://www.youtube.com/c/AdamArgyleInk",
      "mastodon": "https://front-end.social/@argyleink",
      "bluesky": "https://bsky.app/profile/nerdy.dev",
      "linkedin": "https://www.linkedin.com/in/adamargyle",
      "email": "atom@argyleink.com"
    },
    "portalToken": "eyJpZCI6IlJJZ0M1cjRUSjBoQ0dPenhIdDUyVWYiLCJzbHVnIjoiYWRhbS1hcmd5bGUiLCJleHAiOjE3OTUxOTM5MDA4ODN9.I-SDfNGmTtTWaNX7Ul0XkV_A",
    "portalTokenExpiresAt": "2026-11-20T16:58:20.883Z"
  },
  {
    "_id": "RIgC5r4TJ0hCGOzxHt5Qpc",
    "title": "Adam Bradley",
    "socials": {
      "github": "https://github.com/adamdbradley",
      "twitter": "https://twitter.com/adamdbradley",
      "instagram": "https://www.instagram.com/figma",
      "bluesky": "https://bsky.app/profile/adambradley.bsky.social",
      "threads": "https://www.threads.net/@figma",
      "email": "adam@builder.io"
    },
    "portalToken": "eyJpZCI6IlJJZ0M1cjRUSjBoQ0dPenhIdDVRcGMiLCJzbHVnIjoiYWRhbS1icmFkbGV5IiwiZXhwIjoxNzk1MTkzOTAwODgzfQ.1-Xc7K6R600OGu-nC89FoL8a",
    "portalTokenExpiresAt": "2026-11-20T16:58:20.883Z"
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
      "threads": "https://www.threads.net/@acekydtv",
      "email": "acekyd01@gmail.com"
    },
    "portalToken": "eyJpZCI6IlJJZ0M1cjRUSjBoQ0dPenhIdDU1Q0siLCJzbHVnIjoiYWNlLWt5ZCIsImV4cCI6MTc5NTE5MzkwMDg4M30.5urPUy7122b2KyXIm8hfOZV7",
    "portalTokenExpiresAt": "2026-11-20T16:58:20.883Z"
  },
  {
    "_id": "RIgC5r4TJ0hCGOzxHt52AL",
    "title": "Alex Feldman",
    "socials": {
      "linkedin": "https://www.linkedin.com/in/alexanderfeldman/",
      "bluesky": "https://bsky.app/profile/hafeldman17.bsky.social",
      "email": "alex@ajonp.com"
    },
    "portalToken": "eyJpZCI6IlJJZ0M1cjRUSjBoQ0dPenhIdDUyQUwiLCJzbHVnIjoiYWxleC1mZWxkbWFuIiwiZXhwIjoxNzk1MTkzOTAwODgzfQ._tjszbFcyxgtUETk41dhmuoB",
    "portalTokenExpiresAt": "2026-11-20T16:58:20.883Z"
  },
  {
    "_id": "RIgC5r4TJ0hCGOzxHt50CP",
    "title": "Alex Gogan",
    "socials": {
      "github": "https://github.com/alx-andru",
      "twitter": "https://twitter.com/alexg0g",
      "linkedin": "https://www.linkedin.com/in/agogan/",
      "bluesky": "https://bsky.app/profile/alx-andru.bsky.social",
      "email": "alex@joinsherpa.com"
    },
    "portalToken": "eyJpZCI6IlJJZ0M1cjRUSjBoQ0dPenhIdDUwQ1AiLCJzbHVnIjoiYWxleC1nb2dhbiIsImV4cCI6MTc5NTE5MzkwMDg4M30.SHosMz4YrKuGEi-rnoFi6PaX",
    "portalTokenExpiresAt": "2026-11-20T16:58:20.883Z"
  },
  {
    "_id": "RIgC5r4TJ0hCGOzxHt4w1I",
    "title": "Alex Jover Morales",
    "socials": {
      "github": "https://github.com/alexjoverm",
      "linkedin": "https://www.linkedin.com/in/alex-jover-morales-994752102/",
      "twitter": "https://twitter.com/alexjoverm",
      "email": "alexjovermorales@gmail.com"
    },
    "portalToken": "eyJpZCI6IlJJZ0M1cjRUSjBoQ0dPenhIdDR3MUkiLCJzbHVnIjoiYWxleC1qb3Zlci1tb3JhbGVzIiwiZXhwIjoxNzk1MTkzOTAwODgzfQ.Kl67c-5_A6vp6Q9kxawb5AhU",
    "portalTokenExpiresAt": "2026-11-20T16:58:20.883Z"
  },
  {
    "_id": "RIgC5r4TJ0hCGOzxHt51q1",
    "title": "Alex Ruheni",
    "socials": {
      "github": "https://github.com/ruheni",
      "twitter": "https://twitter.com/ruheni_alex",
      "bluesky": "https://bsky.app/profile/ruheni.blue",
      "mastodon": "https://hachyderm.io/@ruheni",
      "email": "ruheni@prisma.io"
    },
    "portalToken": "eyJpZCI6IlJJZ0M1cjRUSjBoQ0dPenhIdDUxcTEiLCJzbHVnIjoiYWxleC1ydWhlbmkiLCJleHAiOjE3OTUxOTM5MDA4ODN9.S45aI-X5or9pZOKtAa7lqHEO",
    "portalTokenExpiresAt": "2026-11-20T16:58:20.883Z"
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
    },
    "portalToken": "eyJpZCI6IlJJZ0M1cjRUSjBoQ0dPenhIdDRyMU4iLCJzbHVnIjoiYWxleC10cm9zdCIsImV4cCI6MTc5NTE5MzkwMDg4M30.YAhrP8KvtbiCoIGFnNLZdkfa",
    "portalTokenExpiresAt": "2026-11-20T16:58:20.883Z"
  },
  {
    "_id": "RIgC5r4TJ0hCGOzxHt4hvQ",
    "title": "Alexander Gallego",
    "socials": {
      "github": "https://github.com/emaxerrno",
      "twitter": "https://twitter.com/emaxerrno",
      "linkedin": "https://www.linkedin.com/in/alexandergallego/"
    },
    "portalToken": "eyJpZCI6IlJJZ0M1cjRUSjBoQ0dPenhIdDRodlEiLCJzbHVnIjoiYWxleGFuZGVyLWdhbGxlZ28iLCJleHAiOjE3OTUxOTM5MDA4ODN9.zUC3OFm-Sc3oDhkOG9K9ba3e",
    "portalTokenExpiresAt": "2026-11-20T16:58:20.883Z"
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
      "bluesky": "https://bsky.app/profile/thealexlichter.com",
      "email": "notify@twitter.com"
    },
    "portalToken": "eyJpZCI6IlJJZ0M1cjRUSjBoQ0dPenhIdDRsaDgiLCJzbHVnIjoiYWxleGFuZGVyLWxpY2h0ZXIiLCJleHAiOjE3OTUxOTM5MDA4ODN9.mGQN1b1dbSGp9yDXGaqmXoBw",
    "portalTokenExpiresAt": "2026-11-20T16:58:20.883Z"
  },
  {
    "_id": "RIgC5r4TJ0hCGOzxHt4lHj",
    "title": "Ali Spittel",
    "socials": {
      "github": "https://github.com/aspittel",
      "twitter": "https://twitter.com/ASpittel",
      "youtube": "https://www.youtube.com/alispitteldev",
      "bluesky": "https://bsky.app/profile/alispit.tel"
    },
    "portalToken": "eyJpZCI6IlJJZ0M1cjRUSjBoQ0dPenhIdDRsSGoiLCJzbHVnIjoiYWxpLXNwaXR0ZWwiLCJleHAiOjE3OTUxOTM5MDA4ODN9.ZbD8u7_2llohmqxdgSq6o13A",
    "portalTokenExpiresAt": "2026-11-20T16:58:20.883Z"
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
      "mastodon": "https://www.youtube.com/@AngularAirPodcast",
      "email": "mail@alyssanicoll.com"
    },
    "portalToken": "eyJpZCI6IlJJZ0M1cjRUSjBoQ0dPenhIdDRjUjEiLCJzbHVnIjoiYWx5c3NhLW5pY29sbCIsImV4cCI6MTc5NTE5MzkwMDg4M30.kr3ro8_HVLWv16ujnahiKYeC",
    "portalTokenExpiresAt": "2026-11-20T16:58:20.883Z"
  },
  {
    "_id": "b5d8b34a-0ff3-417a-9fe7-73659931d9c6",
    "title": "Amanda Cavallaro",
    "socials": {
      "github": "https://github.com/amdcavallaro",
      "linkedin": "https://www.linkedin.com/in/amandacavallaro/",
      "twitter": "https://twitter.com/amdcavallaro",
      "email": "amdcaruso@gmail.com"
    },
    "portalToken": "eyJpZCI6ImI1ZDhiMzRhLTBmZjMtNDE3YS05ZmU3LTczNjU5OTMxZDljNiIsInNsdWciOiJhbWFuZGEtY2F2YWxsYXJvIiwiZXhwIjoxNzk1MTkzOTAwODgzfQ.iEu5NmWExF-zi5CumWcSPTTF",
    "portalTokenExpiresAt": "2026-11-20T16:58:20.883Z"
  },
  {
    "_id": "RIgC5r4TJ0hCGOzxHt4bhI",
    "title": "Amanda Giannelli",
    "socials": {
      "github": "https://github.com/agiannelli",
      "twitter": "https://twitter.com/GiannelliTech"
    },
    "portalToken": "eyJpZCI6IlJJZ0M1cjRUSjBoQ0dPenhIdDRiaEkiLCJzbHVnIjoiYW1hbmRhLWdpYW5uZWxsaSIsImV4cCI6MTc5NTE5MzkwMDg4M30.JwtfMU4duJOe9_lluBJJZD0v",
    "portalTokenExpiresAt": "2026-11-20T16:58:20.883Z"
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
      "threads": "https://www.threads.net/@selfteachme",
      "email": "amy@compressed.fm"
    },
    "portalToken": "eyJpZCI6IlJJZ0M1cjRUSjBoQ0dPenhIdDRlWjciLCJzbHVnIjoiYW15LWR1dHRvbiIsImV4cCI6MTc5NTE5MzkwMDg4M30.bzxcwy0z8gcEwzI-sgSLOwyL",
    "portalTokenExpiresAt": "2026-11-20T16:58:20.883Z"
  },
  {
    "_id": "4c91217a-f5f9-44ba-a22a-18af2329da3a",
    "title": "Andrea Wu",
    "socials": {
      "github": "http://github.com/andreaowu",
      "medium": "https://andreaowu.medium.com/",
      "linkedin": "https://www.linkedin.com/in/andreaowu"
    },
    "portalToken": "eyJpZCI6IjRjOTEyMTdhLWY1ZjktNDRiYS1hMjJhLTE4YWYyMzI5ZGEzYSIsInNsdWciOiJhbmRyZWEtd3UiLCJleHAiOjE3OTUxOTM5MDA4ODN9.A8QFXwNekfZYY08EyIWDhIfK",
    "portalTokenExpiresAt": "2026-11-20T16:58:20.883Z"
  },
  {
    "_id": "RIgC5r4TJ0hCGOzxHt4aYA",
    "title": "Ankita Kulkarni",
    "socials": {
      "linkedin": "https://www.linkedin.com/in/kulkarniankita/",
      "twitter": "https://twitter.com/kulkarniankita9",
      "youtube": "https://www.youtube.com/channel/UCbklMsA4tFtq4DEf1dyViQw",
      "bluesky": "https://bsky.app/profile/kulkarniankita.com",
      "email": "me@kulkarniankita.com"
    },
    "portalToken": "eyJpZCI6IlJJZ0M1cjRUSjBoQ0dPenhIdDRhWUEiLCJzbHVnIjoiYW5raXRhLWt1bGthcm5pIiwiZXhwIjoxNzk1MTkzOTAwODgzfQ.jIbd-zLsixL3jJxsr_PQ3mx6",
    "portalTokenExpiresAt": "2026-11-20T16:58:20.883Z"
  },
  {
    "_id": "RIgC5r4TJ0hCGOzxHt4YfJ",
    "title": "Anthony Campolo",
    "socials": {
      "github": "https://github.com/ajcwebdev",
      "twitter": "https://twitter.com/ajcwebdev",
      "youtube": "https://youtube.com/@ajcwebdev",
      "linkedin": "https://www.linkedin.com/in/ajcwebdev"
    },
    "portalToken": "eyJpZCI6IlJJZ0M1cjRUSjBoQ0dPenhIdDRZZkoiLCJzbHVnIjoiYW50aG9ueS1jYW1wb2xvIiwiZXhwIjoxNzk1MTkzOTAwODgzfQ.sAKtI1r_hab0uUWYHGWE4ahe",
    "portalTokenExpiresAt": "2026-11-20T16:58:20.883Z"
  },
  {
    "_id": "RIgC5r4TJ0hCGOzxHt4ZjM",
    "title": "Antonio Lo Fiego",
    "socials": {
      "github": "https://github.com/antoniolofiego",
      "linkedin": "https://www.linkedin.com/in/antoniolofiego/",
      "twitter": "https://twitter.com/antonio_lofiego",
      "email": "alofiego@hey.com"
    },
    "portalToken": "eyJpZCI6IlJJZ0M1cjRUSjBoQ0dPenhIdDRaak0iLCJzbHVnIjoiYW50b25pby1sby1maWVnbyIsImV4cCI6MTc5NTE5MzkwMDg4M30.IBX-Z6Phdedt-N_ISQVjG6C-",
    "portalTokenExpiresAt": "2026-11-20T16:58:20.883Z"
  },
  {
    "_id": "RIgC5r4TJ0hCGOzxHt4Y5k",
    "title": "Antonio Sarcevic",
    "socials": {
      "github": "https://github.com/SarcevicAntonio",
      "linkedin": "https://www.linkedin.com/in/sarcevic/",
      "twitter": "https://twitter.com/SarcevicAntonio"
    },
    "portalToken": "eyJpZCI6IlJJZ0M1cjRUSjBoQ0dPenhIdDRZNWsiLCJzbHVnIjoiYW50b25pby1zYXJjZXZpYyIsImV4cCI6MTc5NTE5MzkwMDg4M30.YgSHFwkRM4z_HD6SFtv8gplZ",
    "portalTokenExpiresAt": "2026-11-20T16:58:20.883Z"
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
      "threads": "https://www.threads.net/@anuradha_404",
      "email": "contact@anuradhakumari.com"
    },
    "portalToken": "eyJpZCI6IlJJZ0M1cjRUSjBoQ0dPenhIdDRZemQiLCJzbHVnIjoiYW51cmFkaGEta3VtYXJpIiwiZXhwIjoxNzk1MTkzOTAwODgzfQ.3Z40EHN9XZonZErg3EEe2PcX",
    "portalTokenExpiresAt": "2026-11-20T16:58:20.883Z"
  },
  {
    "_id": "RIgC5r4TJ0hCGOzxHt4BTU",
    "title": "April Wensel",
    "socials": {
      "github": "https://github.com/aprilw",
      "twitter": "https://twitter.com/aprilwensel",
      "linkedin": "https://linkedin.com/in/aprilwensel",
      "mastodon": "https://mastodon.social/@aprilwensel",
      "bluesky": "https://bsky.app/profile/aprilwensel.com",
      "email": "april@compassionatecoding.com"
    },
    "portalToken": "eyJpZCI6IlJJZ0M1cjRUSjBoQ0dPenhIdDRCVFUiLCJzbHVnIjoiYXByaWwtd2Vuc2VsIiwiZXhwIjoxNzk1MTkzOTAwODgzfQ.N-KZ9SIltC-tc2qgJuim95hm",
    "portalTokenExpiresAt": "2026-11-20T16:58:20.883Z"
  },
  {
    "_id": "2795b7e9-0450-410d-942c-7f21f2ecbce8",
    "title": "Balki Kodarapu",
    "socials": {
      "linkedin": "https://www.linkedin.com/in/balkikodarapu/",
      "email": "balki.kodarapu@gmail.com"
    },
    "portalToken": "eyJpZCI6IjI3OTViN2U5LTA0NTAtNDEwZC05NDJjLTdmMjFmMmVjYmNlOCIsInNsdWciOiJiYWxraS1rb2RhcmFwdSIsImV4cCI6MTc5NTE5MzkwMDg4M30._VA_08soDks0wSbjO9VZJHs0",
    "portalTokenExpiresAt": "2026-11-20T16:58:20.883Z"
  },
  {
    "_id": "RIgC5r4TJ0hCGOzxHt4XR6",
    "title": "Batuhan Ozdemir",
    "socials": {
      "github": "https://github.com/BatuhanW",
      "twitter": "https://twitter.com/kakamelatte",
      "email": "batuhanwilhelm@gmail.com"
    },
    "portalToken": "eyJpZCI6IlJJZ0M1cjRUSjBoQ0dPenhIdDRYUjYiLCJzbHVnIjoiYmF0dWhhbi1vemRlbWlyIiwiZXhwIjoxNzk1MTkzOTAwODgzfQ.JczVFDRH570wbzPB3uAfdGUz",
    "portalTokenExpiresAt": "2026-11-20T16:58:20.883Z"
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
    },
    "portalToken": "eyJpZCI6IlJJZ0M1cjRUSjBoQ0dPenhIdDN5cjQiLCJzbHVnIjoiYmVrYWgtaGF3cm90LXdlaWdlbCIsImV4cCI6MTc5NTE5MzkwMDg4M30.e_RyTvZmz7qPTTDyqwrUJwUG",
    "portalTokenExpiresAt": "2026-11-20T16:58:20.883Z"
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
      "threads": "https://www.threads.net/@bencodezen",
      "email": "ben@bencodezen.io"
    },
    "portalToken": "eyJpZCI6IlJJZ0M1cjRUSjBoQ0dPenhIdDQ4Q0ciLCJzbHVnIjoiYmVuLWhvbmciLCJleHAiOjE3OTUxOTM5MDA4ODN9.ZFHoWR-QD1lrEaTE3qc4bL9b",
    "portalTokenExpiresAt": "2026-11-20T16:58:20.883Z"
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
      "bluesky": "https://bsky.app/profile/benmyers.dev",
      "email": "ben@benmyers.dev"
    },
    "portalToken": "eyJpZCI6IlJJZ0M1cjRUSjBoQ0dPenhIdDN6Qk8iLCJzbHVnIjoiYmVuLW15ZXJzIiwiZXhwIjoxNzk1MTkzOTAwODgzfQ.afqLHGTuOvZOOGVFdxMebjbh",
    "portalTokenExpiresAt": "2026-11-20T16:58:20.883Z"
  },
  {
    "_id": "97a6824d-8fc4-4385-9966-a27497f131cb",
    "title": "Benjamin Bressington",
    "socials": {
      "facebook": "https://www.facebook.com/automateboring",
      "linkedin": "https://www.linkedin.com/company/automateboring",
      "youtube": "https://www.youtube.com/@theAutomateBoring"
    },
    "portalToken": "eyJpZCI6Ijk3YTY4MjRkLThmYzQtNDM4NS05OTY2LWEyNzQ5N2YxMzFjYiIsInNsdWciOiJiZW5qYW1pbi1icmVzc2luZ3RvbiIsImV4cCI6MTc5NTE5MzkwMDg4M30._I59EvkktpGcg6wHOOlfMnr4",
    "portalTokenExpiresAt": "2026-11-20T16:58:20.883Z"
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
      "threads": "https://www.threads.net/@brad_frost",
      "email": "brad@bradfrost.com"
    },
    "portalToken": "eyJpZCI6IlJJZ0M1cjRUSjBoQ0dPenhIdDN5YnAiLCJzbHVnIjoiYnJhZC1mcm9zdCIsImV4cCI6MTc5NTE5MzkwMDg4M30.m1o6BKuJEfDl04jmgXub-JAH",
    "portalTokenExpiresAt": "2026-11-20T16:58:20.883Z"
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
      "threads": "https://www.threads.net/@bradgarropy",
      "email": "bradgarropy@gmail.com"
    },
    "portalToken": "eyJpZCI6IlJJZ0M1cjRUSjBoQ0dPenhIdDRYbFEiLCJzbHVnIjoiYnJhZC1nYXJyb3B5IiwiZXhwIjoxNzk1MTkzOTAwODgzfQ.aXJ29c3BhOShLmYAfrOQBOoq",
    "portalTokenExpiresAt": "2026-11-20T16:58:20.883Z"
  },
  {
    "_id": "RIgC5r4TJ0hCGOzxHt3yMa",
    "title": "Braden Sidoti",
    "socials": {
      "linkedin": "https://www.linkedin.com/in/braden-sidoti-25676537/",
      "twitter": "https://twitter.com/bsinthewild",
      "bluesky": "https://bsky.app/profile/bs14.bsky.social",
      "email": "braden@clerk.dev"
    },
    "portalToken": "eyJpZCI6IlJJZ0M1cjRUSjBoQ0dPenhIdDN5TWEiLCJzbHVnIjoiYnJhZGVuLXNpZG90aSIsImV4cCI6MTc5NTE5MzkwMDg4M30.qc7mvTo-QrmK_Q5RNHXiZFdp",
    "portalTokenExpiresAt": "2026-11-20T16:58:20.883Z"
  },
  {
    "_id": "RIgC5r4TJ0hCGOzxHt3g5b",
    "title": "Brandon Bayer",
    "socials": {
      "github": "https://github.com/flybayer",
      "twitter": "https://twitter.com/flybayer",
      "email": "b@bayer.ws"
    },
    "portalToken": "eyJpZCI6IlJJZ0M1cjRUSjBoQ0dPenhIdDNnNWIiLCJzbHVnIjoiYnJhbmRvbi1iYXllciIsImV4cCI6MTc5NTE5MzkwMDg4M30.ZQxqxKVc-H8ct3LN0eM9xVSa",
    "portalTokenExpiresAt": "2026-11-20T16:58:20.883Z"
  },
  {
    "_id": "RIgC5r4TJ0hCGOzxHt3fqM",
    "title": "Brandon Roberts",
    "socials": {
      "github": "https://github.com/brandonroberts",
      "twitter": "https://twitter.com/brandontroberts",
      "youtube": "https://www.youtube.com/@BrandonRobertsDev",
      "linkedin": "https://www.linkedin.com/in/brandontroberts/",
      "bluesky": "https://bsky.app/profile/brandonroberts.dev",
      "email": "robertsbt@gmail.com"
    },
    "portalToken": "eyJpZCI6IlJJZ0M1cjRUSjBoQ0dPenhIdDNmcU0iLCJzbHVnIjoiYnJhbmRvbi1yb2JlcnRzIiwiZXhwIjoxNzk1MTkzOTAwODgzfQ.gDW0qM9boX3kR9hghy7tSKJA",
    "portalTokenExpiresAt": "2026-11-20T16:58:20.883Z"
  },
  {
    "_id": "RIgC5r4TJ0hCGOzxHt3pGd",
    "title": "Brett Fitzgerald",
    "socials": {
      "linkedin": "https://www.linkedin.com/in/brettgfitzgerald/"
    },
    "portalToken": "eyJpZCI6IlJJZ0M1cjRUSjBoQ0dPenhIdDNwR2QiLCJzbHVnIjoiYnJldHQtZml0emdlcmFsZCIsImV4cCI6MTc5NTE5MzkwMDg4M30.LK5uJMECJi3BTrC_H9-y4oJv",
    "portalTokenExpiresAt": "2026-11-20T16:58:20.883Z"
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
      "threads": "https://www.threads.net/@_clarkio",
      "email": "brian.clark@snyk.io"
    },
    "portalToken": "eyJpZCI6ImMxNGJmOTlhLTIzNDUtNDdkOS1iM2NiLTgxYjZlZDMwYmZlNCIsInNsdWciOiJicmlhbi1jbGFyayIsImV4cCI6MTc5NTE5MzkwMDg4M30.wriAkIZdXjOgu01JzYfNUSa6",
    "portalTokenExpiresAt": "2026-11-20T16:58:20.883Z"
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
      "threads": "https://www.threads.net/@bdougieyo",
      "email": "brian.rinaldi@localstack.cloud"
    },
    "portalToken": "eyJpZCI6IlJJZ0M1cjRUSjBoQ0dPenhIdDNNcGUiLCJzbHVnIjoiYnJpYW4tZG91Z2xhcyIsImV4cCI6MTc5NTE5MzkwMDg4M30.Y6j1tsukDq5pHmkgqkKUHKtP",
    "portalTokenExpiresAt": "2026-11-20T16:58:20.883Z"
  },
  {
    "_id": "RIgC5r4TJ0hCGOzxHt3Lvl",
    "title": "Brian Li",
    "socials": {
      "github": "https://github.com/bwhli",
      "linkedin": "https://www.linkedin.com/in/bwhli/?originalSubdomain=jp",
      "twitter": "https://twitter.com/bwhli",
      "instagram": "https://instagram.com/bwhli",
      "threads": "https://www.threads.net/@bwhli",
      "email": "brianli@kinsta.com"
    },
    "portalToken": "eyJpZCI6IlJJZ0M1cjRUSjBoQ0dPenhIdDNMdmwiLCJzbHVnIjoiYnJpYW4tbGkiLCJleHAiOjE3OTUxOTM5MDA4ODN9.0kBTI1o6GUS5NG9A4PTPzu7n",
    "portalTokenExpiresAt": "2026-11-20T16:58:20.883Z"
  },
  {
    "_id": "RIgC5r4TJ0hCGOzxHt3MG5",
    "title": "Brian Rinaldi",
    "socials": {
      "github": "https://github.com/remotesynth",
      "linkedin": "https://www.linkedin.com/in/brianrinaldi/",
      "twitter": "https://twitter.com/remotesynth",
      "mastodon": "https://mastodon.xyz/@remotesynth",
      "bluesky": "https://bsky.app/profile/remotesynthesis.com",
      "email": "brian.rinaldi@gmail.com"
    },
    "portalToken": "eyJpZCI6IlJJZ0M1cjRUSjBoQ0dPenhIdDNNRzUiLCJzbHVnIjoiYnJpYW4tcmluYWxkaSIsImV4cCI6MTc5NTE5MzkwMDg4M30.gie-NQ-Iny2zw0EJXEf4MEUt",
    "portalTokenExpiresAt": "2026-11-20T16:58:20.883Z"
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
    },
    "portalToken": "eyJpZCI6IlJJZ0M1cjRUSjBoQ0dPenhIdDNNVksiLCJzbHVnIjoiYnJpdHRhbnktd2Fsa2VyIiwiZXhwIjoxNzk1MTkzOTAwODgzfQ.E8IG7jGEjZN5TzNY8fVJ0Rh4",
    "portalTokenExpiresAt": "2026-11-20T16:58:20.883Z"
  },
  {
    "_id": "9ea0a439-2219-455b-97a2-4c21559ce8e5",
    "title": "Brittney Postma (Guest)",
    "socials": {
      "twitter": "https://x.com/BrittneyPostma",
      "bluesky": "https://bsky.app/profile/brittneypostma.bsky.social",
      "github": "https://github.com/brittneypostma",
      "linkedin": "https://www.linkedin.com/in/brittneypostma/",
      "youtube": "https://www.youtube.com/@BrittneyPostma",
      "email": "bdesignedwebdev@gmail.com"
    },
    "portalToken": "eyJpZCI6IjllYTBhNDM5LTIyMTktNDU1Yi05N2EyLTRjMjE1NTljZThlNSIsInNsdWciOiJicml0dG5leS1wb3N0bWEtZ3Vlc3QiLCJleHAiOjE3OTUxOTM5MDA4ODN9.yYihOMr4KskoINlWzIuvMY-M",
    "portalTokenExpiresAt": "2026-11-20T16:58:20.883Z"
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
      "linkedin": "https://linkedin.com/in/bryanlrobinson",
      "email": "bryanlrobinson@gmail.com"
    },
    "portalToken": "eyJpZCI6IlJJZ0M1cjRUSjBoQ0dPenhIdDMxUmIiLCJzbHVnIjoiYnJ5YW4tcm9iaW5zb24iLCJleHAiOjE3OTUxOTM5MDA4ODN9.OjxESCnJrhzPOkH0g5ORHBcF",
    "portalTokenExpiresAt": "2026-11-20T16:58:20.883Z"
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
    },
    "portalToken": "eyJpZCI6IlJJZ0M1cjRUSjBoQ0dPenhIdDI1TFEiLCJzbHVnIjoiY2Fzc2lkb28iLCJleHAiOjE3OTUxOTM5MDA4ODN9.cWjho4nN2VA729bJ4up03E4S",
    "portalTokenExpiresAt": "2026-11-20T16:58:20.883Z"
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
      "mastodon": "https://hachyderm.io/@chrisbiscardi",
      "email": "chris@christopherbiscardi.com"
    },
    "portalToken": "eyJpZCI6IlJJZ0M1cjRUSjBoQ0dPenhIdDJhZUUiLCJzbHVnIjoiY2hyaXMtYmlzY2FyZGkiLCJleHAiOjE3OTUxOTM5MDA4ODN9.VxO35l9liWJnddctPDLKIeT5",
    "portalTokenExpiresAt": "2026-11-20T16:58:20.883Z"
  },
  {
    "_id": "6cd2fb87-5431-424c-a0cc-267f6890f4ba",
    "title": "Chris Ferdinandi",
    "socials": {
      "linkedin": "https://www.linkedin.com/in/cferdinandi/",
      "mastodon": "https://mastodon.social/@cferdinandi",
      "bluesky": "https://bsky.app/profile/cferdinandi.bsky.social",
      "email": "chris@adhdftw.com"
    },
    "portalToken": "eyJpZCI6IjZjZDJmYjg3LTU0MzEtNDI0Yy1hMGNjLTI2N2Y2ODkwZjRiYSIsInNsdWciOiJjaHJpcy1mZXJkaW5hbmRpIiwiZXhwIjoxNzk1MTkzOTAwODgzfQ.aQdv57Z8NMQ18CCmmJOIyQy_",
    "portalTokenExpiresAt": "2026-11-20T16:58:20.883Z"
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
    },
    "portalToken": "eyJpZCI6IjVjYjM2N2NlLWEyMTgtNGMzZC04NjE0LWE2NGUxODhhMDhjMSIsInNsdWciOiJjaHJpcy1zZXYiLCJleHAiOjE3OTUxOTM5MDA4ODN9.CqcsZkx4_Oa-sWby1nSiTWQm",
    "portalTokenExpiresAt": "2026-11-20T16:58:20.883Z"
  },
  {
    "_id": "RIgC5r4TJ0hCGOzxHt1ll9",
    "title": "Chris Swithinbank",
    "socials": {
      "github": "https://github.com/delucis/",
      "mastodon": "https://m.webtoo.ls/@swithinbank",
      "twitter": "https://twitter.com/swithinbank",
      "bluesky": "https://bsky.app/profile/chrisswithin.bsky.social",
      "email": "swithinbank@gmail.com"
    },
    "portalToken": "eyJpZCI6IlJJZ0M1cjRUSjBoQ0dPenhIdDFsbDkiLCJzbHVnIjoiY2hyaXMtc3dpdGhpbmJhbmsiLCJleHAiOjE3OTUxOTM5MDA4ODN9._mDYVg7BjbLdsqFoVt7DpogN",
    "portalTokenExpiresAt": "2026-11-20T16:58:20.883Z"
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
    },
    "portalToken": "eyJpZCI6IlJJZ0M1cjRUSjBoQ0dPenhIdDFIdm4iLCJzbHVnIjoiY2hyaXN0b3BoZXItYnVybnMiLCJleHAiOjE3OTUxOTM5MDA4ODN9.CT03gumKCMgQAhFjzVYs23GL",
    "portalTokenExpiresAt": "2026-11-20T16:58:20.883Z"
  },
  {
    "_id": "RIgC5r4TJ0hCGOzxHt0uzD",
    "title": "Christy Ennis-Kloote",
    "socials": {
      "linkedin": "https://www.linkedin.com/in/enniskloote/",
      "medium": "https://enniskloote.medium.com/",
      "twitter": "https://twitter.com/EnnisKloote"
    },
    "portalToken": "eyJpZCI6IlJJZ0M1cjRUSjBoQ0dPenhIdDB1ekQiLCJzbHVnIjoiY2hyaXN0eS1lbm5pcy1rbG9vdGUiLCJleHAiOjE3OTUxOTM5MDA4ODN9.EkxlniorV9Jj6Oj45uYsMoBm",
    "portalTokenExpiresAt": "2026-11-20T16:58:20.883Z"
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
      "threads": "https://www.threads.net/@theClarkSell",
      "email": "hello@unspecified.io"
    },
    "portalToken": "eyJpZCI6IlJJZ0M1cjRUSjBoQ0dPenhIdDBJZFQiLCJzbHVnIjoiY2xhcmstc2VsbCIsImV4cCI6MTc5NTE5MzkwMDg4M30.zkKACgxGNjKLW1NvspvrE8KP",
    "portalTokenExpiresAt": "2026-11-20T16:58:20.883Z"
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
      "threads": "https://www.threads.net/@colbyfayock",
      "email": "colby.fayock@cloudinary.com"
    },
    "portalToken": "eyJpZCI6IlJJZ0M1cjRUSjBoQ0dPenhIdDBVZ0siLCJzbHVnIjoiY29sYnktZmF5b2NrIiwiZXhwIjoxNzk1MTkzOTAwODgzfQ.P8ihM3Rtr5TMSyUDO39fJYTf",
    "portalTokenExpiresAt": "2026-11-20T16:58:20.883Z"
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
      "linkedin": "https://www.linkedin.com/in/corbincrutchley/",
      "email": "github@crutchcorn.dev"
    },
    "portalToken": "eyJpZCI6IjhjMWEyYTc2LWI2MTUtNDMwYi05NmQ4LTBmODAwOTdkYzM3MCIsInNsdWciOiJjb3JiaW4tY3J1dGNobGV5IiwiZXhwIjoxNzk1MTkzOTAwODgzfQ.PBrb3w7d0lOYphmdqM44-f03",
    "portalTokenExpiresAt": "2026-11-20T16:58:20.883Z"
  },
  {
    "_id": "fcd7ce46-7e73-4802-8ec9-9fbaf5f13ee5",
    "title": "Dan Hafner",
    "socials": {
      "linkedin": "https://www.linkedin.com/in/dan-hafner-35066a39/",
      "email": "dan@dappermobileapps.com"
    },
    "portalToken": "eyJpZCI6ImZjZDdjZTQ2LTdlNzMtNDgwMi04ZWM5LTlmYmFmNWYxM2VlNSIsInNsdWciOiJkYW4taGFmbmVyIiwiZXhwIjoxNzk1MTkzOTAwODgzfQ._lvVEAi8fVgWV9d4XqO85D6X",
    "portalTokenExpiresAt": "2026-11-20T16:58:20.883Z"
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
    },
    "portalToken": "eyJpZCI6IlJJZ0M1cjRUSjBoQ0dPenhIdDBJSjkiLCJzbHVnIjoiZGFuaWVsLXJpYmJlbnMiLCJleHAiOjE3OTUxOTM5MDA4ODN9.5JilfxiVR-MXGMU2leFz68um",
    "portalTokenExpiresAt": "2026-11-20T16:58:20.883Z"
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
      "threads": "https://www.threads.net/@daniel.c.roe",
      "email": "daniel@roe.dev"
    },
    "portalToken": "eyJpZCI6IlJJZ0M1cjRUSjBoQ0dPenhIdDBIeXAiLCJzbHVnIjoiZGFuaWVsLXJvZSIsImV4cCI6MTc5NTE5MzkwMDg4M30.6ExvxkRAvxXzJrAqRIrj2UlF",
    "portalTokenExpiresAt": "2026-11-20T16:58:20.883Z"
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
    },
    "portalToken": "eyJpZCI6IlJJZ0M1cjRUSjBoQ0dPenhIdDBIZVYiLCJzbHVnIjoiZGViYmllLW8tYnJpZW4iLCJleHAiOjE3OTUxOTM5MDA4ODN9.bwA7rhpuVa6Rl8yvxqxhVeXd",
    "portalTokenExpiresAt": "2026-11-20T16:58:20.883Z"
  },
  {
    "_id": "RIgC5r4TJ0hCGOzxHt0HPG",
    "title": "Domitrius Clark",
    "socials": {
      "github": "https://github.com/domitriusclark",
      "twitch": "https://twitch.com/domitriusclark",
      "twitter": "https://twitter.com/domitriusclark",
      "linkedin": "https://www.linkedin.com/in/domitriusclark/",
      "bluesky": "https://bsky.app/profile/domitriusclark.bsky.social",
      "email": "domitriusaclark@gmail.com"
    },
    "portalToken": "eyJpZCI6IlJJZ0M1cjRUSjBoQ0dPenhIdDBIUEciLCJzbHVnIjoiZG9taXRyaXVzLWNsYXJrIiwiZXhwIjoxNzk1MTkzOTAwODgzfQ.LAeycSVKORXkGSBMsXH4VX_J",
    "portalTokenExpiresAt": "2026-11-20T16:58:20.883Z"
  },
  {
    "_id": "RIgC5r4TJ0hCGOzxHt0H4w",
    "title": "Douwe Maan",
    "socials": {
      "github": "https://github.com/DouweM",
      "linkedin": "https://www.linkedin.com/in/douwem/",
      "twitter": "https://twitter.com/DouweM",
      "email": "hi@douwe.me"
    },
    "portalToken": "eyJpZCI6IlJJZ0M1cjRUSjBoQ0dPenhIdDBINHciLCJzbHVnIjoiZG91d2UtbWFhbiIsImV4cCI6MTc5NTE5MzkwMDg4M30.TrAV139Efp24re3wbluctbYA",
    "portalTokenExpiresAt": "2026-11-20T16:58:20.883Z"
  },
  {
    "_id": "RIgC5r4TJ0hCGOzxHt0GB3",
    "title": "Dov Alperin",
    "socials": {
      "github": "https://github.com/DAlperin",
      "twitter": "https://twitter.com/dovunderscore",
      "mastodon": "https://mastodon.social/@dov",
      "linkedin": "https://www.linkedin.com/in/dov-alperin",
      "email": "dov@fly.io"
    },
    "portalToken": "eyJpZCI6IlJJZ0M1cjRUSjBoQ0dPenhIdDBHQjMiLCJzbHVnIjoiZG92LWFscGVyaW4iLCJleHAiOjE3OTUxOTM5MDA4ODN9.zsdvTjQU66iki7-uVcGs16BT",
    "portalTokenExpiresAt": "2026-11-20T16:58:20.883Z"
  },
  {
    "_id": "RIgC5r4TJ0hCGOzxHt0Gkc",
    "title": "Eduardo San Martin Morote",
    "socials": {
      "github": "https://github.com/posva",
      "mastodon": "https://m.webtoo.ls/@posva",
      "twitter": "https://twitter.com/posva",
      "bluesky": "https://bsky.app/profile/esm.dev"
    },
    "portalToken": "eyJpZCI6IlJJZ0M1cjRUSjBoQ0dPenhIdDBHa2MiLCJzbHVnIjoiZWR1YXJkby1zYW4tbWFydGluLW1vcm90ZSIsImV4cCI6MTc5NTE5MzkwMDg4M30.VaznFB7HyJmsNGb8-F68IiHB",
    "portalTokenExpiresAt": "2026-11-20T16:58:20.883Z"
  },
  {
    "_id": "RIgC5r4TJ0hCGOzxHt0GQI",
    "title": "Ekene Eze (Kenny)",
    "socials": {
      "github": "https://github.com/kenny-io",
      "twitter": "https://twitter.com/kenny_io",
      "youtube": "https://www.youtube.com/c/EkeneEze",
      "linkedin": "https://www.linkedin.com/in/ekeneeze/"
    },
    "portalToken": "eyJpZCI6IlJJZ0M1cjRUSjBoQ0dPenhIdDBHUUkiLCJzbHVnIjoiZWtlbmUtZXplIiwiZXhwIjoxNzk1MTkzOTAwODgzfQ.y1kIV4f_O4LltO7RPcQnkKjs",
    "portalTokenExpiresAt": "2026-11-20T16:58:20.883Z"
  },
  {
    "_id": "RIgC5r4TJ0hCGOzxHt0Fvo",
    "title": "Elena Lape",
    "socials": {
      "devto": "https://dev.to/elenalape",
      "github": "https://github.com/elenalape",
      "linkedin": "https://www.linkedin.com/in/ElenaLape/",
      "twitter": "https://twitter.com/elena_lape",
      "youtube": "https://www.youtube.com/elenalape",
      "email": "hi@elenalape.com"
    },
    "portalToken": "eyJpZCI6IlJJZ0M1cjRUSjBoQ0dPenhIdDBGdm8iLCJzbHVnIjoiZWxlbmEtbGFwZSIsImV4cCI6MTc5NTE5MzkwMDg4M30.1hJhxk6FSqoJIVTN0e3hOpJG",
    "portalTokenExpiresAt": "2026-11-20T16:58:20.883Z"
  },
  {
    "_id": "RIgC5r4TJ0hCGOzxHt0FMF",
    "title": "Elizabeth Bush",
    "socials": {
      "linkedin": "https://www.linkedin.com/in/elizabethbush/"
    },
    "portalToken": "eyJpZCI6IlJJZ0M1cjRUSjBoQ0dPenhIdDBGTUYiLCJzbHVnIjoiZWxpemFiZXRoLWJ1c2giLCJleHAiOjE3OTUxOTM5MDA4ODN9.d7S-wMTwXwR2wookqDGnYdty",
    "portalTokenExpiresAt": "2026-11-20T16:58:20.883Z"
  },
  {
    "_id": "RIgC5r4TJ0hCGOzxHt0F70",
    "title": "Elizabeth Wilson",
    "socials": {
      "linkedin": "https://www.linkedin.com/in/elizabethtrumanwilson/",
      "twitter": "https://twitter.com/TruWil",
      "bluesky": "https://bsky.app/profile/wilsones13.bsky.social"
    },
    "portalToken": "eyJpZCI6IlJJZ0M1cjRUSjBoQ0dPenhIdDBGNzAiLCJzbHVnIjoiZWxpemFiZXRoLXdpbHNvbiIsImV4cCI6MTc5NTE5MzkwMDg4M30.S0tdy4WUKnix4HfymESWuLoK",
    "portalTokenExpiresAt": "2026-11-20T16:58:20.883Z"
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
      "threads": "https://www.threads.net/@twerske",
      "email": "emmatwersky@google.com"
    },
    "portalToken": "eyJpZCI6IlJJZ0M1cjRUSjBoQ0dPenhIdDBGYlUiLCJzbHVnIjoiZW1tYS10d2Vyc2t5IiwiZXhwIjoxNzk1MTkzOTAwODgzfQ.b32asCqWFYqtKBOfJTU3SLWf",
    "portalTokenExpiresAt": "2026-11-20T16:58:20.883Z"
  },
  {
    "_id": "RIgC5r4TJ0hCGOzxHt0Erl",
    "title": "Eric Simons",
    "socials": {
      "github": "https://github.com/EricSimons",
      "linkedin": "https://www.linkedin.com/in/eric-simons-a464a664/",
      "twitter": "https://twitter.com/ericsimons40",
      "bluesky": "https://bsky.app/profile/esft.bsky.social",
      "email": "eric@stackblitz.com"
    },
    "portalToken": "eyJpZCI6IlJJZ0M1cjRUSjBoQ0dPenhIdDBFcmwiLCJzbHVnIjoiZXJpYy1zaW1vbnMiLCJleHAiOjE3OTUxOTM5MDA4ODN9.Ji7z7aWhvQ3tqUxOXHKIpvqJ",
    "portalTokenExpiresAt": "2026-11-20T16:58:20.883Z"
  },
  {
    "_id": "RIgC5r4TJ0hCGOzxHt0CKG",
    "title": "Erik Hanchett",
    "socials": {
      "github": "https://github.com/ErikCH",
      "twitter": "https://twitter.com/ErikCH",
      "youtube": "https://www.youtube.com/c/programwitherik",
      "bluesky": "https://bsky.app/profile/erikch.bsky.social",
      "email": "icystorm@gmail.com"
    },
    "portalToken": "eyJpZCI6IlJJZ0M1cjRUSjBoQ0dPenhIdDBDS0ciLCJzbHVnIjoiZXJpay1oYW5jaGV0dCIsImV4cCI6MTc5NTE5MzkwMDg4M30.DwMfIZ3FQYkUUBiwRD78hIo-",
    "portalTokenExpiresAt": "2026-11-20T16:58:20.883Z"
  },
  {
    "_id": "RIgC5r4TJ0hCGOzxHt0EcW",
    "title": "Facundo Giuliani",
    "socials": {
      "github": "https://github.com/fgiuliani",
      "linkedin": "https://www.linkedin.com/in/facundogiuliani/",
      "twitter": "https://twitter.com/facundozurdo",
      "bluesky": "https://bsky.app/profile/fgiuliani.bsky.social",
      "email": "facundo.giuliani@gmail.com"
    },
    "portalToken": "eyJpZCI6IlJJZ0M1cjRUSjBoQ0dPenhIdDBFY1ciLCJzbHVnIjoiZmFjdW5kby1naXVsaWFuaSIsImV4cCI6MTc5NTE5MzkwMDg4M30.Het0qZMq5EOHMW8A8HXovK1e",
    "portalTokenExpiresAt": "2026-11-20T16:58:20.883Z"
  },
  {
    "_id": "RIgC5r4TJ0hCGOzxHt0C51",
    "title": "Flor Antara",
    "socials": {
      "linkedin": "https://www.linkedin.com/in/florantara/",
      "twitter": "https://twitter.com/techflor",
      "email": "fantara@zipwhip.com"
    },
    "portalToken": "eyJpZCI6IlJJZ0M1cjRUSjBoQ0dPenhIdDBDNTEiLCJzbHVnIjoiZmxvci1hbnRhcmEiLCJleHAiOjE3OTUxOTM5MDA4ODN9.w6ikYUtOY3jSvK1EZl7G1kyq",
    "portalTokenExpiresAt": "2026-11-20T16:58:20.883Z"
  },
  {
    "_id": "RIgC5r4TJ0hCGOzxHt0Bpm",
    "title": "Fred K Schott",
    "socials": {
      "github": "https://github.com/fredkschott",
      "linkedin": "https://www.linkedin.com/in/fredkschott/",
      "twitter": "https://twitter.com/fredkschott"
    },
    "portalToken": "eyJpZCI6IlJJZ0M1cjRUSjBoQ0dPenhIdDBCcG0iLCJzbHVnIjoiZnJlZC1rLXNjaG90dCIsImV4cCI6MTc5NTE5MzkwMDg4M30.QnwkDFAHKrLoMqvDIV7tB493",
    "portalTokenExpiresAt": "2026-11-20T16:58:20.883Z"
  },
  {
    "_id": "RIgC5r4TJ0hCGOzxHt0BLI",
    "title": "Grayson Hicks",
    "socials": {
      "github": "https://github.com/graysonhicks",
      "twitter": "https://twitter.com/graysonhicks",
      "instagram": "https://instagram.com/jgraysonhicks",
      "threads": "https://www.threads.net/@jgraysonhicks"
    },
    "portalToken": "eyJpZCI6IlJJZ0M1cjRUSjBoQ0dPenhIdDBCTEkiLCJzbHVnIjoiZ3JheXNvbi1oaWNrcyIsImV4cCI6MTc5NTE5MzkwMDg4M30.xvZtsxidxZiGREwuN2tHmC05",
    "portalTokenExpiresAt": "2026-11-20T16:58:20.883Z"
  },
  {
    "_id": "RIgC5r4TJ0hCGOzxHt0B63",
    "title": "Greg Whitworth",
    "socials": {
      "github": "https://github.com/gregwhitworth",
      "twitter": "https://twitter.com/gregwhitworth",
      "linkedin": "https://www.linkedin.com/in/gregwhitworth/",
      "bluesky": "https://bsky.app/profile/gregwhitworth.bsky.social",
      "email": "gwhitworth@salesforce.com"
    },
    "portalToken": "eyJpZCI6IlJJZ0M1cjRUSjBoQ0dPenhIdDBCNjMiLCJzbHVnIjoiZ3JlZy13aGl0d29ydGgiLCJleHAiOjE3OTUxOTM5MDA4ODN9.l91jKTIwYz8R2ZxxniUY7LwR",
    "portalTokenExpiresAt": "2026-11-20T16:58:20.883Z"
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
      "threads": "https://www.threads.net/@rauchg",
      "email": "rauchg@gmail.com"
    },
    "portalToken": "eyJpZCI6IlJJZ0M1cjRUSjBoQ0dPenhIdDBCYVgiLCJzbHVnIjoiZ3VpbGxlcm1vLXJhdWNoIiwiZXhwIjoxNzk1MTkzOTAwODgzfQ.ms2asfYCipV5pEAHmzZuzEOf",
    "portalTokenExpiresAt": "2026-11-20T16:58:20.883Z"
  },
  {
    "_id": "RIgC5r4TJ0hCGOzxHt0Aqo",
    "title": "Heather Buchel",
    "socials": {
      "linkedin": "https://www.linkedin.com/in/heather-buchel-92bb5b64/",
      "mastodon": "https://hachyderm.io/@hbuchel",
      "twitter": "https://twitter.com/hbuchel",
      "bluesky": "https://bsky.app/profile/heather-buchel.com",
      "email": "buchel@amazon.com"
    },
    "portalToken": "eyJpZCI6IlJJZ0M1cjRUSjBoQ0dPenhIdDBBcW8iLCJzbHVnIjoiaGVhdGhlci1idWNoZWwiLCJleHAiOjE3OTUxOTM5MDA4ODN9.B4gfprfiSKo84ZQgvK6aO1hC",
    "portalTokenExpiresAt": "2026-11-20T16:58:20.883Z"
  },
  {
    "_id": "RIgC5r4TJ0hCGOzxHt0AbZ",
    "title": "Houssein Djirdeh",
    "socials": {
      "twitter": "https://twitter.com/hdjirdeh",
      "bluesky": "https://bsky.app/profile/houssein.bsky.social"
    },
    "portalToken": "eyJpZCI6IlJJZ0M1cjRUSjBoQ0dPenhIdDBBYloiLCJzbHVnIjoiaG91c3NlaW4tZGppcmRlaCIsImV4cCI6MTc5NTE5MzkwMDg4M30.iTVbK12ibZKeoojWvxskGp8Y",
    "portalTokenExpiresAt": "2026-11-20T16:58:20.883Z"
  },
  {
    "_id": "RIgC5r4TJ0hCGOzxHt0A20",
    "title": "Igor Zalutski",
    "socials": {
      "twitter": "https://twitter.com/igorzij"
    },
    "portalToken": "eyJpZCI6IlJJZ0M1cjRUSjBoQ0dPenhIdDBBMjAiLCJzbHVnIjoiaWdvci16YWx1dHNraSIsImV4cCI6MTc5NTE5MzkwMDg4M30.pEZ-0jwzSzzNfrinoVshKuti",
    "portalTokenExpiresAt": "2026-11-20T16:58:20.883Z"
  },
  {
    "_id": "RIgC5r4TJ0hCGOzxHt0AHF",
    "title": "Jake Rosenberg",
    "socials": {
      "twitter": "https://twitter.com/jakob_rosenberg",
      "bluesky": "https://bsky.app/profile/jakerosenberg.bsky.social"
    },
    "portalToken": "eyJpZCI6IlJJZ0M1cjRUSjBoQ0dPenhIdDBBSEYiLCJzbHVnIjoiamFrZS1yb3NlbmJlcmciLCJleHAiOjE3OTUxOTM5MDA4ODN9.1dr53UMejFVYntP8xazsOK-E",
    "portalTokenExpiresAt": "2026-11-20T16:58:20.883Z"
  },
  {
    "_id": "RIgC5r4TJ0hCGOzxHt09XW",
    "title": "James Perkins",
    "socials": {
      "github": "https://github.com/perkinsjr/",
      "twitter": "https://twitter.com/james_r_perkins",
      "youtube": "https://www.youtube.com/@james-perkins",
      "bluesky": "https://bsky.app/profile/jamesperkins.bsky.social",
      "email": "jamesperkins@hey.com"
    },
    "portalToken": "eyJpZCI6IlJJZ0M1cjRUSjBoQ0dPenhIdDA5WFciLCJzbHVnIjoiamFtZXMtci1wZXJraW5zIiwiZXhwIjoxNzk1MTkzOTAwODgzfQ.aGXbYgIjwzZ-z2DT61vNA3EU",
    "portalTokenExpiresAt": "2026-11-20T16:58:20.883Z"
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
      "threads": "https://www.threads.net/@jamesqquick",
      "email": "james.q.quick@gmail.com"
    },
    "portalToken": "eyJpZCI6IlJJZ0M1cjRUSjBoQ0dPenhIdDA5bWwiLCJzbHVnIjoiamFtZXMtcS1xdWljayIsImV4cCI6MTc5NTE5MzkwMDg4M30.6se56-vNlWSyBufuqdIvF3Ys",
    "portalTokenExpiresAt": "2026-11-20T16:58:20.883Z"
  },
  {
    "_id": "RIgC5r4TJ0hCGOzxHt08OO",
    "title": "James Vidler",
    "socials": {
      "github": "https://github.com/jamesvidler",
      "linkedin": "https://www.linkedin.com/in/jameskvidler/",
      "twitter": "https://twitter.com/jameskvidler",
      "bluesky": "https://bsky.app/profile/fownhopeboy.bsky.social",
      "email": "james@agilitycms.com"
    },
    "portalToken": "eyJpZCI6IlJJZ0M1cjRUSjBoQ0dPenhIdDA4T08iLCJzbHVnIjoiamFtZXMtdmlkbGVyIiwiZXhwIjoxNzk1MTkzOTAwODgzfQ.oEbxL9DMeO64Hp2F_zwTn18Q",
    "portalTokenExpiresAt": "2026-11-20T16:58:20.883Z"
  },
  {
    "_id": "RIgC5r4TJ0hCGOzxHt0899",
    "title": "Jason Bahl",
    "socials": {
      "twitter": "https://twitter.com/jasonbahl",
      "email": "jason.bahl@wpengine.com"
    },
    "portalToken": "eyJpZCI6IlJJZ0M1cjRUSjBoQ0dPenhIdDA4OTkiLCJzbHVnIjoiamFzb24tYmFobCIsImV4cCI6MTc5NTE5MzkwMDg4M30.Q9mg_RMH8oSbwAST9OhGW8z8",
    "portalTokenExpiresAt": "2026-11-20T16:58:20.883Z"
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
      "threads": "https://www.threads.net/@jlengstorf",
      "email": "jason@codetv.dev"
    },
    "portalToken": "eyJpZCI6IlJJZ0M1cjRUSjBoQ0dPenhIdDA3dHUiLCJzbHVnIjoiamFzb24tbGVuZ3N0b3JmIiwiZXhwIjoxNzk1MTkzOTAwODgzfQ.Zhc1BS3wKexshsd4OSU7XL0u",
    "portalTokenExpiresAt": "2026-11-20T16:58:20.883Z"
  },
  {
    "_id": "RIgC5r4TJ0hCGOzxHt07ef",
    "title": "Jeff Delaney",
    "socials": {
      "github": "https://github.com/codediodeio",
      "linkedin": "https://www.linkedin.com/in/jeff-delaney/",
      "twitter": "https://twitter.com/jeffdelaney23",
      "youtube": "https://www.youtube.com/fireship",
      "email": "hello@fireship.io"
    },
    "portalToken": "eyJpZCI6IlJJZ0M1cjRUSjBoQ0dPenhIdDA3ZWYiLCJzbHVnIjoiamVmZi1kZWxhbmV5IiwiZXhwIjoxNzk1MTkzOTAwODgzfQ.qigRr8WCgXLg31dL7xW_eEnD",
    "portalTokenExpiresAt": "2026-11-20T16:58:20.883Z"
  },
  {
    "_id": "RIgC5r4TJ0hCGOzxHt07AB",
    "title": "Jenn Junod",
    "socials": {
      "linkedin": "https://www.linkedin.com/in/jennjunod/",
      "twitch": "https://www.twitch.tv/jennjunod",
      "twitter": "https://twitter.com/jennjunod",
      "youtube": "https://www.youtube.com/channel/UCOYqYy7ebj5j63TbdGB-Lcg",
      "bluesky": "https://bsky.app/profile/jennjunod.bsky.social",
      "email": "hello@teachjenntech.com"
    },
    "portalToken": "eyJpZCI6IlJJZ0M1cjRUSjBoQ0dPenhIdDA3QUIiLCJzbHVnIjoiamVubi1qdW5vZCIsImV4cCI6MTc5NTE5MzkwMDg4M30.qS9O5_pDTdk0uRM2qFZ48nnX",
    "portalTokenExpiresAt": "2026-11-20T16:58:20.883Z"
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
      "bluesky": "https://bsky.app/profile/codestackr.com",
      "email": "codestackr@gmail.com"
    },
    "portalToken": "eyJpZCI6IlJJZ0M1cjRUSjBoQ0dPenhIdDA2UVMiLCJzbHVnIjoiamVzc2UtaGFsbCIsImV4cCI6MTc5NTE5MzkwMDg4M30.cimh0sMmcfkWy6BM42ysxGta",
    "portalTokenExpiresAt": "2026-11-20T16:58:20.883Z"
  },
  {
    "_id": "RIgC5r4TJ0hCGOzxHt07PQ",
    "title": "Jhey Tompkins",
    "socials": {
      "twitter": "https://twitter.com/jh3yy"
    },
    "portalToken": "eyJpZCI6IlJJZ0M1cjRUSjBoQ0dPenhIdDA3UFEiLCJzbHVnIjoiamhleS10b21wa2lucyIsImV4cCI6MTc5NTE5MzkwMDg4M30.B52B0RL0SddsNaRvfN5w58ix",
    "portalTokenExpiresAt": "2026-11-20T16:58:20.883Z"
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
    },
    "portalToken": "eyJpZCI6IlJJZ0M1cjRUSjBoQ0dPenhIdDA2ZmgiLCJzbHVnIjoiam9jaHVtLXdvbGZlbiIsImV4cCI6MTc5NTE5MzkwMDg4M30.BqduQAE_EAkgMe6iVLIThdaF",
    "portalTokenExpiresAt": "2026-11-20T16:58:20.883Z"
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
      "threads": "https://www.threads.net/@jcasabona",
      "email": "jcasabona@gmail.com"
    },
    "portalToken": "eyJpZCI6IjlhOGQ5MjU2LTExNGMtNDc5ZC1hZjUxLTdmYzkxNzZiN2FiZiIsInNsdWciOiJqb2UtY2FzYWJvbmEiLCJleHAiOjE3OTUxOTM5MDA4ODN9.oAmtLmIreE_M9nHngUeOx_Dc",
    "portalTokenExpiresAt": "2026-11-20T16:58:20.883Z"
  },
  {
    "_id": "RIgC5r4TJ0hCGOzxHt06uw",
    "title": "Joel Varty",
    "socials": {
      "linkedin": "https://www.linkedin.com/in/joelvarty",
      "twitter": "https://twitter.com/joelvarty",
      "bluesky": "https://bsky.app/profile/joelvarty.com",
      "email": "joel@agilitycms.com"
    },
    "portalToken": "eyJpZCI6IlJJZ0M1cjRUSjBoQ0dPenhIdDA2dXciLCJzbHVnIjoiam9lbC12YXJ0eSIsImV4cCI6MTc5NTE5MzkwMDg4M30.ID36jM3n81ibiuLoeOXkdWaZ",
    "portalTokenExpiresAt": "2026-11-20T16:58:20.883Z"
  },
  {
    "_id": "RIgC5r4TJ0hCGOzxHt06BD",
    "title": "Jon Meyers",
    "socials": {
      "github": "https://github.com/dijonmusters",
      "twitter": "https://twitter.com/jonmeyers_io",
      "youtube": "https://youtube.com/supabase",
      "bluesky": "https://bsky.app/profile/jonmeyers.io",
      "email": "jonathon.d.meyers@gmail.com"
    },
    "portalToken": "eyJpZCI6IlJJZ0M1cjRUSjBoQ0dPenhIdDA2QkQiLCJzbHVnIjoiam9uLW1leWVycyIsImV4cCI6MTc5NTE5MzkwMDg4M30.aBOWiM-hqzQ0RrQBC5To4-hy",
    "portalTokenExpiresAt": "2026-11-20T16:58:20.883Z"
  },
  {
    "_id": "dc5819bf-2835-40e2-8f94-73d6b6518329",
    "title": "Jonathan Wilke",
    "socials": {
      "github": "https://github.com/jonathanwilke",
      "linkedin": "https://www.linkedin.com/in/jonathan-wilke-766a83b8/",
      "twitter": "https://x.com/jonathan_wilke",
      "bluesky": "https://bsky.app/profile/jonathanwilke.bsky.social",
      "email": "info@jonathan-wilke.de"
    },
    "portalToken": "eyJpZCI6ImRjNTgxOWJmLTI4MzUtNDBlMi04Zjk0LTczZDZiNjUxODMyOSIsInNsdWciOiJqb25hdGhhbi13aWxrZSIsImV4cCI6MTc5NTE5MzkwMDg4M30.cPVi2F_vmd_y0i5yGL96rs5g",
    "portalTokenExpiresAt": "2026-11-20T16:58:20.883Z"
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
      "threads": "https://www.threads.net/@thejordanpowell",
      "email": "jordan@jpdesigning.com"
    },
    "portalToken": "eyJpZCI6IlJJZ0M1cjRUSjBoQ0dPenhIdDA1dnkiLCJzbHVnIjoiam9yZGFuLXBvd2VsbCIsImV4cCI6MTc5NTE5MzkwMDg4M30.myv6mn27voJyMC2wT3wH0uFD",
    "portalTokenExpiresAt": "2026-11-20T16:58:20.883Z"
  },
  {
    "_id": "RIgC5r4TJ0hCGOzxHt05gj",
    "title": "Josefine Schaefer",
    "socials": {
      "twitter": "https://twitter.com/JsfnSchfr",
      "email": "josefine.schaefer@storyblok.com"
    },
    "portalToken": "eyJpZCI6IlJJZ0M1cjRUSjBoQ0dPenhIdDA1Z2oiLCJzbHVnIjoiam9zZWZpbmUtc2NoYWVmZXIiLCJleHAiOjE3OTUxOTM5MDA4ODN9.AabpeIOaifKXy3RkC6vgvR9t",
    "portalTokenExpiresAt": "2026-11-20T16:58:20.883Z"
  },
  {
    "_id": "RIgC5r4TJ0hCGOzxHt04x0",
    "title": "Juan Andrés",
    "socials": {
      "github": "https://github.com/juanwmedia",
      "twitter": "https://twitter.com/juanwmedia",
      "linkedin": "https://www.linkedin.com/in/juanwmedia/",
      "youtube": "https://www.youtube.com/@juanwmedia",
      "bluesky": "https://bsky.app/profile/juanandreses.bsky.social",
      "email": "juan@wmedia.es"
    },
    "portalToken": "eyJpZCI6IlJJZ0M1cjRUSjBoQ0dPenhIdDA0eDAiLCJzbHVnIjoianVhbi1hbmRyZXMiLCJleHAiOjE3OTUxOTM5MDA4ODN9.LYhQyJIv43EHYGKi9NkIG4St",
    "portalTokenExpiresAt": "2026-11-20T16:58:20.883Z"
  },
  {
    "_id": "RIgC5r4TJ0hCGOzxHt05CF",
    "title": "Juri Strumpflohner",
    "socials": {
      "github": "https://github.com/juristr",
      "twitter": "https://twitter.com/juristr",
      "bluesky": "https://bsky.app/profile/juri.dev",
      "linkedin": "https://linkedin.com/in/juristr/",
      "youtube": "https://youtube.com/@juristr",
      "email": "juri.strumpflohner@gmail.com"
    },
    "portalToken": "eyJpZCI6IlJJZ0M1cjRUSjBoQ0dPenhIdDA1Q0YiLCJzbHVnIjoianVyaS1zdHJ1bXBmbG9obmVyIiwiZXhwIjoxNzk1MTkzOTAwODgzfQ.mP_lZvTGF4rNwgleqh4h_Nsl",
    "portalTokenExpiresAt": "2026-11-20T16:58:20.883Z"
  },
  {
    "_id": "RIgC5r4TJ0hCGOzxHt04IM",
    "title": "Justin Duke",
    "socials": {
      "github": "https://github.com/jmduke",
      "twitter": "https://twitter.com/jmduke",
      "bluesky": "https://bsky.app/profile/jmduke.com",
      "email": "justin@buttondown.email"
    },
    "portalToken": "eyJpZCI6IlJJZ0M1cjRUSjBoQ0dPenhIdDA0SU0iLCJzbHVnIjoianVzdGluLWR1a2UiLCJleHAiOjE3OTUxOTM5MDA4ODN9.OJxLy2qC8n_XGvSN28Pba1_h",
    "portalTokenExpiresAt": "2026-11-20T16:58:20.883Z"
  },
  {
    "_id": "RIgC5r4TJ0hCGOzxHt04hl",
    "title": "Justin Schwartzenberger",
    "socials": {
      "github": "https://github.com/jschwarty",
      "linkedin": "https://www.linkedin.com/in/justinschwartzenberger/",
      "stackoverflow": "https://stackoverflow.com/users/349596/justin-schwartzenberger",
      "twitter": "https://twitter.com/schwarty",
      "bluesky": "https://bsky.app/profile/schwarty.com",
      "email": "schwarty@gmail.com"
    },
    "portalToken": "eyJpZCI6IlJJZ0M1cjRUSjBoQ0dPenhIdDA0aGwiLCJzbHVnIjoianVzdGluLXNjaHdhcnR6ZW5iZXJnZXIiLCJleHAiOjE3OTUxOTM5MDA4ODN9.iBOj9lGf9K4wvBDfu-6RgZfL",
    "portalTokenExpiresAt": "2026-11-20T16:58:20.883Z"
  },
  {
    "_id": "RIgC5r4TJ0hCGOzxHt0437",
    "title": "Katerina Skroumpelou",
    "socials": {
      "github": "https://github.com/mandarini",
      "linkedin": "https://www.linkedin.com/in/katerinaskroumpelou/",
      "medium": "https://pakotinia.medium.com/",
      "twitter": "https://twitter.com/psybercity",
      "bluesky": "https://bsky.app/profile/psyber.city",
      "email": "katerina@nrwl.io"
    },
    "portalToken": "eyJpZCI6IlJJZ0M1cjRUSjBoQ0dPenhIdDA0MzciLCJzbHVnIjoia2F0ZXJpbmEtc2tyb3VtcGVsb3UiLCJleHAiOjE3OTUxOTM5MDA4ODN9.CZ56dErqiJTbSBxBfg5ldwXT",
    "portalTokenExpiresAt": "2026-11-20T16:58:20.883Z"
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
    },
    "portalToken": "eyJpZCI6IlJJZ0M1cjRUSjBoQ0dPenhIdDAzNDkiLCJzbHVnIjoia2F0aHJ5bi1ncmF5c29uIiwiZXhwIjoxNzk1MTkzOTAwODgzfQ.Ehy3UzDzYRkqqmTnCEGGYVYA",
    "portalTokenExpiresAt": "2026-11-20T16:58:20.883Z"
  },
  {
    "_id": "RIgC5r4TJ0hCGOzxHt03JO",
    "title": "Katie Franco",
    "socials": {
      "linkedin": "https://www.linkedin.com/in/katienfranco/",
      "twitter": "https://twitter.com/girldevelopit",
      "email": "mail@networkforgood.com"
    },
    "portalToken": "eyJpZCI6IlJJZ0M1cjRUSjBoQ0dPenhIdDAzSk8iLCJzbHVnIjoia2F0aWUtZnJhbmNvIiwiZXhwIjoxNzk1MTkzOTAwODgzfQ.OOPX6J7eu1fdiLiAELQZR7ZZ",
    "portalTokenExpiresAt": "2026-11-20T16:58:20.883Z"
  },
  {
    "_id": "RIgC5r4TJ0hCGOzxHt02ou",
    "title": "Kellen Mace",
    "socials": {
      "github": "https://github.com/kellenmace",
      "linkedin": "https://www.linkedin.com/in/kellenmace/",
      "twitter": "https://twitter.com/kellenmace",
      "bluesky": "https://bsky.app/profile/kellenmace.bsky.social",
      "email": "kellen.mace@wpengine.com"
    },
    "portalToken": "eyJpZCI6IlJJZ0M1cjRUSjBoQ0dPenhIdDAyb3UiLCJzbHVnIjoia2VsbGVuLW1hY2UiLCJleHAiOjE3OTUxOTM5MDA4ODN9.XmFuGGQI3FvFhWckW44Z7aK3",
    "portalTokenExpiresAt": "2026-11-20T16:58:20.883Z"
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
      "threads": "https://www.threads.net/@kelllyvaughn",
      "email": "hello@kvlly.com"
    },
    "portalToken": "eyJpZCI6IlJJZ0M1cjRUSjBoQ0dPenhIdDAyNUIiLCJzbHVnIjoia2VsbHktdmF1Z2huIiwiZXhwIjoxNzk1MTkzOTAwODgzfQ.b_XsdhxdYs_T2kwWm0ABbCmT",
    "portalTokenExpiresAt": "2026-11-20T16:58:20.883Z"
  },
  {
    "_id": "RIgC5r4TJ0hCGOzxHt02KQ",
    "title": "Kent C. Dodds",
    "socials": {
      "github": "https://github.com/kentcdodds",
      "twitter": "https://twitter.com/kentcdodds",
      "youtube": "https://www.youtube.com/@kentcdodds-vids",
      "bluesky": "https://bsky.app/profile/kentcdodds.com",
      "email": "me+github@kentcdodds.com"
    },
    "portalToken": "eyJpZCI6IlJJZ0M1cjRUSjBoQ0dPenhIdDAyS1EiLCJzbHVnIjoia2VudC1jLWRvZGRzIiwiZXhwIjoxNzk1MTkzOTAwODgzfQ.5UcPYGYc5bJZf1KoBgBE87tb",
    "portalTokenExpiresAt": "2026-11-20T16:58:20.883Z"
  },
  {
    "_id": "RIgC5r4TJ0hCGOzxHt01pw",
    "title": "Knut Melvaer",
    "socials": {
      "github": "https://github.com/kmelve",
      "linkedin": "https://www.linkedin.com/in/knutmelvaer/",
      "twitter": "https://twitter.com/kmelve",
      "bluesky": "https://bsky.app/profile/knut.fyi",
      "email": "knut.melvaer@gmail.com"
    },
    "portalToken": "eyJpZCI6IlJJZ0M1cjRUSjBoQ0dPenhIdDAxcHciLCJzbHVnIjoia251dC1tZWx2YWVyIiwiZXhwIjoxNzk1MTkzOTAwODgzfQ.hJ3TqGBs0Lt47ha_QG5ubvc_",
    "portalTokenExpiresAt": "2026-11-20T16:58:20.883Z"
  },
  {
    "_id": "RIgC5r4TJ0hCGOzxHt02Zf",
    "title": "Lane Wagner",
    "socials": {
      "github": "https://github.com/wagslane",
      "linkedin": "https://www.linkedin.com/in/wagslane/",
      "twitter": "https://twitter.com/wagslane",
      "bluesky": "https://bsky.app/profile/wagslane.bsky.social"
    },
    "portalToken": "eyJpZCI6IlJJZ0M1cjRUSjBoQ0dPenhIdDAyWmYiLCJzbHVnIjoibGFuZS13YWduZXIiLCJleHAiOjE3OTUxOTM5MDA4ODN9.T0jLlQV0LpVtyknvbKitcnbt",
    "portalTokenExpiresAt": "2026-11-20T16:58:20.883Z"
  },
  {
    "_id": "RIgC5r4TJ0hCGOzxHt01ah",
    "title": "Lauren Lee",
    "socials": {
      "github": "https://github.com/laurenelee",
      "linkedin": "https://www.linkedin.com/in/dev-lauren-lee/",
      "twitter": "https://twitter.com/LoLoCoding",
      "youtube": "https://www.youtube.com/channel/UCAXRntzYPySoBGSZJClcRlg",
      "bluesky": "https://bsky.app/profile/laurenlee.bsky.social",
      "email": "lauren@lolocoding.com"
    },
    "portalToken": "eyJpZCI6IlJJZ0M1cjRUSjBoQ0dPenhIdDAxYWgiLCJzbHVnIjoibGF1cmVuLWxlZSIsImV4cCI6MTc5NTE5MzkwMDg4M30.z4T8OdBgq_YQyDHbcTb7BjVj",
    "portalTokenExpiresAt": "2026-11-20T16:58:20.883Z"
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
      "bluesky": "https://bsky.app/profile/laurieontech.dev",
      "email": "brittney@ajonp.com"
    },
    "portalToken": "eyJpZCI6IlJJZ0M1cjRUSjBoQ0dPenhIdDAxTFMiLCJzbHVnIjoibGF1cmllLWJhcnRoIiwiZXhwIjoxNzk1MTkzOTAwODgzfQ.POyEPithA2HLU9LhRPfTD-4d",
    "portalTokenExpiresAt": "2026-11-20T16:58:20.883Z"
  },
  {
    "_id": "RIgC5r4TJ0hCGOzxHszy9J",
    "title": "Lee Briggs",
    "socials": {
      "github": "https://github.com/jaxxstorm",
      "linkedin": "https://www.linkedin.com/in/briggsl/",
      "twitter": "https://twitter.com/briggsl",
      "bluesky": "https://bsky.app/profile/brig.gs"
    },
    "portalToken": "eyJpZCI6IlJJZ0M1cjRUSjBoQ0dPenhIc3p5OUoiLCJzbHVnIjoibGVlLWJyaWdncyIsImV4cCI6MTc5NTE5MzkwMDg4M30.CC7fyxT58l2u_A8FLFDLwXHM",
    "portalTokenExpiresAt": "2026-11-20T16:58:20.883Z"
  },
  {
    "_id": "RIgC5r4TJ0hCGOzxHszyTd",
    "title": "Lee Robinson",
    "socials": {
      "github": "https://github.com/leerob",
      "linkedin": "https://www.linkedin.com/in/leeerob/",
      "twitter": "https://twitter.com/leeerob",
      "youtube": "https://www.youtube.com/@leerob",
      "bluesky": "https://bsky.app/profile/leerobinson.bsky.social",
      "email": "lee@leerob.com"
    },
    "portalToken": "eyJpZCI6IlJJZ0M1cjRUSjBoQ0dPenhIc3p5VGQiLCJzbHVnIjoibGVlLXJvYmluc29uIiwiZXhwIjoxNzk1MTkzOTAwODgzfQ.CGp3sQip9PfxL54sxDL9q9Xt",
    "portalTokenExpiresAt": "2026-11-20T16:58:20.883Z"
  },
  {
    "_id": "740e85e5-0635-4a59-9426-714467259091",
    "title": "Luca Forstner",
    "socials": {
      "github": "https://github.com/lforst",
      "linkedin": "https://www.linkedin.com/in/luca-forstner-10807a231/",
      "twitter": "https://x.com/LucaForstner",
      "bluesky": "https://bsky.app/profile/handle.invalid",
      "email": "luca.forstner@gmail.com"
    },
    "portalToken": "eyJpZCI6Ijc0MGU4NWU1LTA2MzUtNGE1OS05NDI2LTcxNDQ2NzI1OTA5MSIsInNsdWciOiJsdWNhLWZvcnN0bmVyIiwiZXhwIjoxNzk1MTkzOTAwODgzfQ.wccm8STAm3h1NA6wHY7aCoBF",
    "portalTokenExpiresAt": "2026-11-20T16:58:20.883Z"
  },
  {
    "_id": "RIgC5r4TJ0hCGOzxHszpSl",
    "title": "Lukas (spydon) Klingsbro",
    "socials": {
      "github": "https://github.com/spydon",
      "linkedin": "https://www.linkedin.com/in/spydon/",
      "twitter": "https://twitter.com/spyd0n",
      "mastodon": "https://fosstodon.org/@spydon",
      "bluesky": "https://bsky.app/profile/spydon.dev",
      "email": "me@lukas.fyi"
    },
    "portalToken": "eyJpZCI6IlJJZ0M1cjRUSjBoQ0dPenhIc3pwU2wiLCJzbHVnIjoibHVrYXMtc3B5ZG9uIiwiZXhwIjoxNzk1MTkzOTAwODgzfQ.fDqNExeUr57goanKHjP-77H6",
    "portalTokenExpiresAt": "2026-11-20T16:58:20.883Z"
  },
  {
    "_id": "f2a116ab-731a-4bc8-9a30-59b22f602f34",
    "title": "Mark Huggins",
    "socials": {
      "twitter": "https://twitter.com/mhuggins1978"
    },
    "portalToken": "eyJpZCI6ImYyYTExNmFiLTczMWEtNGJjOC05YTMwLTU5YjIyZjYwMmYzNCIsInNsdWciOiJtYXJrLWh1Z2dpbnMiLCJleHAiOjE3OTUxOTM5MDA4ODN9.EDoCluYwvKMM35lenDj76y67",
    "portalTokenExpiresAt": "2026-11-20T16:58:20.883Z"
  },
  {
    "_id": "RIgC5r4TJ0hCGOzxHszpDW",
    "title": "Matias Capeletto",
    "socials": {
      "github": "https://github.com/patak-dev",
      "twitter": "https://twitter.com/patak_dev",
      "email": "matias.capeletto@gmail.com"
    },
    "portalToken": "eyJpZCI6IlJJZ0M1cjRUSjBoQ0dPenhIc3pwRFciLCJzbHVnIjoibWF0aWFzLWNhcGVsZXR0byIsImV4cCI6MTc5NTE5MzkwMDg4M30.nQ4C-wmrR8Wn2pKvDhyIAnSR",
    "portalTokenExpiresAt": "2026-11-20T16:58:20.883Z"
  },
  {
    "_id": "RIgC5r4TJ0hCGOzxHszoj2",
    "title": "Matthew Phillips",
    "socials": {
      "github": "https://github.com/matthewp",
      "twitter": "https://twitter.com/matthewcp",
      "bluesky": "https://bsky.app/profile/spooky.click",
      "email": "matthew@matthewphillips.info"
    },
    "portalToken": "eyJpZCI6IlJJZ0M1cjRUSjBoQ0dPenhIc3pvajIiLCJzbHVnIjoibWF0dGhldy1waGlsbGlwcyIsImV4cCI6MTc5NTE5MzkwMDg4M30.7tBLlr8wO0CX8kLiB-HBGrx4",
    "portalTokenExpiresAt": "2026-11-20T16:58:20.883Z"
  },
  {
    "_id": "91c2331d-0fa1-4905-8bfe-8f5b78f00c64",
    "title": "Max Gerber",
    "socials": {
      "github": "https://github.com/maxwellgerber",
      "linkedin": "https://www.linkedin.com/in/maxwellgerber/",
      "bluesky": "https://bsky.app/profile/maxgerber.bsky.social",
      "email": "max@stytch.com"
    },
    "portalToken": "eyJpZCI6IjkxYzIzMzFkLTBmYTEtNDkwNS04YmZlLThmNWI3OGYwMGM2NCIsInNsdWciOiJtYXgtZ2VyYmVyIiwiZXhwIjoxNzk1MTkzOTAwODgzfQ.X8eqlBA1ZHgdCkzspL47u1Is",
    "portalTokenExpiresAt": "2026-11-20T16:58:20.883Z"
  },
  {
    "_id": "RIgC5r4TJ0hCGOzxHszoTn",
    "title": "Max Howell",
    "socials": {
      "github": "https://github.com/mxcl",
      "twitter": "https://twitter.com/mxcl",
      "linkedin": "https://www.linkedin.com/in/mxcl",
      "email": "mxcl@me.com"
    },
    "portalToken": "eyJpZCI6IlJJZ0M1cjRUSjBoQ0dPenhIc3pvVG4iLCJzbHVnIjoibWF4LWhvd2VsbCIsImV4cCI6MTc5NTE5MzkwMDg4M30.zuk1r0Ssjyk8R_aUjz5lT0C1",
    "portalTokenExpiresAt": "2026-11-20T16:58:20.883Z"
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
      "bluesky": "https://bsky.app/profile/mayashavin.com",
      "email": "alex@ajonp.com"
    },
    "portalToken": "eyJpZCI6IlJJZ0M1cjRUSjBoQ0dPenhIc3pvRVkiLCJzbHVnIjoibWF5YS1zaGF2aW4iLCJleHAiOjE3OTUxOTM5MDA4ODN9.QZ2cxAI1h62nXDMvY8i3_fYX",
    "portalTokenExpiresAt": "2026-11-20T16:58:20.883Z"
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
    },
    "portalToken": "eyJpZCI6IlJJZ0M1cjRUSjBoQ0dPenhIc3puekoiLCJzbHVnIjoibWljaGFlbC1jaGFuIiwiZXhwIjoxNzk1MTkzOTAwODgzfQ.H2vvZfrd7Sm1RrfxBJPRXBoA",
    "portalTokenExpiresAt": "2026-11-20T16:58:20.883Z"
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
      "bluesky": "https://bsky.app/profile/mrdowden.bsky.social",
      "email": "michael@dowden.us"
    },
    "portalToken": "eyJpZCI6IlJJZ0M1cjRUSjBoQ0dPenhIc3puazQiLCJzbHVnIjoibWljaGFlbC1kb3dkZW4iLCJleHAiOjE3OTUxOTM5MDA4ODN9.MqgfIZYgzem8mQN6iXHyM6gT",
    "portalTokenExpiresAt": "2026-11-20T16:58:20.883Z"
  },
  {
    "_id": "RIgC5r4TJ0hCGOzxHsznUp",
    "title": "Mike Hartington",
    "socials": {
      "github": "https://github.com/mhartington",
      "linkedin": "https://www.linkedin.com/in/mike-hartington-63638362/",
      "twitter": "https://twitter.com/mhartington",
      "bluesky": "http://bsky.app/profile/mhartington.io",
      "email": "mike@ionic.io"
    },
    "portalToken": "eyJpZCI6IlJJZ0M1cjRUSjBoQ0dPenhIc3puVXAiLCJzbHVnIjoibWlrZS1oYXJ0aW5ndG9uIiwiZXhwIjoxNzk1MTkzOTAwODgzfQ.-8fsqbk9CaUPWMFsrt4eu_h_",
    "portalTokenExpiresAt": "2026-11-20T16:58:20.883Z"
  },
  {
    "_id": "RIgC5r4TJ0hCGOzxHszn0L",
    "title": "Miško Hevery",
    "socials": {
      "github": "https://github.com/mhevery",
      "twitter": "https://twitter.com/mhevery",
      "bluesky": "https://bsky.app/profile/misko.dev",
      "email": "misko@hevery.com"
    },
    "portalToken": "eyJpZCI6IlJJZ0M1cjRUSjBoQ0dPenhIc3puMEwiLCJzbHVnIjoibWlza28taGV2ZXJ5IiwiZXhwIjoxNzk1MTkzOTAwODgzfQ.Ir8FRpj7zDUNNXoTZhWwPcXx",
    "portalTokenExpiresAt": "2026-11-20T16:58:20.883Z"
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
      "threads": "https://www.threads.net/@code.with.ahsan",
      "email": "ahsan.ubitian@gmail.com"
    },
    "portalToken": "eyJpZCI6IjE2MmJhYjg3LWQ2NWQtNGMyMC1iNjI1LTZlZTU5M2ViYWE0NSIsInNsdWciOiJtdWhhbW1hZC1haHNhbi1heWF6IiwiZXhwIjoxNzk1MTkzOTAwODgzfQ.mK5tpuCf5DtFMaHETfLTYO9l",
    "portalTokenExpiresAt": "2026-11-20T16:58:20.883Z"
  },
  {
    "_id": "RIgC5r4TJ0hCGOzxHsznFa",
    "title": "Nader Dabit",
    "socials": {
      "github": "https://github.com/dabit3",
      "linkedin": "https://www.linkedin.com/in/naderdabit/",
      "twitter": "https://twitter.com/dabit3",
      "youtube": "https://www.youtube.com/naderdabit",
      "bluesky": "https://bsky.app/profile/dabit3.bsky.social",
      "email": "notify@twitter.com"
    },
    "portalToken": "eyJpZCI6IlJJZ0M1cjRUSjBoQ0dPenhIc3puRmEiLCJzbHVnIjoibmFkZXItZGFiaXQiLCJleHAiOjE3OTUxOTM5MDA4ODN9.HHtoAoAeOeJsW81RzJDsHXzv",
    "portalTokenExpiresAt": "2026-11-20T16:58:20.883Z"
  },
  {
    "_id": "RIgC5r4TJ0hCGOzxHszml6",
    "title": "Nick DeJesus",
    "socials": {
      "github": "https://github.com/Dayhaysoos",
      "twitter": "https://twitter.com/dayhaysoos",
      "bluesky": "https://bsky.app/profile/dayhaysoos.bsky.social",
      "email": "ndejesus1227@gmail.com"
    },
    "portalToken": "eyJpZCI6IlJJZ0M1cjRUSjBoQ0dPenhIc3ptbDYiLCJzbHVnIjoibmljay1kZWplc3VzIiwiZXhwIjoxNzk1MTkzOTAwODgzfQ.agmPDtJ_6HXnOXPwhqUQ-WBQ",
    "portalTokenExpiresAt": "2026-11-20T16:58:20.883Z"
  },
  {
    "_id": "RIgC5r4TJ0hCGOzxHszeyR",
    "title": "Nick Hodges",
    "socials": {
      "github": "https://github.com/nickhodges",
      "linkedin": "https://www.linkedin.com/in/nickhodges/",
      "medium": "https://nickhodges.medium.com/",
      "twitter": "https://twitter.com/nickhodges",
      "bluesky": "https://bsky.app/profile/nickhodges.bsky.social",
      "email": "nickhodges@gmail.com"
    },
    "portalToken": "eyJpZCI6IlJJZ0M1cjRUSjBoQ0dPenhIc3pleVIiLCJzbHVnIjoibmljay1ob2RnZXMiLCJleHAiOjE3OTUxOTM5MDA4ODN9.bVbF_7-ryFpedRif62P3TBF-",
    "portalTokenExpiresAt": "2026-11-20T16:58:20.883Z"
  },
  {
    "_id": "RIgC5r4TJ0hCGOzxHszgWy",
    "title": "Nick Rouech",
    "socials": {
      "linkedin": "https://www.linkedin.com/in/nickrouech/",
      "email": "paperlesspost@paperlesspost.com"
    },
    "portalToken": "eyJpZCI6IlJJZ0M1cjRUSjBoQ0dPenhIc3pnV3kiLCJzbHVnIjoibmljay1yb3VlY2giLCJleHAiOjE3OTUxOTM5MDA4ODN9.hu7atAjdaBz8RHLPAqVwhH9z",
    "portalTokenExpiresAt": "2026-11-20T16:58:20.883Z"
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
      "threads": "https://www.threads.net/@nickytonline",
      "email": "nick@nickyt.co"
    },
    "portalToken": "eyJpZCI6ImYzZmY4ZGUxLTliNDgtNDc2OC04OThlLWE4NGNiMmVmYjIyOCIsInNsdWciOiJuaWNrLXRheWxvciIsImV4cCI6MTc5NTE5MzkwMDg4M30.4WdlG-117IJYWU5NamVt31ek",
    "portalTokenExpiresAt": "2026-11-20T16:58:20.883Z"
  },
  {
    "_id": "RIgC5r4TJ0hCGOzxHsziAa",
    "title": "Omed Habib",
    "socials": {
      "github": "https://github.com/omedhabib",
      "instagram": "https://www.instagram.com/omed.habib",
      "linkedin": "https://www.linkedin.com/in/omed/",
      "twitter": "https://twitter.com/omedhabib",
      "threads": "https://www.threads.net/@omed.habib",
      "email": "omed@habib.io"
    },
    "portalToken": "eyJpZCI6IlJJZ0M1cjRUSjBoQ0dPenhIc3ppQWEiLCJzbHVnIjoib21lZC1oYWJpYiIsImV4cCI6MTc5NTE5MzkwMDg4M30.nnPYNFAGiCQNOmWLVi2enBTB",
    "portalTokenExpiresAt": "2026-11-20T16:58:20.883Z"
  },
  {
    "_id": "RIgC5r4TJ0hCGOzxHszjYx",
    "title": "Oren Eini",
    "socials": {
      "facebook": "https://www.facebook.com/profile.php?id=100063550929698",
      "github": "https://github.com/ayende",
      "linkedin": "https://www.linkedin.com/in/ravendb/",
      "twitter": "https://twitter.com/ayende",
      "email": "ayende@ayende.com"
    },
    "portalToken": "eyJpZCI6IlJJZ0M1cjRUSjBoQ0dPenhIc3pqWXgiLCJzbHVnIjoib3Jlbi1laW5pIiwiZXhwIjoxNzk1MTkzOTAwODgzfQ.REoPPIDKAKYGHuETd5oL0f3h",
    "portalTokenExpiresAt": "2026-11-20T16:58:20.883Z"
  },
  {
    "_id": "RIgC5r4TJ0hCGOzxHszeTx",
    "title": "Ovi Negrean",
    "socials": {
      "linkedin": "https://www.linkedin.com/in/ovidiunegrean/",
      "twitter": "https://twitter.com/OviNegrean",
      "email": "ovi@socialbee.com"
    },
    "portalToken": "eyJpZCI6IlJJZ0M1cjRUSjBoQ0dPenhIc3plVHgiLCJzbHVnIjoib3ZpLW5lZ3JlYW4iLCJleHAiOjE3OTUxOTM5MDA4ODN9.Zdo0pDfw02oQP0USECNAtMGu",
    "portalTokenExpiresAt": "2026-11-20T16:58:20.883Z"
  },
  {
    "_id": "RIgC5r4TJ0hCGOzxHsze4Y",
    "title": "Paolo Ricciuti",
    "socials": {
      "github": "https://github.com/paoloricciuti",
      "twitter": "https://twitter.com/PaoloRicciuti",
      "bluesky": "https://bsky.app/profile/paolo.ricciuti.me",
      "email": "ricciutipaolo@gmail.com"
    },
    "portalToken": "eyJpZCI6IlJJZ0M1cjRUSjBoQ0dPenhIc3plNFkiLCJzbHVnIjoicGFvbG8tcmljY2l1dGkiLCJleHAiOjE3OTUxOTM5MDA4ODN9.UC5rIO265h6SDwIg2K0CPart",
    "portalTokenExpiresAt": "2026-11-20T16:58:20.883Z"
  },
  {
    "_id": "RIgC5r4TJ0hCGOzxHszejC",
    "title": "Pariss Athena",
    "socials": {
      "twitter": "https://twitter.com/parissathena"
    },
    "portalToken": "eyJpZCI6IlJJZ0M1cjRUSjBoQ0dPenhIc3plakMiLCJzbHVnIjoicGFyaXNzLWF0aGVuYSIsImV4cCI6MTc5NTE5MzkwMDg4M30.-SHL8BBQM4Vmauc6CaC1Pnca",
    "portalTokenExpiresAt": "2026-11-20T16:58:20.883Z"
  },
  {
    "_id": "RIgC5r4TJ0hCGOzxHszdAf",
    "title": "Patricio Vargas",
    "socials": {
      "devto": "https://dev.to/devpato",
      "github": "https://github.com/devpato",
      "twitter": "https://twitter.com/devpato",
      "email": "devpatovg@gmail.com"
    },
    "portalToken": "eyJpZCI6IlJJZ0M1cjRUSjBoQ0dPenhIc3pkQWYiLCJzbHVnIjoicGF0cmljaW8tdmFyZ2FzIiwiZXhwIjoxNzk1MTkzOTAwODgzfQ.FHPrvQkU9EY3hmavJPGmaoa3",
    "portalTokenExpiresAt": "2026-11-20T16:58:20.883Z"
  },
  {
    "_id": "RIgC5r4TJ0hCGOzxHszdUz",
    "title": "Patrick Martin",
    "socials": {
      "github": "https://github.com/patm1987",
      "linkedin": "https://www.linkedin.com/in/patrick-martin-268a85a/",
      "medium": "https://medium.com/@pux0r3",
      "twitter": "https://twitter.com/pux0r3",
      "bluesky": "https://bsky.app/profile/pcnmartin.bsky.social",
      "email": "martinpatrick@google.com"
    },
    "portalToken": "eyJpZCI6IlJJZ0M1cjRUSjBoQ0dPenhIc3pkVXoiLCJzbHVnIjoicGF0cmljay1tYXJ0aW4iLCJleHAiOjE3OTUxOTM5MDA4ODN9.AZYwYzZ18MnSgqTWdvfkBQDE",
    "portalTokenExpiresAt": "2026-11-20T16:58:20.883Z"
  },
  {
    "_id": "RIgC5r4TJ0hCGOzxHszdkE",
    "title": "Pedro Duarte",
    "socials": {
      "github": "https://github.com/peduarte",
      "linkedin": "https://www.linkedin.com/in/peduarteltd/?originalSubdomain=es",
      "twitter": "https://twitter.com/peduarte",
      "bluesky": "https://bsky.app/profile/ped.ro"
    },
    "portalToken": "eyJpZCI6IlJJZ0M1cjRUSjBoQ0dPenhIc3pka0UiLCJzbHVnIjoicGVkcm8tZHVhcnRlIiwiZXhwIjoxNzk1MTkzOTAwODgzfQ.Zm5lQHJmXOHPu-TQbwhRWtxa",
    "portalTokenExpiresAt": "2026-11-20T16:58:20.883Z"
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
      "bluesky": "https://bsky.app/profile/maxcell.bsky.social",
      "email": "maxcell.wilson@gmail.com"
    },
    "portalToken": "eyJpZCI6IlJJZ0M1cjRUSjBoQ0dPenhIc3pjZ0IiLCJzbHVnIjoicHJpbmNlLXdpbHNvbiIsImV4cCI6MTc5NTE5MzkwMDg4M30.hoLcKEmG12pOZywDiIiSvJ3t",
    "portalTokenExpiresAt": "2026-11-20T16:58:20.883Z"
  },
  {
    "_id": "RIgC5r4TJ0hCGOzxHszcBh",
    "title": "Randal Schwartz",
    "socials": {
      "linkedin": "https://www.linkedin.com/in/randalschwartz/",
      "twitter": "https://twitter.com/RandalSchwartz",
      "bluesky": "https://bsky.app/profile/randalschwartz.bsky.social",
      "email": "realmerlyn@gmail.com"
    },
    "portalToken": "eyJpZCI6IlJJZ0M1cjRUSjBoQ0dPenhIc3pjQmgiLCJzbHVnIjoicmFuZGFsLXNjaHdhcnR6IiwiZXhwIjoxNzk1MTkzOTAwODgzfQ.7OOp47if8z6aA1AWeYyxKnTI",
    "portalTokenExpiresAt": "2026-11-20T16:58:20.883Z"
  },
  {
    "_id": "69fe600a-1626-442f-8331-3423f3aadacc",
    "title": "Raymond Camden",
    "socials": {
      "codepen": "https://codepen.io/cfjedimaster",
      "github": "https://github.com/cfjedimaster",
      "linkedin": "https://www.linkedin.com/in/raymondcamden/",
      "mastodon": "https://mastodon.social/@raymondcamden",
      "youtube": "https://www.youtube.com/user/theraymondcamden",
      "email": "raymondcamden@gmail.com"
    },
    "portalToken": "eyJpZCI6IjY5ZmU2MDBhLTE2MjYtNDQyZi04MzMxLTM0MjNmM2FhZGFjYyIsInNsdWciOiJyYXltb25kLWNhbWRlbiIsImV4cCI6MTc5NTE5MzkwMDg4M30.GrM7LntbpWI_9aO3DN1vVu69",
    "portalTokenExpiresAt": "2026-11-20T16:58:20.883Z"
  },
  {
    "_id": "RIgC5r4TJ0hCGOzxHszbwS",
    "title": "Renan",
    "socials": {
      "github": "https://github.com/renancaraujo",
      "linkedin": "https://www.linkedin.com/in/renancaraujo/",
      "twitter": "https://twitter.com/reNotANumber",
      "mastodon": "https://fluttercommunity.social/@renan",
      "bluesky": "https://bsky.app/profile/renanminx.bsky.social",
      "email": "jochum@blue-fire.xyz"
    },
    "portalToken": "eyJpZCI6IlJJZ0M1cjRUSjBoQ0dPenhIc3pid1MiLCJzbHVnIjoicmVuYW4iLCJleHAiOjE3OTUxOTM5MDA4ODN9.thmk1Hk0WTjWMGeE6mvDUiDJ",
    "portalTokenExpiresAt": "2026-11-20T16:58:20.883Z"
  },
  {
    "_id": "RIgC5r4TJ0hCGOzxHszbRy",
    "title": "René Brandel",
    "socials": {
      "github": "https://github.com/renebrandel",
      "linkedin": "https://www.linkedin.com/in/renebrandel/",
      "twitter": "https://twitter.com/renebrandel",
      "bluesky": "https://bsky.app/profile/renebrandel.bsky.social"
    },
    "portalToken": "eyJpZCI6IlJJZ0M1cjRUSjBoQ0dPenhIc3piUnkiLCJzbHVnIjoicmVuZS1icmFuZGVsIiwiZXhwIjoxNzk1MTkzOTAwODgzfQ.jfyPCdJkh6h1fd8Yy1Wy6xgX",
    "portalTokenExpiresAt": "2026-11-20T16:58:20.883Z"
  },
  {
    "_id": "RIgC5r4TJ0hCGOzxHszbhD",
    "title": "Rich Harris",
    "socials": {
      "github": "https://github.com/Rich-Harris",
      "linkedin": "https://www.linkedin.com/in/rich-harris/",
      "twitter": "https://twitter.com/rich_harris",
      "bluesky": "https://bsky.app/profile/rich-harris.dev",
      "email": "richard.a.harris@gmail.com"
    },
    "portalToken": "eyJpZCI6IlJJZ0M1cjRUSjBoQ0dPenhIc3piaEQiLCJzbHVnIjoicmljaF9oYXJyaXMiLCJleHAiOjE3OTUxOTM5MDA4ODN9.44P_KQgNIeqheOf07blID3vl",
    "portalTokenExpiresAt": "2026-11-20T16:58:20.883Z"
  },
  {
    "_id": "RIgC5r4TJ0hCGOzxHszbCj",
    "title": "Richard Bray",
    "socials": {
      "github": "https://github.com/RichardBray",
      "medium": "https://richbray.medium.com/",
      "tiktok": "https://www.tiktok.com/@richardoliverbray?lang=en",
      "twitter": "https://twitter.com/RichOBray",
      "youtube": "https://www.youtube.com/c/RichardBray",
      "email": "richardbray89@gmail.com"
    },
    "portalToken": "eyJpZCI6IlJJZ0M1cjRUSjBoQ0dPenhIc3piQ2oiLCJzbHVnIjoicmljaGFyZC1icmF5IiwiZXhwIjoxNzk1MTkzOTAwODgzfQ.oEFmKiPH-ZeN_ECWvagqPSFj",
    "portalTokenExpiresAt": "2026-11-20T16:58:20.883Z"
  },
  {
    "_id": "RIgC5r4TJ0hCGOzxHszaNv",
    "title": "Rob Sutter",
    "socials": {
      "linkedin": "https://www.linkedin.com/in/robsutter/",
      "twitter": "https://twitter.com/rts_rob",
      "bluesky": "https://bsky.app/profile/robsutter.dev"
    },
    "portalToken": "eyJpZCI6IlJJZ0M1cjRUSjBoQ0dPenhIc3phTnYiLCJzbHVnIjoicm9iLXN1dHRlciIsImV4cCI6MTc5NTE5MzkwMDg4M30.NSAdl_kKDDsYuF5Bq4D2edYi",
    "portalTokenExpiresAt": "2026-11-20T16:58:20.883Z"
  },
  {
    "_id": "9fc9b65d-cfa3-4407-9f94-be7eb8cd32be",
    "title": "Roman Jaquez",
    "socials": {
      "github": "https://github.com/romanejaquez",
      "twitter": "https://twitter.com/drcoderz",
      "bluesky": "https://bsky.app/profile/romanjaquez.bsky.social",
      "email": "romanejaquez@gmail.com"
    },
    "portalToken": "eyJpZCI6IjlmYzliNjVkLWNmYTMtNDQwNy05Zjk0LWJlN2ViOGNkMzJiZSIsInNsdWciOiJyb21hbi1qYXF1ZXoiLCJleHAiOjE3OTUxOTM5MDA4ODN9.zwOOUvySAfotGOEmtAjwqah3",
    "portalTokenExpiresAt": "2026-11-20T16:58:20.883Z"
  },
  {
    "_id": "RIgC5r4TJ0hCGOzxHszaiF",
    "title": "Ryan Carniato",
    "socials": {
      "devto": "https://dev.to/ryansolid",
      "github": "https://github.com/ryansolid",
      "twitter": "https://twitter.com/RyanCarniato",
      "bluesky": "https://bsky.app/profile/ryansolid.bsky.social"
    },
    "portalToken": "eyJpZCI6IlJJZ0M1cjRUSjBoQ0dPenhIc3phaUYiLCJzbHVnIjoicnlhbi1jYXJuaWF0byIsImV4cCI6MTc5NTE5MzkwMDg4M30.UEbJcbJm1pDrcik_xQngghAy",
    "portalTokenExpiresAt": "2026-11-20T16:58:20.883Z"
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
    },
    "portalToken": "eyJpZCI6IlJJZ0M1cjRUSjBoQ0dPenhIc3pZa0oiLCJzbHVnIjoic2FsbWEtYWxhbS1uYXlsb3IiLCJleHAiOjE3OTUxOTM5MDA4ODN9.mmLvDXeaOm2T2WHGbnL3M3s4",
    "portalTokenExpiresAt": "2026-11-20T16:58:20.883Z"
  },
  {
    "_id": "RIgC5r4TJ0hCGOzxHszVnP",
    "title": "Sam Bhagwat",
    "socials": {
      "github": "https://github.com/calcsam",
      "linkedin": "https://www.linkedin.com/in/sambhagwat/",
      "twitter": "https://twitter.com/calcsam",
      "bluesky": "https://bsky.app/profile/calcsam.bsky.social",
      "email": "calcsam@gmail.com"
    },
    "portalToken": "eyJpZCI6IlJJZ0M1cjRUSjBoQ0dPenhIc3pWblAiLCJzbHVnIjoic2FtLWJoYWd3YXQiLCJleHAiOjE3OTUxOTM5MDA4ODN9.tb7Rw160IhUgJG_huKU0ykoK",
    "portalTokenExpiresAt": "2026-11-20T16:58:20.883Z"
  },
  {
    "_id": "7146388d-9566-40d9-bf71-c21da61dc133",
    "title": "Sam Kim",
    "socials": {
      "github": "https://github.com/samkim",
      "linkedin": "https://www.linkedin.com/in/samskim/",
      "email": "sam@authzed.com"
    },
    "portalToken": "eyJpZCI6IjcxNDYzODhkLTk1NjYtNDBkOS1iZjcxLWMyMWRhNjFkYzEzMyIsInNsdWciOiJzYW0ta2ltIiwiZXhwIjoxNzk1MTkzOTAwODgzfQ.nkvUWe75tpC-Jy81zHhm-jgO",
    "portalTokenExpiresAt": "2026-11-20T16:58:20.883Z"
  },
  {
    "_id": "RIgC5r4TJ0hCGOzxHszVT5",
    "title": "Sam Littlefair",
    "socials": {
      "github": "https://github.com/samlfair",
      "linkedin": "https://www.linkedin.com/in/samlittlefair/?originalSubdomain=ca",
      "twitter": "https://twitter.com/samlfair",
      "bluesky": "https://bsky.app/profile/littlefair.ca",
      "email": "sam.littlefair@prismic.io"
    },
    "portalToken": "eyJpZCI6IlJJZ0M1cjRUSjBoQ0dPenhIc3pWVDUiLCJzbHVnIjoic2FtLWxpdHRsZWZhaXIiLCJleHAiOjE3OTUxOTM5MDA4ODN9.lA1NSCrZiEYOHbpG35IYkI0-",
    "portalTokenExpiresAt": "2026-11-20T16:58:20.883Z"
  },
  {
    "_id": "RIgC5r4TJ0hCGOzxHszVDq",
    "title": "Sarah Kapehe",
    "socials": {
      "github": "https://github.com/kapehe-ok",
      "linkedin": "https://www.linkedin.com/in/kapehe/",
      "twitter": "https://twitter.com/kapehe_ok",
      "youtube": "https://www.youtube.com/c/betterdevs"
    },
    "portalToken": "eyJpZCI6IlJJZ0M1cjRUSjBoQ0dPenhIc3pWRHEiLCJzbHVnIjoic2FyYWgta2FwZWhlIiwiZXhwIjoxNzk1MTkzOTAwODgzfQ.oTdbwyWNdEuWbQ8Cf23SjzDi",
    "portalTokenExpiresAt": "2026-11-20T16:58:20.883Z"
  },
  {
    "_id": "ad09a6a8-84e1-49ea-b5ab-18e2bb1247b8",
    "title": "Saron Yitbarek",
    "socials": {
      "twitter": "https://twitter.com/saronyitbarek",
      "bluesky": "https://bsky.app/profile/saron.bsky.social",
      "email": "saron.yitbarek@gmail.com"
    },
    "portalToken": "eyJpZCI6ImFkMDlhNmE4LTg0ZTEtNDllYS1iNWFiLTE4ZTJiYjEyNDdiOCIsInNsdWciOiJzYXJvbi15aXRiYXJlayIsImV4cCI6MTc5NTE5MzkwMDg4M30.wMBYfhw19QV7tRBvSuoGKRfi",
    "portalTokenExpiresAt": "2026-11-20T16:58:20.883Z"
  },
  {
    "_id": "0a915c5b-1da4-460d-b966-61bc18356131",
    "title": "Sathiesh Veera",
    "socials": {
      "github": "https://github.com/Sathyvs",
      "linkedin": "https://www.linkedin.com/in/sathieshveera/",
      "email": "sathieshkumar.v.s@gmail.com"
    },
    "portalToken": "eyJpZCI6IjBhOTE1YzViLTFkYTQtNDYwZC1iOTY2LTYxYmMxODM1NjEzMSIsInNsdWciOiJzYXRoaWVzaC12ZWVyYSIsImV4cCI6MTc5NTE5MzkwMDg4M30.qPjQSfyVECykpeK0KG6M41yB",
    "portalTokenExpiresAt": "2026-11-20T16:58:20.883Z"
  },
  {
    "_id": "0ccc6e7b-24b9-4e13-87dc-ca95d86c2298",
    "title": "Scott Rees",
    "socials": {
      "linkedin": "https://www.linkedin.com/in/scott-rees-3800a814/",
      "mastodon": "https://hachyderm.io/@hbuchel",
      "twitter": "https://x.com/reesscot?lang=en",
      "bluesky": "https://bsky.app/profile/scott-rees.bsky.social",
      "email": "reesscot@amazon.com"
    },
    "portalToken": "eyJpZCI6IjBjY2M2ZTdiLTI0YjktNGUxMy04N2RjLWNhOTVkODZjMjI5OCIsInNsdWciOiJzY290dC1yZWVzIiwiZXhwIjoxNzk1MTkzOTAwODgzfQ.OPdfNdaWXvHAEoAJXkT4kAKc",
    "portalTokenExpiresAt": "2026-11-20T16:58:20.883Z"
  },
  {
    "_id": "RIgC5r4TJ0hCGOzxHszUyb",
    "title": "Scott Spence",
    "socials": {
      "github": "https://github.com/spences10",
      "twitter": "https://twitter.com/spences10",
      "bluesky": "https://bsky.app/profile/scottspence.dev",
      "email": "brittney@ajonp.com"
    },
    "portalToken": "eyJpZCI6IlJJZ0M1cjRUSjBoQ0dPenhIc3pVeWIiLCJzbHVnIjoic2NvdHQtc3BlbmNlIiwiZXhwIjoxNzk1MTkzOTAwODgzfQ.qURCz2GQbU-5X5lP4p378BpT",
    "portalTokenExpiresAt": "2026-11-20T16:58:20.883Z"
  },
  {
    "_id": "RIgC5r4TJ0hCGOzxHszcQw",
    "title": "Scott Tolinski",
    "socials": {
      "github": "https://github.com/stolinski",
      "linkedin": "https://www.linkedin.com/in/stolinski/",
      "twitter": "https://twitter.com/stolinski",
      "youtube": "https://www.youtube.com/c/leveluptuts",
      "bluesky": "https://bsky.app/profile/tolin.ski",
      "email": "scott.tolinski@gmail.com"
    },
    "portalToken": "eyJpZCI6IlJJZ0M1cjRUSjBoQ0dPenhIc3pjUXciLCJzbHVnIjoic2NvdHQtdG9saW5za2kiLCJleHAiOjE3OTUxOTM5MDA4ODN9.MOxgsTHFuWfjhkeCEctxjHG8",
    "portalTokenExpiresAt": "2026-11-20T16:58:20.883Z"
  },
  {
    "_id": "RIgC5r4TJ0hCGOzxHszUjM",
    "title": "Sean Falconer",
    "socials": {
      "github": "https://github.com/thefalc",
      "linkedin": "https://www.linkedin.com/in/seanf/",
      "twitter": "https://twitter.com/seanfalconer",
      "bluesky": "https://bsky.app/profile/seanfalconer.bsky.social"
    },
    "portalToken": "eyJpZCI6IlJJZ0M1cjRUSjBoQ0dPenhIc3pVak0iLCJzbHVnIjoic2Vhbi1mYWxjb25lciIsImV4cCI6MTc5NTE5MzkwMDg4M30.34xW3oYX7eAk8kEu13mLmpJr",
    "portalTokenExpiresAt": "2026-11-20T16:58:20.883Z"
  },
  {
    "_id": "RIgC5r4TJ0hCGOzxHszUU7",
    "title": "Shai Reznik",
    "socials": {
      "github": "https://github.com/shairez",
      "twitter": "https://twitter.com/shai_reznik",
      "youtube": "https://www.youtube.com/user/hirezio",
      "bluesky": "https://bsky.app/profile/shairez.bsky.social",
      "email": "shai@hirez.io"
    },
    "portalToken": "eyJpZCI6IlJJZ0M1cjRUSjBoQ0dPenhIc3pVVTciLCJzbHVnIjoic2hhaS1yZXpuaWsiLCJleHAiOjE3OTUxOTM5MDA4ODN9._Ncy7TlcWEfUG_yVmZqeGtk4",
    "portalTokenExpiresAt": "2026-11-20T16:58:20.883Z"
  },
  {
    "_id": "RIgC5r4TJ0hCGOzxHszSva",
    "title": "Shawn Wang (swyx)",
    "socials": {
      "github": "https://github.com/swyxio",
      "linkedin": "https://www.linkedin.com/in/shawnswyxwang/",
      "stackoverflow": "https://stackoverflow.com/users/1106414/swyx",
      "twitter": "https://twitter.com/swyx",
      "youtube": "https://www.youtube.com/swyxTV"
    },
    "portalToken": "eyJpZCI6IlJJZ0M1cjRUSjBoQ0dPenhIc3pTdmEiLCJzbHVnIjoic3d5eCIsImV4cCI6MTc5NTE5MzkwMDg4M30.cfYQGWiXjefu17_saRx8Z1XC",
    "portalTokenExpiresAt": "2026-11-20T16:58:20.883Z"
  },
  {
    "_id": "RIgC5r4TJ0hCGOzxHszUEs",
    "title": "Shivay Lamba",
    "socials": {
      "github": "https://github.com/shivaylamba",
      "mastodon": "https://mastodon.social/@shivaylamba",
      "twitter": "https://twitter.com/howdevelop",
      "bluesky": "https://bsky.app/profile/shivaylamba.bsky.social",
      "email": "shivaylamba@gmail.com"
    },
    "portalToken": "eyJpZCI6IlJJZ0M1cjRUSjBoQ0dPenhIc3pVRXMiLCJzbHVnIjoic2hpdmF5LWxhbWJhIiwiZXhwIjoxNzk1MTkzOTAwODgzfQ.VDfPnS5niXakeKOZoTWGkL1x",
    "portalTokenExpiresAt": "2026-11-20T16:58:20.883Z"
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
      "threads": "https://www.threads.net/@simongrimm_",
      "email": "simon@galaxies.dev"
    },
    "portalToken": "eyJpZCI6IlJJZ0M1cjRUSjBoQ0dPenhIc3pUa08iLCJzbHVnIjoic2ltb24tZ3JpbW0iLCJleHAiOjE3OTUxOTM5MDA4ODN9.APEfVR1Na_gCs90nR4zh93mA",
    "portalTokenExpiresAt": "2026-11-20T16:58:20.883Z"
  },
  {
    "_id": "RIgC5r4TJ0hCGOzxHszTV9",
    "title": "Stefan Kingham",
    "socials": {
      "twitter": "https://twitter.com/stefankingham",
      "bluesky": "https://bsky.app/profile/stefankingham.bsky.social",
      "email": "stefankingham@offerzen.com"
    },
    "portalToken": "eyJpZCI6IlJJZ0M1cjRUSjBoQ0dPenhIc3pUVjkiLCJzbHVnIjoic3RlZmFuLWtpbmdoYW0iLCJleHAiOjE3OTUxOTM5MDA4ODN9.QYI2cvZ3llZmDYM1q1ndAI9N",
    "portalTokenExpiresAt": "2026-11-20T16:58:20.883Z"
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
      "bluesky": "https://bsky.app/profile/steve8708.bsky.social",
      "email": "steve@builder.io"
    },
    "portalToken": "eyJpZCI6IlJJZ0M1cjRUSjBoQ0dPenhIc3pUQXAiLCJzbHVnIjoic3RldmUtc2V3ZWxsIiwiZXhwIjoxNzk1MTkzOTAwODgzfQ.pjzVHntJ3IGpF5YBpge24mp-",
    "portalTokenExpiresAt": "2026-11-20T16:58:20.883Z"
  },
  {
    "_id": "dfa8f1c2-1fef-4556-b061-2ea0422ec537",
    "title": "Tamas Piros",
    "socials": {
      "twitter": "https://x.com/tpiros",
      "youtube": "https://www.youtube.com/@WebDevFrontiers",
      "email": "tamas@cloudinary.com"
    },
    "portalToken": "eyJpZCI6ImRmYThmMWMyLTFmZWYtNDU1Ni1iMDYxLTJlYTA0MjJlYzUzNyIsInNsdWciOiJ0YW1hcy1waXJvcyIsImV4cCI6MTc5NTE5MzkwMDg4M30.kjnolYkXWseotQmNNtNIF6NB",
    "portalTokenExpiresAt": "2026-11-20T16:58:20.883Z"
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
      "threads": "https://www.threads.net/@tdesseyn",
      "email": "taylordesseyn@gun.io"
    },
    "portalToken": "eyJpZCI6IlJJZ0M1cjRUSjBoQ0dPenhIc3pTZ0wiLCJzbHVnIjoidGF5bG9yLWRlc3NleW4iLCJleHAiOjE3OTUxOTM5MDA4ODN9.m6esDkL0wIqZAlCejfjS9Um2",
    "portalTokenExpiresAt": "2026-11-20T16:58:20.883Z"
  },
  {
    "_id": "RIgC5r4TJ0hCGOzxHszSR6",
    "title": "Tessa Mero",
    "socials": {
      "linkedin": "https://www.linkedin.com/in/tessamero/",
      "twitter": "https://twitter.com/TessaMero",
      "bluesky": "https://bsky.app/profile/tessamero.bsky.social",
      "email": "tessa@appwrite.io"
    },
    "portalToken": "eyJpZCI6IlJJZ0M1cjRUSjBoQ0dPenhIc3pTUjYiLCJzbHVnIjoidGVzc2EtbWVybyIsImV4cCI6MTc5NTE5MzkwMDg4M30.4-GoE6PnZlzBsPSwqgCe-xea",
    "portalTokenExpiresAt": "2026-11-20T16:58:20.883Z"
  },
  {
    "_id": "RIgC5r4TJ0hCGOzxHszSBr",
    "title": "Thomas G. Lopes",
    "socials": {
      "github": "https://github.com/TGlide",
      "twitter": "https://twitter.com/thomasglopes",
      "bluesky": "https://bsky.app/profile/thomasglopes.com",
      "linkedin": "https://www.linkedin.com/in/thomas-gl/",
      "email": "thomasgl@pm.me"
    },
    "portalToken": "eyJpZCI6IlJJZ0M1cjRUSjBoQ0dPenhIc3pTQnIiLCJzbHVnIjoidGhvbWFzLWctbG9wZXMiLCJleHAiOjE3OTUxOTM5MDA4ODN9.8utu5caHZPrG3pDzEAmwr_lg",
    "portalTokenExpiresAt": "2026-11-20T16:58:20.883Z"
  },
  {
    "_id": "c04bf8ca-ecba-4ab9-9a6b-7e5002291277",
    "title": "Thomas Johnson",
    "socials": {
      "github": "https://github.com/tomjohnson3",
      "linkedin": "https://www.linkedin.com/in/tomjohnson3/",
      "twitter": "https://x.com/tomjohnson3",
      "bluesky": "https://bsky.app/profile/multiplayer.app",
      "threads": "https://www.threads.net/@trymultiplayer",
      "email": "tom@multiplayer.app"
    },
    "portalToken": "eyJpZCI6ImMwNGJmOGNhLWVjYmEtNGFiOS05YTZiLTdlNTAwMjI5MTI3NyIsInNsdWciOiJ0aG9tYXMtam9obnNvbiIsImV4cCI6MTc5NTE5MzkwMDg4M30.6KELuF9cqPUChWwplFyXHF28",
    "portalTokenExpiresAt": "2026-11-20T16:58:20.883Z"
  },
  {
    "_id": "RIgC5r4TJ0hCGOzxHszRrX",
    "title": "Tim Benniks",
    "socials": {
      "github": "https://github.com/timbenniks",
      "linkedin": "https://www.linkedin.com/in/timbenniks/",
      "twitter": "https://twitter.com/timbenniks",
      "bluesky": "https://bsky.app/profile/timbenniks.dev",
      "email": "tbenniks@gmail.com"
    },
    "portalToken": "eyJpZCI6IlJJZ0M1cjRUSjBoQ0dPenhIc3pSclgiLCJzbHVnIjoidGltLWJlbm5pa3MiLCJleHAiOjE3OTUxOTM5MDA4ODN9.hCocHVf4qZiSYQc1exfp8o-G",
    "portalTokenExpiresAt": "2026-11-20T16:58:20.883Z"
  },
  {
    "_id": "RIgC5r4TJ0hCGOzxHszRcI",
    "title": "Tim Neutkens",
    "socials": {
      "github": "https://github.com/timneutkens",
      "linkedin": "https://www.linkedin.com/in/tim-neutkens-5a6733168/",
      "twitter": "https://twitter.com/timneutkens",
      "bluesky": "https://bsky.app/profile/timneutkens.bsky.social",
      "email": "lee@vercel.com"
    },
    "portalToken": "eyJpZCI6IlJJZ0M1cjRUSjBoQ0dPenhIc3pSY0kiLCJzbHVnIjoidGltLW5ldXRrZW5zIiwiZXhwIjoxNzk1MTkzOTAwODgzfQ.Nw7sXo3vgSU9-IMmKrs8rvOc",
    "portalTokenExpiresAt": "2026-11-20T16:58:20.883Z"
  },
  {
    "_id": "35aedae9-ff20-4ac0-8310-52b04fa3e444",
    "title": "Tobin South",
    "socials": {
      "twitter": "https://x.com/TobinSouth",
      "linkedin": "https://www.linkedin.com/in/tobinsouth/",
      "github": "https://github.com/tobinsouth",
      "bluesky": "https://bsky.app/profile/tobinsouth.com",
      "email": "tobin.south@gmail.com"
    },
    "portalToken": "eyJpZCI6IjM1YWVkYWU5LWZmMjAtNGFjMC04MzEwLTUyYjA0ZmEzZTQ0NCIsInNsdWciOiJ0b2Jpbi1zb3V0aCIsImV4cCI6MTc5NTE5MzkwMDg4M30.5wjyJI3-uIPVzvV87HQ-E8gv",
    "portalTokenExpiresAt": "2026-11-20T16:58:20.883Z"
  },
  {
    "_id": "RIgC5r4TJ0hCGOzxHszRCt",
    "title": "Tom Preston-Werner",
    "socials": {
      "github": "https://github.com/mojombo",
      "linkedin": "https://www.linkedin.com/in/mojombo/",
      "twitter": "https://twitter.com/mojombo",
      "bluesky": "https://bsky.app/profile/mojombo.bsky.social",
      "email": "tom@mojombo.com"
    },
    "portalToken": "eyJpZCI6IlJJZ0M1cjRUSjBoQ0dPenhIc3pSQ3QiLCJzbHVnIjoidG9tLXByZXN0b24td2VybmVyIiwiZXhwIjoxNzk1MTkzOTAwODgzfQ.8Pi7b6eHsOH871jFlTAywJSH",
    "portalTokenExpiresAt": "2026-11-20T16:58:20.883Z"
  },
  {
    "_id": "RIgC5r4TJ0hCGOzxHszPUC",
    "title": "Tomek Sułkowski",
    "socials": {
      "github": "https://github.com/sulco",
      "linkedin": "https://www.linkedin.com/in/tsulkowski/",
      "twitter": "https://twitter.com/sulco",
      "bluesky": "https://bsky.app/profile/sulco.dev",
      "email": "notify@twitter.com"
    },
    "portalToken": "eyJpZCI6IlJJZ0M1cjRUSjBoQ0dPenhIc3pQVUMiLCJzbHVnIjoidG9tZWstc3Vsa293c2tpIiwiZXhwIjoxNzk1MTkzOTAwODgzfQ.bOsD2ULgpaN_IGGE9NW9D_zq",
    "portalTokenExpiresAt": "2026-11-20T16:58:20.883Z"
  },
  {
    "_id": "6a4a7c7c-a288-4acd-b980-8849c360b2df",
    "title": "Tyler Crowe",
    "socials": {
      "linkedin": "https://www.linkedin.com/in/tylersuncrowe/",
      "email": "gesly@google.com"
    },
    "portalToken": "eyJpZCI6IjZhNGE3YzdjLWEyODgtNGFjZC1iOTgwLTg4NDljMzYwYjJkZiIsInNsdWciOiJ0eWxlci1jcm93ZSIsImV4cCI6MTc5NTE5MzkwMDg4M30.QGQr8FNz0ARyhwmS-hNuPLiG",
    "portalTokenExpiresAt": "2026-11-20T16:58:20.883Z"
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
      "bluesky": "https://bsky.app/profile/tyler.ui.dev",
      "email": "tyler@ui.dev"
    },
    "portalToken": "eyJpZCI6IlJJZ0M1cjRUSjBoQ0dPenhIc3pQNG4iLCJzbHVnIjoidHlsZXItbWNnaW5uaXMiLCJleHAiOjE3OTUxOTM5MDA4ODN9.7teYxn5_KA0DXYX63E1mT4Re",
    "portalTokenExpiresAt": "2026-11-20T16:58:20.883Z"
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
      "linkedin": "https://www.linkedin.com/in/unakravets",
      "email": "una.kravets@gmail.com"
    },
    "portalToken": "eyJpZCI6IlJJZ0M1cjRUSjBoQ0dPenhIc3pPZk8iLCJzbHVnIjoidW5hLWtyYXZldHMiLCJleHAiOjE3OTUxOTM5MDA4ODN9.iCPH0fyeMXjHzw0V8sMB4PQ_",
    "portalTokenExpiresAt": "2026-11-20T16:58:20.883Z"
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
      "threads": "https://www.threads.net/@vagish",
      "email": "vagish@vtaku.com"
    },
    "portalToken": "eyJpZCI6IlJJZ0M1cjRUSjBoQ0dPenhIc3pOMW0iLCJzbHVnIjoidmFnaXNoLXZlbGEiLCJleHAiOjE3OTUxOTM5MDA4ODN9.P4JrT5VtNIpITKvLjcoGBewO",
    "portalTokenExpiresAt": "2026-11-20T16:58:20.883Z"
  },
  {
    "_id": "0d5cd71e-5b13-4dc2-8b7f-f1ce0a1ed5b1",
    "title": "Vincent (Wen Yu) Ge",
    "socials": {
      "github": "https://github.com/gewenyu99",
      "twitter": "https://x.com/WenYuGe1",
      "youtube": "https://www.youtube.com/@umamicomplex6841",
      "bluesky": "https://bsky.app/profile/gewenyu99.bsky.social"
    },
    "portalToken": "eyJpZCI6IjBkNWNkNzFlLTViMTMtNGRjMi04YjdmLWYxY2UwYTFlZDViMSIsInNsdWciOiJ2aW5jZW50LXdlbi15dS1nZSIsImV4cCI6MTc5NTE5MzkwMDg4M30.XQHfnihFmtX14Amuhesf1ubb",
    "portalTokenExpiresAt": "2026-11-20T16:58:20.883Z"
  },
  {
    "_id": "RIgC5r4TJ0hCGOzxHszMhS",
    "title": "Vlad Hosu",
    "socials": {
      "github": "https://github.com/subpic",
      "linkedin": "https://www.linkedin.com/in/vladhosu/",
      "bluesky": "https://bsky.app/profile/vlad.socialbee.com",
      "email": "vlad.hosu@uni-konstanz.de"
    },
    "portalToken": "eyJpZCI6IlJJZ0M1cjRUSjBoQ0dPenhIc3pNaFMiLCJzbHVnIjoidmxhZC1ob3N1IiwiZXhwIjoxNzk1MTkzOTAwODgzfQ.AlTieo_jKleIBRAtnsEqUtQy",
    "portalTokenExpiresAt": "2026-11-20T16:58:20.883Z"
  },
  {
    "_id": "RIgC5r4TJ0hCGOzxHszMN8",
    "title": "Waldemar Hummer",
    "socials": {
      "github": "https://github.com/whummer/",
      "twitter": "https://twitter.com/w_hummer",
      "bluesky": "https://bsky.app/profile/whummer.bsky.social",
      "email": "waldemar.hummer@localstack.cloud"
    },
    "portalToken": "eyJpZCI6IlJJZ0M1cjRUSjBoQ0dPenhIc3pNTjgiLCJzbHVnIjoid2FsZGVtYXItaHVtbWVyIiwiZXhwIjoxNzk1MTkzOTAwODgzfQ.wd9UmjTt6IRSk35gllav0lRh",
    "portalTokenExpiresAt": "2026-11-20T16:58:20.883Z"
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
      "threads": "https://www.threads.net/@wesbos",
      "email": "wes@wesbos.com"
    },
    "portalToken": "eyJpZCI6IlJJZ0M1cjRUSjBoQ0dPenhIc3pNMm8iLCJzbHVnIjoid2VzLWJvcyIsImV4cCI6MTc5NTE5MzkwMDg4M30.p56yOmK0oXfBPCUQouC3UtvK",
    "portalTokenExpiresAt": "2026-11-20T16:58:20.883Z"
  },
  {
    "_id": "RIgC5r4TJ0hCGOzxHszLiU",
    "title": "Willow (GHOST)",
    "socials": {
      "github": "https://github.com/ghostdevv",
      "twitter": "https://twitter.com/onlyspaceghost",
      "bluesky": "https://bsky.app/profile/willow.sh",
      "mastodon": "https://fosstodon.org/@onlyspaceghost"
    },
    "portalToken": "eyJpZCI6IlJJZ0M1cjRUSjBoQ0dPenhIc3pMaVUiLCJzbHVnIjoid2lsbG93IiwiZXhwIjoxNzk1MTkzOTAwODgzfQ.O_gP1vG28eC0wswdi6wey5-G",
    "portalTokenExpiresAt": "2026-11-20T16:58:20.883Z"
  },
  {
    "_id": "RIgC5r4TJ0hCGOzxHszLOA",
    "title": "Zack DeRose",
    "socials": {
      "github": "https://github.com/ZackDeRose",
      "linkedin": "https://www.linkedin.com/in/zackderose/",
      "twitter": "https://twitter.com/zackderose",
      "youtube": "https://www.youtube.com/c/ZackDeRoseDev",
      "bluesky": "https://bsky.app/profile/zackderose.bsky.social",
      "email": "zack.derose@gmail.com"
    },
    "portalToken": "eyJpZCI6IlJJZ0M1cjRUSjBoQ0dPenhIc3pMT0EiLCJzbHVnIjoiemFjay1kZXJvc2UiLCJleHAiOjE3OTUxOTM5MDA4ODN9.AY1OuIM1A_DXIJgJAiaYeToR",
    "portalTokenExpiresAt": "2026-11-20T16:58:20.883Z"
  },
  {
    "_id": "RIgC5r4TJ0hCGOzxHszL3q",
    "title": "Zoë Wilson",
    "socials": {
      "linkedin": "https://www.linkedin.com/in/zo%C3%AB-wilson-45b8a7b7/",
      "bluesky": "https://bsky.app/profile/zoelwilson.bsky.social"
    },
    "portalToken": "eyJpZCI6IlJJZ0M1cjRUSjBoQ0dPenhIc3pMM3EiLCJzbHVnIjoiem9lLXdpbHNvbiIsImV4cCI6MTc5NTE5MzkwMDg4M30._6Cm4gPsUIDHtiy47zGlt5Fg",
    "portalTokenExpiresAt": "2026-11-20T16:58:20.883Z"
  },
  {
    "_id": "RIgC5r4TJ0hCGOzxHszoyH",
    "title": "m4dz",
    "socials": {
      "github": "https://github.com/m4dz/",
      "linkedin": "https://www.linkedin.com/in/m4d-z/",
      "twitch": "https://www.twitch.tv/m4dz_devrel/",
      "twitter": "https://twitter.com/m4d_z",
      "bluesky": "https://bsky.app/profile/madz258.wetdry.world.ap.brid.gy",
      "email": "code@m4dz.net"
    },
    "portalToken": "eyJpZCI6IlJJZ0M1cjRUSjBoQ0dPenhIc3pveUgiLCJzbHVnIjoibTRkeiIsImV4cCI6MTc5NTE5MzkwMDg4M30.e6YH04QjqkTHWTpDWD9PvaA-",
    "portalTokenExpiresAt": "2026-11-20T16:58:20.883Z"
  },
  {
    "_id": "RIgC5r4TJ0hCGOzxHszcvQ",
    "title": "pngwn",
    "socials": {
      "github": "https://github.com/pngwn",
      "twitter": "https://twitter.com/evilpingwin",
      "bluesky": "https://bsky.app/profile/pngwn.at",
      "email": "hello@pngwn.io"
    },
    "portalToken": "eyJpZCI6IlJJZ0M1cjRUSjBoQ0dPenhIc3pjdlEiLCJzbHVnIjoicG5nd24iLCJleHAiOjE3OTUxOTM5MDA4ODN9.319aumPGIe2gV4R5cGlEqWEg",
    "portalTokenExpiresAt": "2026-11-20T16:58:20.883Z"
  },
  {
    "_id": "RIgC5r4TJ0hCGOzxHt4bCo",
    "title": "Ángel Sola Orbaiceta",
    "socials": {
      "github": "https://github.com/asoglovo",
      "linkedin": "https://www.linkedin.com/in/angelsolaorbaiceta/?originalSubdomain=es",
      "email": "angelsolaorbaiceta@gmail.com"
    },
    "portalToken": "eyJpZCI6IlJJZ0M1cjRUSjBoQ0dPenhIdDRiQ28iLCJzbHVnIjoiYW5nZWwtc29sYS1vcmJhaWNldGEiLCJleHAiOjE3OTUxOTM5MDA4ODN9.UM7kuWZR4gNbyARCbIfOgey0",
    "portalTokenExpiresAt": "2026-11-20T16:58:20.883Z"
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
        portalToken: p.portalToken,
        portalTokenExpiresAt: p.portalTokenExpiresAt,
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
  console.log(`✔ Synced enriched socials + portalToken for ${PATCHES.length} guests into Sanity (${PROJECT_ID}/${DATASET})`);
}

main().catch((err) => console.error(err));
