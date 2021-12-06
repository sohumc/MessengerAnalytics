DROP TABLE IF EXISTS conversations;
DROP TABLE IF EXISTS messages;

CREATE TABLE conversations (
  id TEXT PRIMARY KEY ,
  title TEXT NOT NULL,
  participants TEXT NOT NULL
);

CREATE TABLE messages (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  conversation_id TEXT NOT NULL,
  sender TEXT,
  timestamp TIMESTAMP NOT NULL,
  content TEXT,
  gifs TEXT,
  photos TEXT,
  share TEXT,
  audio TEXT,
  video TEXT,
  FOREIGN KEY (conversation_id) REFERENCES conversations (id)
);
