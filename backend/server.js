/* Alias registering */
require("module-alias/register");

/* Import Dependencies */
const express = require("express");
const compression = require("compression");
const cors = require("cors");
const { urlencoded, json } = require("body-parser");
const { errors } = require("celebrate");
const helmet = require("helmet");

/* Express init */
const app = express();

app.use(compression());
app.use(helmet());

/* Disable headers etag and x-powered-by. { SECURITY & PERFORMANCE } */
app.disable("etag").disable("etag");

/* Express configuration */
app.use(cors());
app.use(urlencoded({ extended: false }));
app.use(json());

/* Routes configuration */
//app.use(require("./app/routes"));

/* Register middleware for Joi validation */
app.use(errors());

/* Bootstrap application */
var server = app.listen(process.env.PORT || 3000, function() {
  console.log("Escutando na porta " + server.address().port);
});

/* Simple endpoint for POC purposes ONLY */
app.get("/", (req, res, next) => {
  /* Call logger function to log on splunk instance */
  require("./splunk").main({}, function() {});

  /* */
  res.status(200).json({ message: "it works!" });
});

module.exports = app;
