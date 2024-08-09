const { User, Show } = require("../models/index");
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

// PUT associate a user with a show they have watched - linking together an existing user with an existing show (there will be nothing in the request body)

router.put("/:userId/shows/:showId", async (req, res) => {
  const currentUser = await User.findByPk(req.params.userId);

  if (!currentUser) {
    res.status(400).json({
      error: "Cannot associate a show with a user that does not exist.",
    });
    return;
  }

  const currentShow = await Show.findByPk(req.params.showId);

  if (!currentShow) {
    res.status(400).json({
      error: "Cannot associate a user with a show that does not exist.",
    });
    return;
  }

  await currentUser.addShow(currentShow);

  res.status(204).send();
});

// POST a new user

router.post("/", [check("username").isEmail().trim()], async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    res.json({ error: errors.array() });
    return;
  }

  const newUser = req.body;
  const createdNewUser = await User.create(newUser);
  res.status(201).json(createdNewUser);
});

module.exports = router;
