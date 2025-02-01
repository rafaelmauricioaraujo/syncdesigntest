const bodyParser = require("body-parser");

const bodyParserMiddleware = (app) => {
  app.use(bodyParser.json({ limit: "5mb" }));
  app.use(bodyParser.urlencoded({ limit: "5mb", extended: true }));
};

module.exports = bodyParserMiddleware;
