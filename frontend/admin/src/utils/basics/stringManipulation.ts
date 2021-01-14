export const toKebabCase = (str: string) => {
  if (!str) {
    return '';
  } else {
    const stringCopy = (' ' + str).slice(1);

    const match = stringCopy.match(
      /[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g
    );
    if (!match) {
      return '';
    }
    return match.map((x) => x.toLowerCase()).join('-');
  }
};
