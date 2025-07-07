# My Bible App

This project contains a Vite based React frontend and a simple Express backend.

## Getting Started

1. Install dependencies for the frontend:
   ```bash
   npm install
   ```

2. Install backend dependencies:
   ```bash
   cd backend
   npm install
   cd ..
   ```

3. Copy the example environment files and fill in the required values:
   ```bash
   cp src/.env.example src/.env
   cp backend/.env.example backend/.env
   ```
   After copying, open these files and replace the placeholder values with your own credentials. These `.env` files contain your secrets, so keep them safe.

   The following environment variables are required:

   - **Twilio**: `TWILIO_VERIFY`, `TWILIO_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_PHONE_NUMBER`
   - **Database**: `DATABASE_URL` (use your Supabase pooled connection string, e.g.
     `postgresql://<username>:<password>@aws-0-us-east-2.pooler.supabase.com:6543/postgres?pgbouncer=true&statement_cache_size=0`)
   - **API.Bible**: `BIBLE_API_KEY`
   - **Supabase**: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`
   - **Plasmic**: `PLASMIC_PROJECT_ID`, `PLASMIC_PUBLIC_TOKEN`

## Running the Project

Start the Vite dev server:
```bash
npm run dev
```
The server runs on port `5173` by default.
Requests starting with `/api` are automatically proxied to the
backend server at `http://localhost:5000`.

In another terminal, start the backend API:
```bash
cd backend
npm start
```
The backend listens on the port specified in `backend/.env` (default `5000`).

The backend now validates that `TWILIO_SID`, `TWILIO_AUTH_TOKEN` and
`TWILIO_VERIFY` are set before it loads any routes. If any of these
variables are missing, the server logs an error and exits immediately so
configuration issues are caught right away.


## Running Backend Tests

Jest is used for unit testing the backend utilities. To run the tests:

```bash
cd backend
npm test
```

This executes all specs in `backend/test/` and verifies that phone numbers are
normalized correctly.

## Go Example for SQLite and MongoDB

A small Go program is provided in [`go-example/`](go-example/) for retrieving scriptures from a SQLite database and logging notes stored in MongoDB. Follow these steps to try it out:

1. Ensure Go 1.20+ is installed.
2. Set the required environment variables as described in [`go-example/README.md`](go-example/README.md). At minimum you must specify `BOOK`, `CHAPTER`, `MONGO_URI`, `MONGO_DB` and `MONGO_NOTES_COLLECTION`.
3. From the `go-example` directory, run:

```bash
cd go-example
go run .
```

The program logs the verses and notes it retrieves. If nothing is returned, you will see `no verses found` or `no notes found` in the output which helps confirm the queries executed.
