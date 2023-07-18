const express = require("express");
const router = express.Router();
const { authenticateUser } = require("../middleware/auth");
const { ForbiddenError, NotFoundError } = require("../errors");
const { User, Post, Comment } = require("../models");

const getPost = async (id) => {
  const post = await Post.findByPk(parseInt(id, 10), { include: [Comment] });

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

const authorizeCommentEdit = (session, comment) => {
  if (parseInt(session.userId, 10) !== comment.UserId) {
    throw new ForbiddenError("You cannot edit someone else's comment");
  }
};

const authorizePostDelete = (session, post) => {
  if (parseInt(session.userId, 10) !== post.UserId) {
    throw new ForbiddenError("You cannot delete someone else's post");
  }
};

const authorizeCommentDelete = (session, post) => {
  if (parseInt(session.userId, 10) !== comment.UserId) {
    throw new ForbiddenError("You cannot delete someone else's comment");
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
    const allPosts = await Post.findAll({ include: [Comment] });

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
    const postId = req.params.id;

    const post = await Post.findByPk(postId);
    if (!post) {
      return res.status(404).send({ message: "Post not found" });
    }

    const comments = await Comment.findAll({
      where: {
        PostId: postId,
      },
    });

    if (comments.length > 0) {
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
  const userId = req.session.userId;

  try {
    const newPost = await Post.create({
      title: req.body.title,
      content: req.body.content,
      UserId: userId,
    });

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

//update a specific post
router.patch("/:id", authenticateUser, async (req, res) => {
  try {
    const post = await getPost(req.params.id);
    await authorizePostEdit(req.session, post);
    const updatedPost = await post.update(req.body);
    res.status(200).json(updatedPost);
  } catch (err) {
    handleErrors(err, res);
  }
});

//update a specific comment
router.patch(
  "/:postId/comments/:commentId",
  authenticateUser,
  async (req, res) => {
    try {
      const comment = await Comment.findOne({
        where: { id: req.params.commentId },
      });
      await authorizeCommentEdit;
      const updatedComment = await comment.update(req.body);
      res.status(200).json(updatedComment);
    } catch (err) {
      handleErrors(err, res);
    }
  }
);

//Delete a specific post
router.delete("/:id", authenticateUser, async (req, res) => {
  try {
    const post = await getPost(req.params.id);
    await authorizePostDelete(req.session, post);
    await Post.destroy({
      where: { id: req.params.id },
    });
    res.status(200).send({ message: "Post deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: err.message });
  }
});

module.exports = router;
