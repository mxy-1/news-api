# News API

## Description 

This an API to mimic a backend service e.g. an online forum. It can query a news database with node-postgres to create, read, update or delete information from the database. Some of the technologies used for creating this API include: Jest for testing, Supertest for testing HTTP, and Express for handling requests and middleware.

## Usage

Visit the hosted API and see the available endpoints at: https://news-api-3trz.onrender.com/api/. Add the relevant path to see the responses.

## Requirements 
- Node.js version 8.00 or above. For the latest version, visit: https://nodejs.org/en/
- PostgreSQL version 14.9 or above. For the latest version, visit: https://www.postgresql.org/

For any versions below the suggested requirements, features may not work as intended.

## Getting started

1. Clone the repository 
2. Set up the project and install the relevant packages: ```npm install```
3. Connect to the database - you will need to create two files: .env.test and .env.development. Add to each file: ```PGDATABASE= <name_of_database>```. The database name can be found in /db/setup.sql
4. Seed the database: ```npm run seed```
5. To run the tests: ```npm test app.test.js```
