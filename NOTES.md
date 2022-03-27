# NOTES

## firestore v9

- `collection in collection` (subcollection) vs `arrray in collection` => `channel` has `messages`
- get subcollection: `collection(db, "channels", channelId, "messages")`

## firebase vs firestore

- firebase:
  - simple, limited queries
  - key-value db
  - use case: who is online
- firestore
  - more complex, queries
  - document db
