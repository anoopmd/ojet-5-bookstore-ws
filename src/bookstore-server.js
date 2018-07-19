const feathers = require('@feathersjs/feathers');
const express = require('@feathersjs/express');
const cors = require('cors');
const rp = require('request-promise');
const oauthDisabled = true;

const NeDB = require('nedb');
const service = require('feathers-nedb');

const db = new NeDB({
  filename: './db-data/bookstore.nedb',
  autoload: true
});

// Create an Express compatible Feathers application instance.
const app = express(feathers());

// Turn on JSON parser for REST services
app.use(express.json());

// Turn on CORS
app.use(cors());
app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');

  if ('OPTIONS' === req.method) {
    res.send(200);
  }
  else {
    next();
  }
});

// Turn on URL-encoded parser for REST services
app.use(express.urlencoded({extended: true}));

// Enable REST services
app.configure(express.rest());

if(!oauthDisabled){
  app.use(function(req, res, next) {
    var options = {
      method: 'GET',
      uri: 'http://localhost:9000/check',
      headers: {
        'Authorization': req.headers.authorization,
        'content-type': 'application/x-www-form-urlencoded'  // Is set automatically
      }
    };

    rp(options)
      .then(function (data) {
        return next();
      })
      .catch(function (err) {
        return next(err);
      });
  });
}

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
