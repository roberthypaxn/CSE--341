//The express web server is stored as a function/method inside the xpress variable
const xpress = require("express");
//BodyParser
const bodyParser = require("body-parser");
//The mongodb connection from our /db/connect.js file with all its exported utilities
const mongodb = require("./db/connect");
//Passport
const passport = require("passport");
//Cors
const cors = require("cors");
//Express Session
const session = require("express-session");
//MongoDB Session Store
const MongoDBStore = require("connect-mongodb-session")(session);
//Github Strategy
const GithubStrategy = require("passport-github2").Strategy;

const port = process.env.PORT || 8080;
// The xpress() function is called... this returns an instance of an express application and is stored in the app variable
const app = xpress();

//Configure MongoDB session store
const store = new MongoDBStore({
  uri: process.env.MONGODB_URI, //Uses same MONGODB_URI as /db/connect.js
  collection: "sessions",
});
store.on("error", function (error) {
  console.error("Session store error:", error);
});

app
  .use(bodyParser.json())
  .use(
    session({
      secret: "secret",
      resave: false,
      saveUninitialized: true,
      store: store,
    })
  ) //Using MongoDB session store to prevent memory leak

  //Express session initialization
  .use(passport.initialize())
  //Initiate passport on every route call.
  .use(passport.session())
  .use(
    cors({
      origin: "*",
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization"],
    })
  )
  .use("/", require("./routes"));

passport.use(
  new GithubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: process.env.CALLBACK_URL, //Set to https://cse-341-w04.onrender.com/github/callback in Render
    },
    function (accessToken, refreshToken, profile, done) {
      //User.findOrCreate({githubId:profile.id},function (err,user){
      return done(null, profile);
      //});
    }
  )
);

passport.serializeUser(function (user, done) {
  done(null, user);
});
passport.deserializeUser(function (user, done) {
  done(null, user);
});

app.get("/", function (req, res) {
  res.send(
    req.session.user !== undefined
      ? `Welcome back, ${req.session.user.displayName}! You're now logged in.`
      : "You've logged out. See you next time!"
  );
});

app.get(
  "/github/callback",
  passport.authenticate("github", {
    failureRedirect: "/api-docs",
    session: false,
  }),
  function (req, res) {
    req.session.user = req.user;
    res.redirect("/");
  }
);

mongodb.initDb((err) => {
  if (err) {
    console.log(err);
  } else {
    app.listen(port, () => {
      console.log(`Connected to DB and listening on ${port}`);
    });
  }
});
