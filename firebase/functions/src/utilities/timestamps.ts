import * as admin from 'firebase-admin';

/* Utilities */
export function cleanTimestamp(data: FirebaseFirestore.DocumentData) {
  const docData = { ...data };
  Object.keys(docData).map((key) => {
    if (
      typeof docData[key] === 'object' &&
      Object.keys(docData[key]).includes('_nanoseconds')
    ) {
      const timestamp: admin.firestore.Timestamp = docData[key];
      docData[key] = timestamp.toMillis();
    } else {
      docData[key] = docData[key];
    }
  });
  return docData;
}
