-- schema.sql

-- Table: UserProfile
CREATE TABLE "UserProfile" (
  id UUID PRIMARY KEY,
  phoneNumber TEXT NOT NULL,
  name TEXT,
  email TEXT,
  emailVerified BOOLEAN DEFAULT FALSE
);

-- Table: Note
CREATE TABLE "Note" (
  id UUID PRIMARY KEY,
  loginId TEXT NOT NULL,
  book TEXT NOT NULL,
  chapter INT,
  verse INT,
  content TEXT NOT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
