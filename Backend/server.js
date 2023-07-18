const express = require("express");
const app = express();
const port = 4004;
const bcrypt = require("bcryptjs");
const session = require("express-session");
const authRouter = require("./routes/auth");
const postsRouter = require("./routes/posts");
const usersRouter = require("./routes/users");
const { Post, User, Comment } = require("./models");
const {
  forbiddenErrorHandler,
  notFoundErrorHandler,
} = require("./middleware/errorHandlers");
require("dotenv").config();

app.use((req, res, next) => {
  console.log(`Request: ${req.method} ${req.originalUrl}`);
  res.on("finish", () => {
    console.log(`Response Status: "${res.statusCode}`);
  });
  next();
});

app.use(express.json());

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 3600000, // 1 hour since 60 minutes * 60 seconds * 1000 milliseconds
    },
  })
);

app.get("/", (req, res) => {
  res.send("Welcome to a blogging website!");
});

app.use(forbiddenErrorHandler);
app.use(notFoundErrorHandler);

app.use("/posts", postsRouter);
app.use("/auth", authRouter);
app.use("/users", usersRouter);

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
