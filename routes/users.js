const { User, Shows } = require("../models/index");
const express = require("express");
const { check, validationResult } = require("express-validator");

const router = express.Router();

router.get("/", async (req, res) => {
  const allUsers = await User.findAll();
  res.status(200).send(allUsers);
});

router.get("/:userId", async (req, res) => {
  const currentUser = await User.findByPk(req.params.userId);

  if (!currentUser) {
    res.status(404).send({ error: "User not found." });
    return;
  }
  res.status(200).send(currentUser);
});

// GET all shows watched by a user (user id in req.params)

router.get("/:userId/shows", async (req, res) => {
  const currentUser = await User.findByPk(req.params.userId);

  if (!currentUser) {
    res.json([]);
    return;
  }

  const showsForThisUser = await currentUser.getShows();
  res.json(showsForThisUser);
});

// PUT associate a user with a show they have watched

module.exports = router;
