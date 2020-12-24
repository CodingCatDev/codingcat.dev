import serviceAccountKey from '../../serviceAccountKey.json';
import { backups, initializeApp } from 'firestore-export-import';
import fs from 'fs';
import path from 'path';
const dirPath = path.join(__dirname, '../data/firestore-backup.json');

initializeApp(serviceAccountKey);

console.log('Fetching Collections');
backups() // ['posts', 'profiles', 'users'] Array of collection's name is OPTIONAL
  .then((collections) => {
    fs.writeFileSync(dirPath, JSON.stringify(collections));
  });
