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

router.get(
  "/",
  asyncHandler(async function (req, res, next) {
    const books = await Book.findAll({ order: [["year", "desc"]] });
    res.render("index", { books });
  })
);

router.get(
  "/new",
  asyncHandler(function (req, res, next) {
    res.render("new-book");
  })
);

/* creater */
router.post("/new", async function (req, res) {
  let book;
  try {
    book = await Book.create(req.body);
    res.redirect("/");
  } catch (error) {
    if (error.name === "SequelizeValidationError") {
      const arr = [];
      await error.errors.forEach((error) => arr.push(error.message));
      res.render("new-book", { errors: arr });
    }
  }
});

router.get(
  "/:id",
  asyncHandler(async function (req, res, next) {
    const book = await Book.findByPk(req.params.id);
    try {
      res.render("update-book", {
        title: book.title,
        author: book.author,
        id: book.id,
      });
    } catch (err) {
      next(err);
    }
  })
);

router.post(
  "/:id",
  asyncHandler(async function (req, res, next) {
    let book;
    try {
      book = await Book.findByPk(req.params.id);
      await book.update(req.body);
      res.redirect("/books");
    } catch (error) {
      if (error.name === "SequelizeValidationError") {
        book = await Book.findByPk(req.params.id);
        const arr = [];
        await error.errors.forEach((error) => arr.push(error.message));
        console.log(arr);
        res.render("update-book", {
          errors: arr,
          title: book.title,
          author: book.author,
          id: book.id,
        });
      }
    }
  })
);

router.post(
  "/:id/delete",
  asyncHandler(async function (req, res, next) {
    const book = await Book.findByPk(req.params.id);
    await book.destroy();
    res.redirect(`/books`);
  })
);

module.exports = router;
