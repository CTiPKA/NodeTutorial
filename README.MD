# Node.js Tutorial

Simple Node.js/MongoDB Web Service for an iOS App

## Adding new items to MongoDB

curl -H "Content-Type: application/json" -X POST -d '{"title":"Hello World"}' http://localhost:3000/{collectionName}

## Updating

curl -H "Content-Type: application/json" -X PUT -d '{"title":"Good Golly Miss Molly"}' http://localhost:3000/{collectionName}/{_id}

## Deleting

curl -H "Content-Type: application/json" -X DELETE http://localhost:3000/{collectionName}/{_id}
