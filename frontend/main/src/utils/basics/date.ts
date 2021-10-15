import { Timestamp } from 'firebase/firestore';

export const millisecondToDate = (
  mill: Timestamp | number | undefined
): Date => {
  if (typeof mill === 'number') {
    return new Date(mill);
  } else {
    return new Date();
  }
};

export const millisecondToUSFormat = (
  mill: Timestamp | number | undefined
): string => {
  const date = millisecondToDate(mill);
  return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
};
