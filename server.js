import express from "express";
import cors from "cors";
import knex from "knex";

import { handleApiCall, updateEntries } from "./controllers/image.js";
import { signIn, register, findAllUsers } from "./controllers/user.js";
const db = knex({
  client: "postgres",
  connection: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

const app = express();
const saltRounds = 10;

app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.get("/", (req, res) => {
  findAllUsers(req, res, db);
});

app.post("/signin", (req, res) => {
  signIn(req, res, db);
});

app.post("/register", (req, res) => {
  register(req, res, db);
});

app.post("/imageurl", (req, res) => handleApiCall(req, res, db));

app.put("/image", (req, res) => updateEntries(req, res, db));

app.listen(process.env.PORT || 3000, () => {
  console.log("app is running on port 3000");
});
