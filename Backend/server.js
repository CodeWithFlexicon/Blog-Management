const express = require("express");
const app = express();
const port = 4004;
const bcrypt = require("bcryptjs");
const session = require("express-session");
const authRouter = require("./routes/auth");
const postsRouter = require("./routes/posts");
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

const authenticateUser = (req, res, next) => {
  if (!req.session.userId) {
    return res
      .status(401)
      .json({ message: "You must be logged in to view this page." });
  }
  next();
};

app.get("/", (req, res) => {
  res.send("Welcome to a blogging website!");
});

//Get all users, probably useful for admins
app.get("/users", authenticateUser, async (req, res) => {
  try {
    const allUsers = await User.findAll();

    res.status(200).json(allUsers);
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: err.message });
  }
});

//Get all posts of a specific user
app.get("/users/:id/posts", authenticateUser, async (req, res) => {
  const userId = parseInt(req.params.id, 10);

  try {
    const posts = await Post.findAll({
      where: { UserId: userId },
    });

    if (posts) {
      res.status(200).json(posts);
    } else {
      res.status(404).send({ message: "User not found" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: err.message });
  }
});

//Get all comments of a specific user
app.get("/users/:id/comments", authenticateUser, async (req, res) => {
  const userId = parseInt(req.params.id, 10);

  try {
    const comments = await Comment.findAll({
      where: { UserId: userId },
    });

    if (comments) {
      res.status(200).json(comments);
    } else {
      res.status(404).send({ message: "User not found" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: err.message });
  }
});

//Create a new post
app.post("/posts", authenticateUser, async (req, res) => {
  const userId = req.session.userId;

  try {
    const newPost = await Post.create({
      title: req.body.title,
      content: req.body.content,
      UserId: userId,
    });

    res.status(201).json(newPost);
  } catch (err) {
    if (err.name === "SequelizeValidationError") {
      return res.status(422).json({ errors: err.errors.map((e) => e.message) });
    }
    console.error(err);
    res.status(500).send({ message: err.message });
  }
});

//Create a new comment to a post
app.post("/posts/:id/comments", authenticateUser, async (req, res) => {
  const postId = parseInt(req.params.id, 10);
  const content = req.body.content;
  const userId = req.session.userId;

  try {
    const newComment = await Comment.create({
      content: content,
      UserId: userId,
      PostId: postId,
    });

    res.status(201).json({
      message: "Comment created successfully",
      comment: newComment,
    });
  } catch (err) {
    if (err.name === "SequelizeValidationError") {
      return res.status(422).json({ errors: err.errors.map((e) => e.message) });
    }
    console.error(err);
    res.status(500).send({ message: err.message });
  }
});

//Update a specific post
app.patch("/posts/:id", authenticateUser, async (req, res) => {
  const postId = parseInt(req.params.id, 10);

  try {
    const record = await Post.findOne({ where: { id: postId } });
    if (record && record.UserId !== parseInt(req.session.userId, 10)) {
      return res
        .status(403)
        .json({ message: "You are not authorized to perform this action" });
    }

    const [numberOfAffectedRows, affectedRows] = await Post.update(req.body, {
      where: { id: postId },
      returning: true,
    });

    if (numberOfAffectedRows > 0) {
      res.status(200).json(affectedRows[0]);
    } else {
      res.status(404).json({ message: "Post not found" });
    }
  } catch (err) {
    if (err.name === "SequelizeValidationError") {
      return res.status(422).json({ errors: err.errors.map((e) => e.message) });
    }
    console.error(err);
    res.status(500).send({ message: err.message });
  }
});

//Update a specific comment
app.patch(
  "/posts/:postId/comments/:commentId",
  authenticateUser,
  async (req, res) => {
    const commentId = parseInt(req.params.commentId, 10);

    try {
      const record = await Comment.findOne({ where: { id: commentId } });
      if (record && record.UserId !== parseInt(req.session.userId, 10)) {
        return res
          .status(403)
          .json({ message: "You are not authorized to perform this action" });
      }

      const [numberOfAffectedRows, affectedRows] = await Comment.update(
        req.body,
        {
          where: { id: commentId },
          returning: true,
        }
      );

      if (numberOfAffectedRows > 0) {
        res.status(200).json(affectedRows[0]);
      } else {
        res.status(404).json({ message: "Comment not found" });
      }
    } catch (err) {
      if (err.name === "SequelizeValidationError") {
        return res
          .status(422)
          .json({ errors: err.errors.map((e) => e.message) });
      }
      console.error(err);
      res.status(500).send({ message: err.message });
    }
  }
);

//Delete a specific post if you are the user who made it
app.delete("/posts/:id", authenticateUser, async (req, res) => {
  const postId = parseInt(req.params.id, 10);

  try {
    const record = await Post.findOne({ where: { id: postId } });
    if (record && record.UserId !== parseInt(req.session.userId, 10)) {
      return res
        .status(403)
        .json({ message: "You cannot delete someone else's post" });
    }

    const deleteOperation = await Post.destroy({ where: { id: postId } });

    if (deleteOperation > 0) {
      res.status(200).send({ message: "Post deleted successfully" });
    } else {
      res.status(404).send({ message: "Post not found" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: err.message });
  }
});

//Delete a specific comment if you are the user who made it
app.delete(
  "/posts/:postId/comments/:commentId",
  authenticateUser,
  async (req, res) => {
    const commentId = parseInt(req.params.commentId, 10);

    try {
      const record = await Comment.findOne({ where: { id: commentId } });
      if (record && record.UserId !== parseInt(req.session.userId, 10)) {
        return res
          .status(403)
          .json({ message: "You cannot delete someone else's comment" });
      }

      const deleteOperation = await Comment.destroy({
        where: { id: commentId },
      });

      if (deleteOperation > 0) {
        res.status(200).send({ message: "Comment deleted successfully" });
      } else {
        res.status(404).send({ message: "Comment not found" });
      }
    } catch (err) {
      console.error(err);
      res.status(500).send({ message: err.message });
    }
  }
);

app.use(forbiddenErrorHandler);
app.use(notFoundErrorHandler);

app.use("/posts", postsRouter);
app.use("/auth", authRouter);

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
