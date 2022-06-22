# How to X?

## How to create a new entity?

-   Define your entity fields in `models/interfaces` using a Typescript interface. This will serve as your plain object for manipulating data of your entity type. We'll consider it to be named `interface Entity` in our example.
-   Now you have to create a database model for your entity. You have to implement the following interfaces and objects in `models/odms` (Object Data Models):
    -   `interface EntityDocument extends Entity, Document`: allows interacting with a specific DB object (a row if we were in a relational db). You can declare custom functions here.
    -   `interface EntityModel extends Model<EntityDocument>`: allows interacting with the entire collection (a table if we were in a relational db).
    -   `EntitySchema = new Schema({...})`: define field types and constraints using Mongoose syntax
    -   `EntityODM = model<EntityDocument, EntityModel>('Entity', EntitySchema)`: final abstraction, declares the collection name, specifies the schema. You will export this object and use it to do queries to the database.

You can find examples of how an entity should be created in `models/interfaces/user.ts` and `models/odms/user.ts`. You can also see custom functions and hooks implemented.

## How to create an API endpoint for my entity?

-   Create a controller file for your entity (if it does not already exist) in `controllers/` and export a router from it (don't forget to register the controller in `controllers/index.ts`)
-   Define your endpoint as a normal Express route
-   If you need authentication you can use the two helper middlewares from `auth/` like this:
    -   `authenticatedWithRole([... list of roles ...])`: requires the user to be authenticated and checks if they have the required role.
    -   `authenticated`: requires the user to be authenticated, all roles allowed
-   If you need to receive and parse parameters define your DTO (Data Transfer Object) inside `models/dtos`
-   Use JOI syntax to enforce validation for your data (for example min-max ranges, length, non-null, type, etc.)
-   After defining your DTO and JOI validator schema, add `validator` middleware to your route (for example `validator.body(BodySchemaForYourRoute)`) and change the type of the request to `ValidatedRequest<YourDTOForRoute>` so you benefit of Typescript type checking.
-   You can use your `ODM` from `models` to access the database.
-   The current authenticated user is in `req.user` (unfortunately you have to check for null even if you know the request is authenticated, Typescript bug :( )
-   Please use helpers from `utils/contracts` like `checkContract`, `nonNullContract`, `Implication`, etc. to make assertions and test pre and post conditions. It's shorter and clener. You can also define your own helpers.
-   Please use `ControllerError` with the appropiate status code when throwing exceptions or using contracts. (example. Send a NOT FOUND status when you can't find an entity, don't simply throw because it will return a SERVER INTERNAL ERROR to the client which is misleading)
-   Return your response as JSON.

## What the heck are contracts?

An abstraction for `if (is not valid) throw exception`.

## Should I decouple my business logic from the cotroller?

If you controller is more than a few lines long, yes. Consider decoupling your business logic and place it in the folder `services/` (empty for the initial project). It is easier to test and integrate complex business logic if it does not depended on the controller context (ie. depending on request body, authenticated user, and so on and so on).

## Notes

Please use async/await and not callbacks. If you would like to write tests for your business logic is even better. Don't forget to `npm run lint-check` before commiting!
