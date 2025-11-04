# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

## Instructions for Swagger documentation:

The documentation is created for each HTTP request made in the backend.
The index.js file includes the initialization for the Swagger REST documentation.
If a user creates a new .js file containing HTTP requests and wants to add REST documentation (required),
the file must be referenced in index.js as shown below:

import exampleRouter from './routes/example.js';
app.use('/example', exampleRouter);

Also, the user must ensure that index.js’s const swaggerOptions includes all route files. This is done by using * as a wildcard in the apis definition:

apis: ['./index.js', './routes/*.js']

The documentation follows this general structure (NOTE: The <- are just for description of each line and not needed in actual documentation!):

/**
 * @openapi
 * /users:                                        <-- 1.  Endpoint path (URL)
 *   post:                                        <-- 2.  HTTP method
 *     summary: Create a new user                 <-- 3.  Short, human-readable description of what this endpoint does
 *     tags:                                      <-- 4.  Optional: Groups endpoints in Swagger UI
 *       - Users                                  <--     Group name
 *     requestBody:                               <-- 5.  Body data sent by the client (for POST/PUT)
 *       required: true                           <--     Indicates body is required
 *       content:
 *         application/json:                      <--     Content type expected
 *           schema:                              <--     Schema of request body
 *             type: object                       <--     Request body is an object
 *             properties:                        <--     List of properties in the request body
 *               username:                        <--     Field name
 *                 type: string                   <--     Data type
 *               passhash:                        <--     Field name
 *                 type: string                   <--     Data type
 *             example:                           <--     Example values to show expected format
 *               username: johndoe                <--     Example: username field
 *               passhash: 12345                  <--     Example: passhash field
 *     responses:                                 <-- 6.  Possible responses from the server
 *       201:                                     <--     HTTP status code for successful creation
 *         description: User created successfully <--     Human-readable explanation
 *         content:
 *           application/json:
 *             schema:
 *               type: object                     <--     Response body is an object
 *               properties:
 *                 id:                            <--     Response property
 *                   type: integer                <--     Data type
 *                 username:                      <--     Response property
 *                   type: string                 <--     Data type
 *       400:                                     <--     HTTP status code for client error
 *         description: Bad Request               <--     Explanation of 400 error
 */

## Instructions for Swagger UI

Swagger can also be used for testing and executing HTTP requests manually.
Run the server with node index.js in the terminal. Swagger UI will be available at http://localhost:3001/api-docs
The UI includes all the documented HTTP requests.
Clicking a request displays all its documentation, including parameters and expected responses
"Try it out"-button allows the user to run the request manually.
Fill in any required parameters in the request body or query, then click Execute.
Swagger returns the response body, headers, and status code.
