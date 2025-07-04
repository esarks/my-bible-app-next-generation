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
   After copying, open these files and replace the placeholder values with your own credentials. The `.env` files are ignored by git thanks to the `.env` entry in `.gitignore`.

   The following environment variables are required:

   - **Twilio**: `TWILIO_VERIFY`, `TWILIO_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_PHONE_NUMBER`
   - **Database**: `DATABASE_URL` (e.g. your Supabase connection string)
   - **API.Bible**: `BIBLE_API_KEY`
   - **Supabase**: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`
   - **Plasmic**: `PLASMIC_PROJECT_ID`, `PLASMIC_PUBLIC_TOKEN`

## Running the Project

Start the Vite dev server:
```bash
npm run dev
```
The server runs on port `5173` by default.

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
