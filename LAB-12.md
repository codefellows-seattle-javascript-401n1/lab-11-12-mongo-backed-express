![cf](https://i.imgur.com/7v5ASc8.png) lab 12 double resource express/mongo api
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
* using the existing code/repository from lab 11
* Create a second **Simple Model** using `mongoose.Schema` and `mongoose.model`
 * The model can represent whatever data you choose. _e.g. note, blog post, store items_
 * It must have a relationship of many to one with the resource from from lab-11
 * one of its properties must be of type `mongoose.Schema.ObjectId` and reference an ObjectId for a resource from lab-11
* create a _lib_ module named `<simple-model-name>-crud.js` in your lib directory
 * it should have methods for doing _CRUD_ operations on your model
 * it should store your data in mongo using mongoose
* use the `body-parser` express middleware on `POST` and `PUT` routes
* use the npm `debug` module to log the functions being executed in your app
* using the express `Router` create a route for doing **RESTFUL CRUD** operations on your second **Simple Model**
 * each route should use your `lib/<simple-model-name>-crud.js` module to manage your model's _CRUD_ opperations

## Server Endpoints
* make three routes that operate on your second simple model

## Tests
* test each new route for `200`, `204`, `400`, and `404` whenever applicable.

## Bonus
* **2pts** a `GET` request to `/api/simple-model-name/all` should retrun an array of stored resources
