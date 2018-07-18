const feathers = require('@feathersjs/feathers');
const express = require('@feathersjs/express');
const cors = require('cors');
const database = require('./database');
const oAuthModel = require('./oauth/access-token-model');
const oAuth2Server = require('node-oauth2-server');

const NeDB = require('nedb');
const service = require('feathers-nedb');

const db = database.bookstoreDB;

// Create an Express compatible Feathers application instance.
const app = express(feathers());

// Turn on JSON parser for REST services
app.use(express.json());

// Turn on CORS
app.use(cors());

// Turn on URL-encoded parser for REST services
app.use(express.urlencoded({extended: true}));

// Enable REST services
app.configure(express.rest());

// Verify whether the oauth token is valid
app.oauth = oAuth2Server({
  model: oAuthModel,
  grants: ['password'],
  debug: true
});
app.use(app.oauth.errorHandler());
app.use(app.oauth.authorise());

// Connect to the db, create and register a Feathers service.
app.use('/api/book', service({
  Model: db,
  id: 'id',
  paginate: {
    default: 5,
    max: 100
  }
}));

// Event Handlers
let userService = app.service('api/book');;
userService.on('created', (book, context) => console.log('created', book));
userService.on('updated', (book, context) => console.log('updated', book));
userService.on('removed', (book, context) => console.log('removed', book));

// Set up default error handler
app.use(express.errorHandler());

// Start the server.
const port = 5000;

app.listen(port, () => {
  console.log(`Feathers Bookstore server listening on port ${port}`);
});
