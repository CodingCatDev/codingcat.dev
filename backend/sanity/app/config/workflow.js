export const types = [
  'course',
  'page',
  'podcast',
  'post',
  'site',
  'tutorial',
  'lesson',
];

export const states = [
  { id: 'draft', title: 'Draft' },
  { id: 'inReview', title: 'In review', color: 'warning' },
  { id: 'approved', title: 'Approved', color: 'success' },
  { id: 'changesRequested', title: 'Changes requested', color: 'warning' },
  { id: 'published', title: 'Published', color: 'success' },
];
