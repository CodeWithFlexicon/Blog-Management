const express = require("express");
const router = express.Router();
const { authenticateUser } = require("../middleware/auth");
const { ForbiddenError, NotFoundError } = require("../errors");
const { User, Post, Comment } = require("../models");

router.get("/", authenticateUser, async (req, res) => {
  try {
    const allUsers = await User.findAll();

    res.status(200).json(allUsers);
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: err.message });
  }
});

router.get("/:id/posts", authenticateUser, async (req, res) => {
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

router.get("/:id/comments", authenticateUser, async (req, res) => {
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

module.exports = router;
