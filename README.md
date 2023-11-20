# News API

## Description 

This an API to mimic a backend service e.g. an online forum. It will be able to query a news database with node-postgres and respond with information from the database. Some of the technologies used include: Jest, Supertest, Express.

## Getting started

1. Fork repository
2. Clone repository 
3. Set up the project and install relevant packages: ```npm install```
4. Connect to the database - you will need to create two files: .env.test and .env.development. Add to each file ```PGDATABASE= <name_of_database>``` . The database name can be found in /db/setup.sql.