const express = require("express");
const app = express();
const port = process.env.PORT || 3001;
const fs = require("fs");
const path = require("path");
const cors = require("cors");
const bodyParser = require("body-parser");
const convertVNtoEng = require("./helpers/convertVNtoEng");
const multer = require("multer");
const { escape } = require("querystring");
const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    var Path = path.join(__dirname, "..", "public", "uploads");
    callback(null, Path);
  },
  filename: (req, file, callback) => {
    var fileID = path.extname(file.originalname);
    var userId = req.userId;

    callback(
      null,
      file.originalname.substring(0, file.originalname.lastIndexOf(".")) +
      fileID
    );
  },
});

const upload = multer({ storage });

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

app.get("/points/data", async function (req, res, next) {
  const data = await fs.readFileSync(
    path.join(__dirname, "..", "public", "uploads", "points.json"),
    "utf-8"
  );

  res.send(data);
});

app.post("/send-image", upload.single('image'), async function (req, res, next) {
  const data = req.body;

  if (req.file.filename) req.file.url = `/uploads/${req.file.filename}`;
  let currentData = await fs.readFileSync(
    path.join(__dirname, "..", "public", "uploads", "reviews.json"),
    "utf-8"
  );

  // convert to Array
  currentData = JSON.parse(currentData);
  currentData = Array.from(currentData);

  const item = {
    id: currentData.length,
    user: data.user,
    description: data.description,
    location: { lat: data.location_lat, lng: data.location_lng },
    image: req.file,
  }

  currentData.push(item);

  await fs.writeFileSync(
    path.join(__dirname, "..", "public", "uploads", "reviews.json"),
    JSON.stringify(currentData)
  );

  res.send(item);
});

app.get('/get-image', async (req, res) => {
  let data = await fs.readFileSync(path.join(__dirname, "..", "public", "uploads", "reviews.json"), 'utf8');
  res.send(data);
});

app.get("/", (req, res) => {
  res.send({ 'title': 'Harryguci' })
});

app.listen(port, () => console.log(`listen on http://localhost:${port}`));
