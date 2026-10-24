# CodingCat.dev Reddit Devvit Auto-Poster (`r/CodingCatDev`)

This Reddit Devvit app runs inside Reddit's own infrastructure (`@devvit/public-api`) so **it does not require external Reddit Data API approval**.

## What It Does
1. **Polls Sanity (`production`) every 30 minutes** via `Devvit.addSchedulerJob` (or on-demand via the subreddit moderator menu item **"Sync Latest from CodingCat.dev Now"**).
2. **YouTube-First Native Player**:
   - When a post or podcast has a `youtube` URL in Sanity, it submits the `https://www.youtube.com/watch?v=<id>` URL as the Reddit Link Post so Reddit renders the **native inline YouTube player** right in the `r/CodingCatDev` feed.
   - Automatically adds a pinned moderator comment containing the excerpt, the canonical `https://codingcat.dev/post/<slug>` guide + transcript link, and a direct YouTube subscribe link (`?sub_confirmation=1`).
3. **Automatic Sanity Link Tracking**:
   - When `sanityWriteToken` is configured in the app's installation settings, it automatically creates `syndication.<docId>.reddit` and populates the `reddit` URL field on the Sanity document.

## 2-Command Setup & Deployment

```bash
cd apps/reddit-devvit
npx devvit login
npx devvit upload
npx devvit install r/CodingCatDev
```

*(Optional)* After installing on `r/CodingCatDev`, open `https://developers.reddit.com/r/CodingCatDev/apps/codingcat-syndicator` and paste your `SANITY_API_WRITE_TOKEN` into the **Sanity API Write Token** field so every Reddit post URL is automatically saved back to Sanity.
