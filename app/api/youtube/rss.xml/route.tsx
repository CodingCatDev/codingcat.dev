export const dynamic = "force-dynamic"; // defaults to auto

import { Feed } from 'feed';

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY as string;
const CHANNEL_ID = process.env.YOUTUBE_CHANNEL_ID as string;

interface PlaylistItem {
  id: string;
  snippet: {
    title: string;
    description: string;
  };
}

interface PlaylistItemsResponse {
  items: {
    snippet: {
      title: string;
      description: string;
      resourceId: {
        videoId: string;
      };
      publishedAt: string;
    };
  }[];
  nextPageToken?: string;
}

async function fetchPodcastPlaylists(channelId: string): Promise<PlaylistItem[]> {
  const url = `https://www.googleapis.com/youtube/v3/playlists?key=${YOUTUBE_API_KEY}&channelId=${channelId}&part=snippet&maxResults=50`;
  const response = await fetch(url);
  const data = await response.json();
  return data.items.filter((playlist: PlaylistItem) => 
    playlist.snippet.title.toLowerCase().includes('podcast') ||
    playlist.snippet.description.toLowerCase().includes('podcast')
  );
}

async function fetchPlaylistItems(playlistId: string, pageToken: string = ''): Promise<PlaylistItemsResponse> {
  const url = `https://www.googleapis.com/youtube/v3/playlistItems?key=${YOUTUBE_API_KEY}&playlistId=${playlistId}&part=snippet&maxResults=50${pageToken ? `&pageToken=${pageToken}` : ''}`;
  const response = await fetch(url);
  return response.json();
}

export async function GET() {
  try {
    const feed = new Feed({
      title: 'YouTube Channel Podcast Feed',
      description: 'Latest podcast episodes from the YouTube channel',
      id: `https://www.youtube.com/channel/${CHANNEL_ID}`,
      link: `https://www.youtube.com/channel/${CHANNEL_ID}`,
      language: 'en',
      image: 'https://www.youtube.com/img/desktop/yt_1200.png',
      favicon: 'https://www.youtube.com/favicon.ico',
      copyright: `All rights reserved ${new Date().getFullYear()}, YouTube`,
      updated: new Date(),
      generator: 'Next.js using Feed for Node.js',
      feedLinks: {
        json: `${process.env.NEXT_PUBLIC_BASE_URL}/api/podcast-feed`,
        atom: `${process.env.NEXT_PUBLIC_BASE_URL}/api/podcast-feed?format=atom`,
      },
    });

    const podcastPlaylists = await fetchPodcastPlaylists(CHANNEL_ID);

    for (const playlist of podcastPlaylists) {
      let pageToken: string | undefined = '';
      do {
        const data = await fetchPlaylistItems(playlist.id, pageToken);
        
        data.items.forEach(item => {
          feed.addItem({
            title: item.snippet.title,
            content: item.snippet.description || '',
            link: `https://www.youtube.com/watch?v=${item.snippet.resourceId.videoId}`,
            description: item.snippet.description,
            image: `https://img.youtube.com/vi/${item.snippet.resourceId.videoId}/maxresdefault.jpg`,
            date: new Date(item.snippet.publishedAt),
            id: item.snippet.resourceId.videoId,
          });
        });

        pageToken = data.nextPageToken;
      } while (pageToken);
    }

  return new Response(feed.rss2(), {
    headers: {
      "content-type": "text/xml",
      "cache-control": "max-age=0, s-maxage=3600",
    },
  });

  } catch (error) {
    console.error('Error generating podcast feed:', error);
    return Response.json({ error: 'Error generating podcast feed' }, { status: 500 });
  }
}
