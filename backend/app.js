//The express web server is stored as a function/method inside the xpress variable
const xpress = require("express");

const bodyParser = require("body-parser");

//The mongodb connection from our /db/connect.js file with all its exported utilities
const mongodb = require("./db/connect");

const cors = require("cors");

const port = process.env.PORT || 8080;

// The xpress() function is called... this returns an instance of an express application and is stored in the app variable
const app = xpress();

app.use(bodyParser.json()).use(cors()).use("/", require("./routes/contacts"));

mongodb.initDb((err, mongodb) => {
  if (err) {
    console.log(err);
  } else {
    app.listen(port, () => {
      console.log(`Connected to DB and listening on ${port}`);
    });
  }
});
