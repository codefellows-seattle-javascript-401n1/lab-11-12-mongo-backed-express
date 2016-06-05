![cf](https://i.imgur.com/7v5ASc8.png) lab 11-12 mongo backed express
======
[![](https://img.shields.io/badge/Issues%3F-Ask%20for%20Help!-55cbe0.svg)](https://github.com/codefellows/seattle-javascript-401n1/issues/new)

# To Submit this Assignment
  * fork this repository
  * write all of your code in a directory named `lab-` + `<your name>` **e.g.** `lab-duncan`
  * push to your repository
  * submit a pull request to this repository
  * submit a link to your PR in canvas
  * write a question and observation on canvas

# Build Tool Instructions
* create a package.json that lists all dependencies and developer dependencies
* include an .eslintrc
* include a .gitignore
 * **add the string `db` to a new line in your gitignore file so that you dont include the db directory monogd is storeing its files in!**
* create a gulpfile
 * have a lint task for running eslint
 * have a test task for running mocha
 * have a nodemon task that restarts your server any time a change has been bade to your **.js** files
 * have a default task for running the lint and mocha tasks

# Directions
* Create these directories to organize your code: 
 * db - use the command `mongod --dbpath ./db` to start mongod using this directory
 * lib
 * model
 * route
 * test
* Create a HTTP Server using `express`
* Use the `app-error` module and `error-response` middleware from the labs 09-10 for error handeling
* Create a **Simple Model** that using `mongoose.Schema` and `mongoose.model`
 * The model can represent what ever data you choose. _e.g. note, blog post, store items_
* create a _lib_ module named `<simple-model-name>-crud.js` in your lib directory
 * it should have methods for doing _CRUD_ oppertions of your model
 * it should store your data in mongo using mongoose
* use the `body-parser` express middleware to on `POST` and `PUT` routes
* use the npm `debug` module to log the functions being executed in your app
* using the express `Router` create a route for doing **RESTFUL CRUD** operations on your _Simple Model_
 * each route should use your `lib/<simple-model-name>-crud.js` module to manage your model's _CRUD_ opperations

## Server Endpoints
### `/api/simple-model-name`
* `POST` request
 * pass data as stringifed json in the body of a post request to create a resource

### `/api/simple-model-name/:id`
* `GET` request 
 * pass the id of a resource though the url endpoint to `req.params` to fetch a simple-model   
* `PUT` request
 * pass data as stringifed json in the body of a put request to update a resource
* `DELETE` request
 * pass the id of a resource though the url endpoint to `req.params` to delete a simple-model   

## Tests 
* your tests should start your server when they begin and stop your server when they finish
* write a test to ensure that your api returns a status code of 404 for routes that have not been registered
* for each test setup and teardown mock data using the `lib/<simple-model-name>-crud.js` module before you make a request
* write tests to ensure your `/api/simple-model-name` endpoint responds as described for each condition below:
 * `GET` - test 200, response body like `{<data>}` for a request made with a valid id 
 * `GET` - test 404, responds with 'not found' for valid request made with an id that was not found
 * `PUT` - test 200, response body like  `{<data>}` for a post request with a valid body
 * `PUT` - test 400, responds with 'bad request' for if no `body provided` or `invalid body`
 * `PUT` - test 404, responds with 'not found' for valid request made with an id that was not found
 * `POST` - test 400, responds with 'bad request' for if no `body provided` or `invalid body`
 * `POST` - test 200, response body like  `{<data>}` for a post request with a valid body
 * `DELETE` - test 204, with no body, for a request with a valid id
 * `DELETE` - test 404, responds with 'not found' for valid request made with an id that was not found

## Bonus
* **2pts** a `GET` request to `/api/simple-model-name/all` should retrun an array of stored resources
