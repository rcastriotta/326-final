// import { database } from "./database.js";
import express from "express";
import logger from "morgan";
import { database } from "./database.js";
import { movieDB } from "./movieDB.js";

database.connect();
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(logger("dev"));
app.use("/", express.static("client"));

app.delete("/remove-rating", async (req, res) => {
  try {
    if (!req.query.id?.length) return res.status(400).end();
    console.log(req.query.id);
    await database.removeReview(req.query.id);
    res.status(200).end();
  } catch (err) {
    console.log(err);
  }
});

app.post("/create-rating", async (req, res) => {
  try {
    const valid = await database.validateObject(req.body);
    if (!valid) return res.status(400).end();
    await database.createOrUpdateReview(req.body);
    res.status(201).end();
  } catch (err) {
    console.log(err);
  }
});

app.patch("/update-rating", async (req, res) => {
  try {
    const valid = await database.validateObject(req.body);
    if (!valid) return res.status(400).end();
    await database.createOrUpdateReview(req.body);
    res.status(200).end();
  } catch (err) {
    console.log(err);
  }
});

app.get("/your-ratings", async (req, res) => {
  try {
    const ratings = await database.getAllReviews();
    res.json(ratings);
  } catch (err) {
    console.log(err);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/popular-movies", async (req, res) => {
  try {
    const movies = await movieDB.getPopularMovies();
    res.json(movies);
  } catch (err) {
    res.status(500).send("Internal Server Error");
  }
});

app.get("/now-playing-movies", async (req, res) => {
  try {
    const movies = await movieDB.getNowPlayingMovies();
    res.json(movies);
  } catch (err) {
    res.status(500).send("Internal Server Error");
  }
});

app.get("/top-rated-movies", async (req, res) => {
  try {
    const movies = await movieDB.getTopRatedMovies();
    res.json(movies);
  } catch (err) {
    res.status(500).send("Internal Server Error");
  }
});

app.get("/upcoming-movies", async (req, res) => {
  try {
    const movies = await movieDB.getUpcomingMovies();
    res.json(movies);
  } catch (err) {
    res.status(500).send("Internal Server Error");
  }
});

app.listen(port, () => {
  console.log(`server started on http://localhost:${port}`);
});
