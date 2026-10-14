CREATE TABLE IF NOT EXISTS oauth_debug_log (
	id TEXT PRIMARY KEY,
	createdAt INTEGER NOT NULL,
	method TEXT NOT NULL,
	path TEXT NOT NULL,
	query TEXT,
	headers TEXT,
	requestBody TEXT,
	responseStatus INTEGER,
	responseBody TEXT
);
