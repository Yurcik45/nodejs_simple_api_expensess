CREATE TABLE IF NOT EXISTS categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL
);

CREATE TABLE IF NOT EXISTS expenses (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  sum INTEGER NOT NULL,
  category VARCHAR(50) NOT NULL,
  description VARCHAR(100)
);

CREATE TABLE IF NOT EXISTS benefits (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  sum INTEGER NOT NULL,
  category VARCHAR(50) NOT NULL,
  description VARCHAR(100)
);
