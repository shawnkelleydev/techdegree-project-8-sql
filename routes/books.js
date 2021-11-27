const Book = require("../models").Book;
var express = require("express");
var router = express.Router();

function asyncHandler(cb) {
  return async (req, res, next) => {
    try {
      await cb(req, res, next);
    } catch (error) {
      res.status(500).send(error);
    }
  };
}

router.get("/", function (req, res, next) {
  res.render("index", { title: "Books!" });
});

module.exports = router;
