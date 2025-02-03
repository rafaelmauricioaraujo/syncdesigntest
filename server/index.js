require("dotenv").config();
const express = require("express");
const app = express();
("");
const cors = require("cors");
const corsOptions = require("./config/corsOptions");
const mongoose = require("mongoose");
const connectDB = require("./config/dbConn");
const Report = require("./model/internal/Report");

const http = require("http");

const PORT = 3001;

connectDB();

// // Cross Origin Resource Sharing
app.use(cors(corsOptions));

// built-in middleware to handle urlencoded form data
app.use(express.urlencoded({ extended: false }));

// built-in middleware for json
app.use(express.json());

// app.use('/api', router);

app.post("/api/report", async (req, res) => {
  console.log(req.body);

  const report = new Report({
			title: req.body.title,
			description: req.body.description,
			images: req.body.images,
			type: req.body.type,
			parts: req.body.parts,
			links: req.body.links,
			user: new mongoose.Types.ObjectId(),
			approvalNeeded: req.body.approvalNeeded,
			items: req.body.items,
      issueId: new mongoose.Types.ObjectId(),
  });
  try {
    await report.save();
    res.status(201).send(report);
  } catch (err) {
    console.log(err);
    res.status(400).send(err);
  }
});


// Middleware to catch URIError
app.use((err, req, res, next) => {
  if (err instanceof URIError) {
    res.status(400).send("Bad Request: Invalid URL encoding");
  } else {
    next(err);
  }
});

// home route

mongoose.connection.once("open", () => {
  console.log("Connected to MongoDB");
  const server = http.createServer(app);

  server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
