const express = require("express");
const app = express();
const port = process.env.PORT || 3001;
const fs = require("fs");
const path = require("path");
const cors = require("cors");
const bodyParser = require("body-parser");
const convertVNtoEng = require("./helpers/convertVNtoEng");

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

app.use(cors());
app.use(express.static(path.join(__dirname, "..", "public")));

app.post("/points/data", async function (req, res, next) {
  const data = req.body;

  let points = await fs.readFileSync(
    path.join(__dirname, "..", "public", "uploads", "points.json"),
    "utf-8"
  );
  points = JSON.parse(points);
  points = Array.from(points);

  points.push({
    id: data.id,
    name: data.name,
    points: data.points,
  });

  // console.log("[data]", points);

  await fs.writeFileSync(
    path.join(__dirname, "..", "public", "uploads", "points.json"),
    JSON.stringify(points)
  );

  res.send(points);
});

app.get("/points/data", async function (req, res, next) {
  const data = await fs.readFileSync(
    path.join(__dirname, "..", "public", "uploads", "points.json"),
    "utf-8"
  );

  res.send(data);
});

app.listen(port, () => console.log(`listen on http://localhost:${port}`));
