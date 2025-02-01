const allowedOrigins = require("./allowedOrigins");

const corsOptions = {
  origin: (origin, callback) => {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      console.log(`Origin not allowed by CORS: ${origin}`);
      callback(null, false); // Reject the request without throwing an error
    }
  },
  optionsSuccessStatus: 200,
};

module.exports = corsOptions;
