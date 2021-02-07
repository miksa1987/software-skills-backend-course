### BMV2 REST API

This is a workout generator API, which will be used to power a random workout app in the future.

## Current features:

- Can create user
- Can create exercises
- Can create exercise groups
- Can generate workouts with given parameters

## The stack

- TypeScript
- Express
- MongoDB with mongoose

## Getting started

For now, the API can only be forked and run locally. Follow these simple steps:

- Clone the repository
- Set up a MongoDB instance or MongoDB Atlas account and enter it's connection string to .env file. See .env.example for exacts keys. Also enter a random secret string for token generation. Finally, you can specify a custom port by PORT environment variable.
- Run npm install
- Run npm start, and the API will be available at http://localhost:PORT, by default the port is 4000.
- Add some exercise groups and exercises to the database before trying to get a random workout. See requests in the Postman collection.

## Making requests

I recommend Postman for making requests to the API. Please open routes.postman_collection.json in Postman for example requests.
User related requests are unfortunately not included in the collection yet, as I feel they are rather pointless. Instead, for now user routes serve the purpose to demonstrate very simple user creation and authorization.

## TBD

- Tweakable workout parameters from env.
- More intelligent algorithm for workout creation.
- More robust user authentication, maybe with Google.
- Admin account type for adding data.
- A practice app with Flutter to use this in a user friendly way.
- Deploy the API
