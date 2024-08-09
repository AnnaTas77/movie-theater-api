const { Router } = require("express");
const { Show, User } = require("../models/index");
const express = require("express");
const { check, validationResult } = require("express-validator");

const router = Router();

// GET shows of a particular genre in query string (genre in req.query) - GET /shows?genre=
router.get("/", async (req, res) => {
  const queryString = req.query;
  // console.log(queryString);

  if (queryString.genre) {
    const allShowsForThisQuery = await Show.findAll({
      where: { genre: queryString.genre },
    });
    res.status(200).send(allShowsForThisQuery);
  } else {
    const allShows = await Show.findAll();
    res.status(200).send(allShows);
  }
});

router.get("/:showId", async (req, res) => {
  const currentShow = await Show.findByPk(req.params.showId);

  if (!currentShow) {
    res.status(404).send({ error: "Show not found." });
    return;
  }
  res.status(200).send(currentShow);
});

// GET all users who watched a specific show
router.get("/:showId/users", async (req, res) => {
  const currentShow = await Show.findByPk(req.params.showId);

  if (!currentShow) {
    res.json([]);
    return;
  }

  const usersForThisShow = await currentShow.getUsers();
  res.json(usersForThisShow);
});

// PATCH update the available property of a show

router.patch("/:showId", async (req, res) => {
  let currentShow = await Show.findByPk(req.params.showId);

  if (!currentShow) {
    res.status(404).send({ error: "Show not found." });
    return;
  }

  const showUpdateObject = req.body;

  currentShow = await currentShow.update(showUpdateObject);

  res.send(currentShow);
});

// POST a show

router.post(
  "/",
  [check("title").isLength({ min: 1, max: 25 }).trim()],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.json({ error: errors.array() });
      return;
    }

    const newShow = req.body;

    const createdNewShow = await Show.create(newShow);

    res.status(201).json(createdNewShow);
  }
);

// DELETE a show

router.delete("/:showId", async (req, res) => {
  const currentShow = await Show.findByPk(req.params.showId);

  await currentShow.destroy();

  res.json(currentShow);
});

module.exports = router;
