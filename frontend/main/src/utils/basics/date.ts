export const millisecondToDate = (mill: string | number | Date): string => {
  const date = new Date(mill);
  return new Intl.DateTimeFormat('en-US', { dateStyle: 'full' }).format(date);
};

export const millisecondToUSFormat = (mill: string | number | Date): string => {
  return millisecondToDate(mill);
};
