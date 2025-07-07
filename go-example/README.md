# Go Example: Querying Scriptures and Notes

This directory contains a simple Go program that demonstrates how to retrieve Bible verses from a SQLite database and notes from a MongoDB collection. The results are logged to the console.

## Requirements

- Go 1.20 or newer
- A SQLite database file containing a `verses` table with `book_name`, `chapter_num`, `verse_num` and `verse_text` columns
- Access to a MongoDB instance containing a `notes` collection

## Environment Variables

| Variable | Description |
|----------|-------------|
| `SQLITE_DB_PATH` | Path to the SQLite Bible database (defaults to `bible.db` in the current directory) |
| `BOOK` | Book name to query, e.g. `John` |
| `CHAPTER` | Chapter number to query |
| `MONGO_URI` | Connection URI for MongoDB |
| `MONGO_DB` | Name of the MongoDB database |
| `MONGO_NOTES_COLLECTION` | Name of the collection containing notes |

## Running the Example

1. Set the required environment variables. At a minimum `BOOK`, `CHAPTER`, `MONGO_URI`, `MONGO_DB` and `MONGO_NOTES_COLLECTION` must be provided. Optionally set `SQLITE_DB_PATH` if your database is not `bible.db`.

2. Run the program:

```bash
cd go-example
go run .
```

3. The program will log the scriptures for the specified book and chapter as well as all notes from the MongoDB collection.

If no results are found, the program will log `no verses found` or `no notes found` so that you can verify the queries executed successfully.
