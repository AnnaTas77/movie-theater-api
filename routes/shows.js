const { Router } = require("express");
const { Show, User } = require("../models/index");
const express = require("express");
const { check, validationResult } = require("express-validator");

const router = Router();

router.get("/", async (req, res) => {
  const allShows = await Show.findAll();

  res.status(200).send(allShows);
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

// DELETE a show

router.delete("/:showId", async (req, res) => {
  const currentShow = await Show.findByPk(req.params.showId);

  await currentShow.destroy();

  res.json(currentShow);
});

// GET shows of a particular genre in query string (genre in req.query) - GET /shows?genre=

module.exports = router;
