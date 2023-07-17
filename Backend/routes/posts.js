const express = require("express");
const router = express.Router();
const { authenticateUser } = require("../middleware/auth");
const { ForbiddenError, NotFoundError } = require("../errors");
const { User, Post, Comment } = require("../models");

const getPost = async (id) => {
  const post = await Post.findByPk(parseInt(id, 10), {
    include: [Comment],
  });

  if (!post) {
    throw new NotFoundError("Post not found");
  }
  return post;
};

const authorizePostEdit = (session, post) => {
  if (parseInt(session.userId, 10) !== post.UserId) {
    throw new ForbiddenError("You cannot edit someone else's post");
  }
};

const authorizePostDelete = (session, post) => {
  if (parseInt(session.userId, 10) !== post.UserId) {
    throw new ForbiddenError("You cannot delete someone else's post");
  }
};

const handleErrors = (err, res) => {
  console.error(err);
  if (err.name === "SequelizeValidationError") {
    return res.status(422).json({ errors: err.errors.map((e) => e.message) });
  }
  res.status(500).send({ message: err.message });
};

//Get all posts
router.get("/", authenticateUser, async (req, res) => {
  try {
    const allPosts = await Post.findAll();

    res.status(200).json(allPosts);
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: err.message });
  }
});

//Get a specific post
router.get("/:id", authenticateUser, async (req, res) => {
  try {
    const post = await getPost(req.params.id);

    if (post) {
      res.status(200).json(post);
    } else {
      res.status(404).send({ message: "Post not found" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: err.message });
  }
});

//Get all the comments from a specific post
router.get("/:id/comments", authenticateUser, async (req, res) => {
  try {
    const comments = await Comment.findAll({
      where: {
        PostId: req.params.id,
      },
    });

    if (comments) {
      res.status(200).json(comments);
    } else {
      res.status(404).send({ message: "No comments" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: err.message });
  }
});

//Create a post
router.post("/", authenticateUser, async (req, res) => {
  try {
    const newPost = await Post.create(req.body);

    res.status(201).json(newPost);
  } catch (err) {
    handleErrors(err, res);
  }
});

//Create a new comment to a post
router.post("/:id/comments", authenticateUser, async (req, res) => {
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
    handleErrors(err, res);
  }
});

module.exports = router;
