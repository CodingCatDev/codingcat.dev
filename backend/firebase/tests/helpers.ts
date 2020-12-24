import {
  loadFirestoreRules,
  initializeTestApp,
  clearFirestoreData,
  initializeAdminApp,
} from '@firebase/rules-unit-testing';
import firebase from 'firebase/app';
import { readFileSync } from 'fs';
const serviceAccountKeyFile = readFileSync('../serviceAccountKey.json', 'utf8');
const serviceAccountKey = JSON.parse(serviceAccountKeyFile);

export async function setup(auth: any, data: any) {
  const projectId = serviceAccountKey.project_id;
  const app = initializeTestApp({
    projectId,
    auth,
  });

  const db = app.firestore();

  // Write mock documents before rules
  if (data) {
    const admin = initializeAdminApp({
      projectId,
    });

    for (const key in data) {
      const ref = admin.firestore().doc(key);
      await ref.set(data[key]);
    }
  }

  // Apply rules
  await loadFirestoreRules({
    projectId,
    rules: readFileSync('../firestore.rules', 'utf8'),
  });

  return db;
}

export async function teardown() {
  Promise.all(firebase.apps.map((app) => app.delete()));
  await clearFirestoreData({ projectId: serviceAccountKey.project_id });
}
