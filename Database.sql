DROP DATABASE foodfy;
CREATE DATABASE foodfy;

DROP SCHEMA public CASCADE;
CREATE SCHEMA public;

CREATE TABLE files (
  id SERIAL PRIMARY KEY,
  name TEXT,
  path TEXT not null
);

CREATE TABLE chefs (
  id SERIAL PRIMARY KEY not null,
  name TEXT,
  file_id INTEGER REFERENCES files(id),
  created_at timestamp DEFAULT 'now()',
  updated_at timestamp DEFAULT 'now()'
);

CREATE TABLE recipes (
	id SERIAL primary key not null,
  chef_id integer null,
  user_id integer,
	title text,
	ingredients text[],
	preparation text[],
	information text,
	created_at timestamp DEFAULT 'now()',
  updated_at timestamp DEFAULT 'now()'
);

CREATE TABLE recipe_files (
  id SERIAL PRIMARY KEY,
  recipe_id INTEGER REFERENCES recipes(id),
  file_id INTEGER REFERENCES files(id)
);

CREATE TABLE users (
	id SERIAL PRIMARY KEY NOT NULL,
	name TEXT NOT NULL,
	email TEXT UNIQUE NOT NULL,
	password TEXT NOT NULL,
	reset_token TEXT,
	reset_token_expires TEXT,
	is_admin BOOLEAN DEFAULT false,
	created_at TIMESTAMP DEFAULT(now()),
	updated_at TIMESTAMP DEFAULT(now())
);

ALTER TABLE "recipes" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id");

-- Trigger para atualizar o campo updated_at em chefs e recipes

CREATE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
	NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_timestamp
BEFORE UPDATE ON chefs
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();

CREATE TRIGGER set_timestamp
BEFORE UPDATE ON recipes
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();

-- Trigger para atualizar o campo created_at em chefs e recipes

CREATE FUNCTION trigger_set_timestamp_created()
RETURNS TRIGGER AS $$
BEGIN
	NEW.created_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;


CREATE TRIGGER set_timestamp_created
BEFORE INSERT ON recipes
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp_created();

CREATE TRIGGER set_timestamp_created
BEFORE INSERT ON chefs
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp_created();

-- connect pg simple table
CREATE TABLE "session" (
  "sid" varchar NOT NULL COLLATE "default",
  "sess" json NOT NULL,
  "expire" timestamp(6) NOT NULL
)
WITH (OIDS=FALSE);
ALTER TABLE "session" ADD CONSTRAINT "session_key" PRIMARY KEY ("sid") NOT DEFERRABLE INITIALLY IMMEDIATE;