# Goodwin Backend Exercise

![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB) ![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white) ![Postgres](https://img.shields.io/badge/postgres-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white)

The backend exercise utilizes Express and Node.js.  Additionally, PostgreSQL will be a part of the exercise. 

There are many different solutions to the exercise, and candidates are encouraged to use any tooling or scaffolding to complete the exercise.

# Setup

-  The exercise requires [Node.js to be installed.](https://nodejs.org/en/download)  We recommend using the LTS version.
-  For your database, you can use [Docker](https://hub.docker.com/_/postgres) or install [PostgreSQL locally](https://www.postgresql.org/download/).  We recommend version 15.
-  Once you have installed Node.js and PostgreSQL, install `yarn` with `npm i -g yarn`.
-  Navigate to the root of this repository and run `yarn install`.
-  In the `./database` directory, run the initial_migration script against your Postgres database.
-  Copy the `.env.example` file to `.env.local` and set up your environment variables.

# Exercise

Using the handler pattern provided with the healthcheck endpoint, setup 
**two additional endpoints** to fetch data about the flights from the 
database seed file. 

You can use any data access patterns, packages or other tools to fetch and 
return the data.  Commonly used packages include `pg-node` for database 
access and `zod` for request validation.

To start the application and hot-reload run:

```
$ yarn start:watch
```

### Flight Summary Endpoint

Create an endpoint that returns a summary listing of flights.  Take into 
consideration scalability, as the flights table will grow over time when new 
flights are captured.  Utilize pagination and return a slim payload that 
includes the tail number, the origin and destination.

Return the summary in a way that informs the client of it's position within 
the listings.  Include a root element of items for the client to display.

### Flight Detail Endpoint

Create an additional endpoint that retrieves the details for a flight.  Determine the 
flight's status using the following formula:

```
-  If (actual_runway_departure_time == null), then the flight has not departed yet.
-  If (actual_runway_departure_time != null && actual_runway_arrival_time == null), then the flight is currently en route.
-  If (actual_runway_departure_time != null && actual_runway_arrival_time != null && actual_runway_departure_time != actual_runway_arrival_time), then the flight has arrived.
-  If (actual_runway_departure_time != null && actual_runway_arrival_time != null && actual_runway_departure_time == actual_runway_arrival_time), then the flight result is unknown and has probably arrived but we don't have an arrival confirmation.
```

# Completion

When your solution is ready, build a production bundle by running:

```
$ yarn build
```

To test your production solution run:

```
$ yarn start
```

Upon completion, your project should build using the Typescript compiler, 
and be able to run in Javascript.  Create a pull request to this repository.
