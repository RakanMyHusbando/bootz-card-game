import fs from "node:fs";
import express from "express";
import dotenv from "dotenv";
import { Storage } from "./storage.js";
import { ApiHandler } from "./api.js";

dotenv.config();

// executing schema.sql to create tables
const db = new Storage(process.env.DB_FILE);
db.executeSchema(fs.readFileSync("src/schema.sql").toString());
db.close();

const apiHandler = new ApiHandler(process.env.DB_FILE);
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.listen(process.env.PORT, () =>
    console.log(`Server running on  http://127.0.0.1:${process.env.PORT}`),
);

// Card routes
app.post("/card", (req, res) => apiHandler.CardPost(req, res));
app.get("/card", (req, res) => apiHandler.CardGetAll(req, res));
app.get("/card/:id", (req, res) => apiHandler.CardGetById(req, res));
app.patch("/card/:id", (req, res) => apiHandler.CardPatch(req, res));
app.delete("/card/:id", (req, res) => apiHandler.CardDelete(req, res));
app.get("/cards/randomCard", (req, res) => apiHandler.GetRamdomCard(req, res));

// User routes
app.post("/user", (req, res) => apiHandler.UserPost(req, res));
app.get("/user", (req, res) => apiHandler.UserGetAll(req, res));
app.get("/user/:id", (req, res) => apiHandler.UserGetById(req, res));
app.patch("/user/:id", (req, res) => apiHandler.UserPatch(req, res));
app.delete("/user/:id", (req, res) => apiHandler.UserDelete(req, res));

// User-Card routes
app.post("/user/:userId/card/:cardId", (req, res) =>
    apiHandler.UserCardPost(req, res),
);
app.post("/user/:userId/card", (req, res) =>
    apiHandler.UserCardPostUnkown(req, res),
);
app.delete("/user/:userId/card/:cardId", (req, res) =>
    apiHandler.UserCardDelete(req, res),
);
app.delete("/user/:userId/card", (req, res) =>
    apiHandler.UserCardDeleteUnkown(req, res),
);
