const express = require("express");
const router = express.Router();
const pool = require("../db");

// GET - barcha kitoblarni olish
router.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM books");
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST - yangi kitob qo'shish
router.post("/", async (req, res) => {
  try {
    const { title, author, price } = req.body;
    const result = await pool.query(
      "INSERT INTO books (title, author, price) VALUES ($1, $2, $3) RETURNING *",
      [title, author, price],
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET by ID - bitta kitobni olish
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query("SELECT * FROM books WHERE id = $1", [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Kitob topilmadi" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT - kitobni yangilash
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { title, author, price } = req.body;
    const result = await pool.query(
      "UPDATE books SET title = $1, author = $2, price = $3 WHERE id = $4 RETURNING *",
      [title, author, price, id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Kitob topilmadi" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE - kitobni o'chirish
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      "DELETE FROM books WHERE id = $1 RETURNING *",
      [id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Kitob topilmadi" });
    }

    res.json({ message: "Kitob o'chirildi", book: result.rows[0] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
