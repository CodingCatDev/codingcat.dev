export const getCloudinaryPublicId = (cover: string): string => {
  let coverPublicId = '';

  const domains = [
    'main-codingcatdev-photo',
    'ccd-cloudinary',
    'dev-codingcatdev-photo',
  ];

  if (!domains.some((d) => cover?.includes(d))) {
    return coverPublicId;
  }

  const coverSegments = cover?.split('/');

  for (let i = coverSegments?.length; i--; i === 0) {
    const segment = coverSegments.at(i);
    if (
      segment &&
      [
        'main-codingcatdev-photo',
        'ccd-cloudinary',
        'dev-codingcatdev-photo',
      ].includes(segment)
    ) {
      coverPublicId = `/${segment}/${coverPublicId}`;
      break;
    }
    coverPublicId = `${segment}${coverPublicId ? '/' : ''}${coverPublicId}`;
  }
  return coverPublicId;
};
