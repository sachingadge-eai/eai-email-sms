const express = require('express');
const routes = require('./routes');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

// Use the routes defined in routes.js
app.use(bodyParser.json());

app.use('/', routes);

app.listen(port, () => {
  console.log(`Microservice running on port ${port}`);
});
