package main

import (
    "context"
    "database/sql"
    "fmt"
    "log"
    "os"

    _ "github.com/mattn/go-sqlite3"
    "go.mongodb.org/mongo-driver/mongo"
    "go.mongodb.org/mongo-driver/mongo/options"
)

func main() {
    dbPath := os.Getenv("SQLITE_DB_PATH")
    if dbPath == "" {
        dbPath = "bible.db"
    }
    book := os.Getenv("BOOK")
    chapter := os.Getenv("CHAPTER")
    if book == "" || chapter == "" {
        log.Println("BOOK and CHAPTER env vars required to query scriptures")
    }
    // open SQLite database
    db, err := sql.Open("sqlite3", dbPath)
    if err != nil {
        log.Fatalf("failed to open SQLite db: %v", err)
    }
    defer db.Close()

    var verses []string
    if book != "" && chapter != "" {
        rows, err := db.Query(`SELECT verse_num, verse_text FROM verses WHERE book_name=? AND chapter_num=? ORDER BY verse_num`, book, chapter)
        if err != nil {
            log.Fatalf("query verses: %v", err)
        }
        defer rows.Close()
        for rows.Next() {
            var num int
            var text string
            if err := rows.Scan(&num, &text); err != nil {
                log.Fatalf("scan verse: %v", err)
            }
            verses = append(verses, fmt.Sprintf("%d %s", num, text))
        }
        if len(verses) == 0 {
            log.Println("no verses found")
        } else {
            log.Println("scriptures:")
            for _, v := range verses {
                log.Println(v)
            }
        }
    }

    mongoURI := os.Getenv("MONGO_URI")
    mongoDB := os.Getenv("MONGO_DB")
    notesCollection := os.Getenv("MONGO_NOTES_COLLECTION")
    if mongoURI == "" || mongoDB == "" || notesCollection == "" {
        log.Println("MONGO_URI, MONGO_DB and MONGO_NOTES_COLLECTION env vars must be set for notes")
        return
    }
    client, err := mongo.Connect(context.Background(), options.Client().ApplyURI(mongoURI))
    if err != nil {
        log.Fatalf("connect mongo: %v", err)
    }
    defer client.Disconnect(context.Background())

    coll := client.Database(mongoDB).Collection(notesCollection)
    cur, err := coll.Find(context.Background(), struct{}{})
    if err != nil {
        log.Fatalf("find notes: %v", err)
    }
    defer cur.Close(context.Background())

    log.Println("notes:")
    found := false
    for cur.Next(context.Background()) {
        var note struct{ Text string `bson:"text"` }
        if err := cur.Decode(&note); err != nil {
            log.Fatalf("decode note: %v", err)
        }
        log.Println("-", note.Text)
        found = true
    }
    if !found {
        log.Println("no notes found")
    }
}
