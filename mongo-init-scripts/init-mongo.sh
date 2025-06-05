#!/bin/bash
set -e

# Wait for MongoDB to be ready
until mongosh --eval "print('Waiting for MongoDB connection...')"; do
  sleep 1
done

# Execute the JavaScript initialization file
mongosh --host localhost \
  --username root \
  --password example \
  --authenticationDatabase admin \
  /docker-entrypoint-initdb.d/init-mongo.js
