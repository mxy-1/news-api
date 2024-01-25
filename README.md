# NC News API

## Description 

This API can query a news database with node-postgres to perform CRUD operations. Some of the technologies used for creating this API include: Jest for testing, Supertest for testing HTTP, and Express for handling requests and middleware.

## Usage

Visit the hosted API and see the available endpoints at: https://news-api-3trz.onrender.com/api/. Add the relevant path to see the responses.

## Requirements 
- Node.js version 8.00 or above. For the latest version, visit: https://nodejs.org/en/
- PostgreSQL version 14.9 or above. For the latest version, visit: https://www.postgresql.org/

For any versions below the suggested requirements, features may not work as intended.

## Getting started

1. Clone the repository ```git clone https://github.com/mxy-1/news-api.git```
2. Set up the project and install the relevant packages: ```npm install```
3. Connect to the database - you will need to create two files: .env.test and .env.development. Add to each file: ```PGDATABASE= <name_of_database>```. The database name can be found in /db/setup.sql
4. Create the database: ```npm run setup-dbs```
5. Seed the database: ```npm run seed```
6. To run the tests: ```npm test app.test.js```
