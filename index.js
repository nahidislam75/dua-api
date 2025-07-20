const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const path = require("path");
const cors = require("cors");

const app = express();
const PORT = 3000;

app.use(cors());

// Connect to SQLite
const dbPath = path.join(__dirname, "dua_main.sqlite");
const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READONLY, (err) => {
  if (err) return console.error("Error opening database:", err.message);
  console.log("Connected to dua_main.sqlite");
});

// Endpoint: Get all categories
app.get("/categories", (req, res) => {
  const sql = `SELECT id, cat_id, cat_name_bn, cat_name_en, no_of_subcat, no_of_dua, cat_icon FROM category`;
  db.all(sql, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Endpoint: Get subcategories by category ID
app.get("/subcategories/:cat_id", (req, res) => {
  const { cat_id } = req.params;
  const sql = `SELECT id, cat_id, subcat_id, subcat_name_bn, subcat_name_en, no_of_dua FROM sub_category WHERE cat_id = ?`;
  db.all(sql, [cat_id], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Endpoint: Get duas by subcategory ID
app.get("/displaydua/:cat_id", (req, res) => {
  const { cat_id } = req.params;
  const sql = `
    SELECT id, cat_id, subcat_id, dua_id, dua_name_en, dua_name_bn, top_bn, top_en,
           dua_arabic, dua_indopak, clean_arabic, transliteration_bn, transliteration_en, translation_bn, translation_en,
           bottom_bn, bottom_en, refference_bn, refference_en, audio
    FROM dua
    WHERE cat_id = ?
  `;
  db.all(sql, [cat_id], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Endpoint: Get duas by subcategory ID
app.get("/duas/:subcat_id", (req, res) => {
  const { subcat_id } = req.params;
  const sql = `
    SELECT id, cat_id, subcat_id, dua_id, dua_name_en, dua_name_bn, top_bn, top_en,
           dua_arabic, dua_indopak, clean_arabic, transliteration_bn, transliteration_en, translation_bn, translation_en,
           bottom_bn, bottom_en, refference_bn, refference_en, audio
    FROM dua
    WHERE subcat_id = ?
  `;
  db.all(sql, [subcat_id], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Optional: Get dua by dua_id
app.get("/dua/:dua_id", (req, res) => {
  const { dua_id } = req.params;
  const sql = `
    SELECT * FROM dua WHERE dua_id = ?
  `;
  db.get(sql, [dua_id], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(row || {});
  });
});

// Root route
app.get("/", (req, res) => {
  res.send(
    "📖 Dua API is running. Use endpoints like /categories, /subcategories/:cat_id, /duas/:subcat_id"
  );
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
