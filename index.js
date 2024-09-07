const express = require("express");
const cors = require("cors");
const passport = require("passport");
const session = require("express-session");
const fs = require('fs');
const path = require("path");
const { PORT, CLIENT_URL, SESSION_SECRET } = require("./config");
const connectDB = require("./config/db");
const auth = require("./routes/auth");
const user = require("./routes/user");
const client = require("./routes/client");
const content = require("./routes/content");
require("./config/passport")(passport);

const app = express();

//Connect to MongoDB database
connectDB();

// Define the uploads directory
const uploadsDir = path.join(__dirname, 'uploads');

// Ensure the uploads directory exists
if (!fs.existsSync(uploadsDir)){
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// Serve static files from the uploads directory
app.use("/uploads", express.static(uploadsDir));

//Middlewares
// app.use(cors({ origin: CLIENT_URL, credentials: true }));
const allowedOrigins = [CLIENT_URL, 'http://localhost:5173'];

app.use(cors({
  origin: function(origin, callback){
    if(!origin) return callback(null, true);
    if(allowedOrigins.indexOf(origin) === -1){
      var msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true,
}));
app.use(express.json());
app.use(
  session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());

//Routes
app.use("/api/auth", auth);
app.use("/api/users", user);

app.use("/api/clients", client);
app.use("/api/content", content);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
