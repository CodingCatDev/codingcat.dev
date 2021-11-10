export const wrapTitleWords = (title: string, maxLettersPerLine: number) => {
  let breakPoint = 0;
  for (let i = 0; i < title.length; i++) {
    const letter = title[i];
    if (letter === ' ') {
      breakPoint = i;
    }
    if (i >= maxLettersPerLine) {
      break;
    }
  }
  const firstLine = title.substring(0, breakPoint);
  const secondLine = title.substring(breakPoint);
  return [firstLine, secondLine];
};
