// Initialize MongoDB with users and collections
print('Starting MongoDB initialization...');

// Wait for MongoDB to be ready
db = db.getSiblingDB('admin');
db.auth('root', 'example');

// Create the ancestry_chain database and user
print('Creating database and user...');
db = db.getSiblingDB('ancestrychain');

// Create application user with appropriate permissions
db.createUser({
  user: 'appuser',
  pwd: 'apppassword',
  roles: [
    { role: 'readWrite', db: 'ancestrychain' },
    { role: 'dbAdmin', db: 'ancestrychain' }
  ]
});

// Create collections
print('Creating collections...');
const collections = [
  'users',
  'gedcom_files',
  'verification_records',
  'payments',
  'nfts',
  'storage_records',
  'zkp_proofs'
];

collections.forEach(collection => {
  if (!db.getCollectionNames().includes(collection)) {
    db.createCollection(collection);
    print(`Created collection: ${collection}`);
  } else {
    print(`Collection already exists: ${collection}`);
  }
});

// Create indexes
print('Creating indexes...');
db.users.createIndex({ "email": 1 }, { unique: true });
db.gedcom_files.createIndex({ "userId": 1 });
db.verification_records.createIndex({ "gedcomFileId": 1 });
db.payments.createIndex({ "userId": 1 });
db.payments.createIndex({ "status": 1 });
db.nfts.createIndex({ "ownerId": 1 });
db.storage_records.createIndex({ "userId": 1 });
db.zkp_proofs.createIndex({ "userId": 1 });

print('MongoDB initialization completed successfully!');
