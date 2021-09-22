import express from "express";
import cors from "cors";
// import restaurants from "./api/restaurants.route.js";
import saves from "./api/saves.route.js";

const app = express();

app.use(cors());

app.use(express.json());

// app.use("/api/v1/restaurants", restaurants);
app.use("/api/v1/sequences", saves);

app.use("*", (req, res) => res.status(404).json({ error: "not found" }));

export default app;
