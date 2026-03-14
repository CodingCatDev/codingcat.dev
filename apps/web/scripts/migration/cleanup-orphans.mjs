import { createClient } from '@sanity/client';
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config();

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'dev',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_WRITE_TOKEN,
  useCdn: false,
});

const DRY_RUN = process.argv.includes('--dry-run');

async function main() {
  console.log(`\n🧹 Orphan Asset Cleanup${DRY_RUN ? ' (DRY RUN)' : ''}\n`);

  // 1. Load the current mapping to get the set of GOOD asset IDs
  const mapping = JSON.parse(fs.readFileSync('asset-mapping.json', 'utf-8'));
  const activeAssetIds = new Set(mapping.map(m => m.sanityAssetId));
  console.log(`Active assets (keep): ${activeAssetIds.size}`);

  // 2. Query ALL image and file assets from Sanity
  // Use pagination to handle large datasets
  let allAssets = [];
  let lastId = '';
  
  while (true) {
    const batch = await client.fetch(
      `*[_type in ["sanity.imageAsset", "sanity.fileAsset"] && _id > $lastId] | order(_id) [0...1000] { _id, _type, originalFilename, size }`,
      { lastId }
    );
    if (batch.length === 0) break;
    allAssets = allAssets.concat(batch);
    lastId = batch[batch.length - 1]._id;
    console.log(`  Fetched ${allAssets.length} assets so far...`);
  }
  
  console.log(`Total assets in Sanity: ${allAssets.length}`);

  // 3. Separate into mapped (active) and candidates for deletion
  const candidates = [];
  const keptByMapping = [];
  
  for (const asset of allAssets) {
    if (activeAssetIds.has(asset._id)) {
      keptByMapping.push(asset._id);
    } else {
      candidates.push(asset);
    }
  }
  
  console.log(`\nAssets in mapping (auto-keep): ${keptByMapping.length}`);
  console.log(`Candidates to check for references: ${candidates.length}`);

  // 4. Batch-check references for candidates
  // Query all non-asset documents that reference any asset, then build a set of referenced asset IDs
  console.log(`\nChecking which candidates are referenced by documents...`);
  
  // Get all asset IDs that are referenced by at least one non-asset document
  // We do this by querying documents (not assets) and extracting their asset references
  const referencedAssetIds = new Set();
  
  // Check in batches of 50 candidates at a time using parallel queries
  const BATCH_SIZE = 50;
  let checked = 0;
  
  for (let i = 0; i < candidates.length; i += BATCH_SIZE) {
    const batch = candidates.slice(i, i + BATCH_SIZE);
    const ids = batch.map(a => a._id);
    
    // For each batch, check which IDs have references
    const results = await Promise.all(
      ids.map(id => 
        client.fetch(`count(*[references($id)])`, { id })
          .then(count => ({ id, count }))
      )
    );
    
    for (const { id, count } of results) {
      if (count > 0) {
        referencedAssetIds.add(id);
      }
    }
    
    checked += batch.length;
    if (checked % 200 === 0 || checked === candidates.length) {
      console.log(`  Checked ${checked}/${candidates.length} candidates (${referencedAssetIds.size} referenced so far)...`);
    }
  }

  // 5. Build final orphan list
  const orphans = [];
  const kept = [...keptByMapping];
  
  for (const asset of candidates) {
    if (referencedAssetIds.has(asset._id)) {
      console.log(`  ⚠️ Keeping ${asset._id} — referenced by document(s)`);
      kept.push(asset._id);
    } else {
      orphans.push(asset);
    }
  }

  console.log(`\nOrphans to delete: ${orphans.length}`);
  console.log(`Assets to keep: ${kept.length}`);

  // 6. Delete orphans in batches
  if (orphans.length === 0) {
    console.log('No orphans found! 🎉');
    return;
  }

  if (DRY_RUN) {
    console.log('\n🔍 DRY RUN — would delete these orphans:');
    // Just show first 20
    for (const orphan of orphans.slice(0, 20)) {
      console.log(`  ${orphan._id} (${(orphan.size / 1024).toFixed(1)} KB)`);
    }
    if (orphans.length > 20) {
      console.log(`  ... and ${orphans.length - 20} more`);
    }
    const totalSize = orphans.reduce((sum, o) => sum + (o.size || 0), 0);
    console.log(`\nTotal space to reclaim: ${(totalSize / 1024 / 1024).toFixed(1)} MB`);
    return;
  }

  // Delete in batches of 100 using transactions
  const DEL_BATCH_SIZE = 100;
  let deleted = 0;
  
  for (let i = 0; i < orphans.length; i += DEL_BATCH_SIZE) {
    const batch = orphans.slice(i, i + DEL_BATCH_SIZE);
    const tx = client.transaction();
    
    for (const orphan of batch) {
      tx.delete(orphan._id);
    }
    
    try {
      await tx.commit();
      deleted += batch.length;
      console.log(`  Deleted ${deleted}/${orphans.length} orphans...`);
    } catch (err) {
      console.error(`  Error deleting batch: ${err.message}`);
      // Try one by one for this batch
      for (const orphan of batch) {
        try {
          await client.delete(orphan._id);
          deleted++;
        } catch (e) {
          console.error(`  Failed to delete ${orphan._id}: ${e.message}`);
        }
      }
    }
  }

  console.log(`\n✅ Deleted ${deleted} orphan assets`);
  const totalSize = orphans.reduce((sum, o) => sum + (o.size || 0), 0);
  console.log(`Space reclaimed: ${(totalSize / 1024 / 1024).toFixed(1)} MB`);
}

main().catch(console.error);
