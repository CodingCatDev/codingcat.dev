import firebase from 'firebase/app';

export const millisecondToDate = (
  mill: firebase.firestore.Timestamp | number | undefined
): Date => {
  if (typeof mill === 'number') {
    return new Date(mill);
  } else {
    return new Date();
  }
};

export const millisecondToUSFormat = (
  mill: firebase.firestore.Timestamp | number | undefined
): string => {
  const date = millisecondToDate(mill);
  return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
};
