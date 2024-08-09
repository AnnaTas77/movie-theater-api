const { Router } = require("express");
const { Show } = require("../models/index");
const express = require("express");
const { check, validationResult } = require("express-validator");

const router = Router();

router.get("/", async (req, res) => {
  const allShows = await Show.findAll();

  res.status(200).send(allShows);
});

router.get("/:id", async (req, res) => {
  const showId = req.params.id;
  const currentShow = await Show.findByPk(showId);

  if (!currentShow) {
    res.status(404).send({ error: "Show not found." });
    return;
  }
  res.status(200).send(currentShow);
});

// GET all users who watched a show
// PUT update the available property of a show
// DELETE a show
// GET shows of a particular genre (genre in req.query)

module.exports = router;
