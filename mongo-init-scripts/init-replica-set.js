// Configuration for MongoDB replica set
// This script should be run after the database is initialized

// Wait for MongoDB to start up
print("Waiting for MongoDB to start up...");
sleep(10000);

// Connect with admin privileges
print("Connecting to MongoDB...");
db = db.getSiblingDB('admin');

// Authenticate as admin user
db.auth(process.env.MONGO_INITDB_ROOT_USERNAME, process.env.MONGO_INITDB_ROOT_PASSWORD);

// Check if replica set is already initialized
print("Checking replica set status...");
var status = rs.status();

if (status.ok) {
    print("Replica set is already initialized. Status:");
    printjson(status);
    quit(0);
}

// Configure replica set
print("Initializing replica set...");
var config = {
    _id: "rs0",
    version: 1,
    members: [
        { _id: 0, host: "mongodb:27017", priority: 1 }
    ]
};

// Initialize replica set
rs.initiate(config);

// Wait for replica set to initialize
print("Waiting for replica set to initialize...");
sleep(5000);

// Check replica set status
status = rs.status();
printjson(status);

if (status.ok) {
    print("Replica set successfully initialized!");
} else {
    print("Failed to initialize replica set. Check MongoDB logs for details.");
    quit(1);
}

// In a production environment, you would add secondary nodes here
// For example:
// rs.add("mongodb-secondary-1:27017");
// rs.add("mongodb-secondary-2:27017");

print("Replica set configuration complete!");
