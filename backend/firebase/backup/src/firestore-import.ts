import serviceAccountKey from '../../serviceAccountKey.json';
import { initializeApp, restore } from 'firestore-export-import';
import fs from 'fs';
import path from 'path';
const dirPath = path.join(__dirname, '../data/firestore-backup.json');

initializeApp(serviceAccountKey);

console.log('Importing Collections');
restore(dirPath, { autoParseDates: true }).then((collections) => {
  fs.writeFileSync(dirPath, JSON.stringify(collections));
});
