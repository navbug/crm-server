const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const session = require("express-session");
const UserModel = require("./models/user");
const { PORT, MONGODB_URL, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, SESSION_SECRET } = require("./config");

const port = PORT;
const mongodbURL = MONGODB_URL;

mongoose.connect(mongodbURL);
// mongoose.connect(mongodbURL, {
//   dbName: "crm_db",
// })

mongoose.connection.on("connected", () => {
  console.log("Connected");
});
mongoose.connection.on("error", (error) => {
  console.log(`Error connecting to DB: ${error}`);
});

require("./models/user");

passport.use(new GoogleStrategy({
  clientID: GOOGLE_CLIENT_ID,
  clientSecret: GOOGLE_CLIENT_SECRET,
  callbackURL: "/auth/google/callback"
},
async (accessToken, refreshToken, profile, done) => {
  const existingUser = await UserModel.findOne({ googleId: profile.googleId });
    if (existingUser) {
      return done(null, existingUser);
    }
    const user = await new UserModel({
      googleId: profile.id,
      name: profile.displayName,
      email: profile.emails[0].value,
    }).save();
    done(null, user);
}
));

passport.serializeUser(async (user, done) => {
  try {
    done(null, user.id);
  } catch (err) {
    console.log(err);
    
  }
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await UserModel.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

app.use(session({
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));
app.use(express.json());

app.use("/api/users", require("./routes/user"));

app.use("/auth", require("./routes/auth"));

app.use("/api/clients", require("./routes/client"));
app.use("/api/content", require("./routes/content"));

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});