// Importing necessary libraries and dependencies
const express = require("express"); // Importing the Express framework
require("dotenv").config(); // Loading environment variables
const app = express(); // Creating an instance of Express
const cors = require("cors"); // Allowing cross-origin resource sharing
const mongoose = require("mongoose"); // Importing the Mongoose library for MongoDB
const bodyParser = require("body-parser"); // Parsing request bodies
const authRoutes = require("./routes/AuthRoutes"); // Importing authentication routes
const cookieParser = require("cookie-parser"); // Parsing cookies
const signupRoute = require("./routes/SignupRoute"); // Importing signup routes
const userRoute = require("./routes/UserRoutes"); // Importing user routes

// Connecting to the MongoDB database
mongoose
  .connect(process.env.MONGO_LINK) // Using the MongoDB connection string from environment variables
  .then(() => {
    console.log("DATABASE IS CONNECTED");
  })
  .catch((err) => {
    console.log(err);
  });

app.use(cookieParser()); // Using cookie-parser middleware
app.use(
  cors({
    origin: "http://localhost:3000", // Allowing requests from this origin
    credentials: true, // Allowing cookies to be sent with requests
  })
);
app.options('*', cors()); // Handling preflight requests for all routes
app.use(express.json()); // Parsing JSON request bodies
app.use(bodyParser.json()); // Using body-parser middleware to parse JSON
app.use("/signup", signupRoute); // Using the signup routes
app.use("/login", authRoutes); // Using the authentication routes
app.use("/", userRoute); // Using the user routes

// Starting the server and listening on the specified port
app.listen(process.env.PORT, () => {
  console.log("Server is running at port " + process.env.PORT);
});
