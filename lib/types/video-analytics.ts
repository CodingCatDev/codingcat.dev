export interface VideoAnalytics {
  _id: string;
  _type: 'videoAnalytics';
  _createdAt: string;
  _updatedAt: string;
  contentRef: {
    _type: 'reference';
    _ref: string;
  };
  contentType: 'post' | 'podcast' | 'automatedVideo';
  youtubeId: string;
  youtubeShortId?: string;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  favoriteCount: number;
  lastFetchedAt?: string;
}
