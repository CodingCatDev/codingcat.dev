export const getCloudinaryPublicId = (coverSegments: string[]): string => {
  let coverPublicId = '';
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
