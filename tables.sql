

CREATE TABLE IF NOT EXISTS expensess (
  id SERIAL PRIMARY KEY,
  name VARCAHR(100) NOT NULL,
  sum INTEGER NOT NULL,
  category VARCHAR(50) NOT NULL,
  description VARCHAR(100)
)

CREATE TABLE IF NOT EXISTS benefits (
  id SERIAL PRIMARY KEY,
  name VARCAHR(100) NOT NULL,
  sum INTEGER NOT NULL,
  category VARCHAR(50) NOT NULL,
  description VARCHAR(100)
)
