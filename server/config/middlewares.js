const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");

// CORS CONFIG
const whitelist = ["http://localhost:3000"];
const corsOptions = {
  origin: (origin, cb) => {
    const originIsWhitelisted = whitelist.includes(origin);
    cb(null, originIsWhitelisted);
  },
  credentials: true,
};

module.exports = (app) => {
  app.use(bodyParser.json({ limit: "100mb" }));
  app.use(bodyParser.urlencoded({ limit: "100mb", extended: true }));
  app.use(cookieParser());

  app.use(cors(corsOptions));
};
