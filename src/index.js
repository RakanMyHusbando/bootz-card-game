import fs from "node:fs";
import express from "express";
import dotenv from "dotenv";
import { ApiHandler } from "./api.js";

dotenv.config();

const apiHandler = new ApiHandler(process.env.DB_FILE);
apiHandler.executeSchema(fs.readFileSync("src/schema.sql").toString());

const types = ["player", "staffmember", "champion", "skin"];
const rarities = [
    { name: "common", chance: 60 },
    { name: "rare", chance: 25 },
    { name: "epic", chance: 10 },
    { name: "legendary", chance: 4 },
    { name: "mythic", chance: 1 },
];

for (const type of types) {
    apiHandler.insert("type", ["name"], [type]);
}

for (const rarity of rarities) {
    apiHandler.insert(
        "rarity",
        ["name", "chance"],
        [rarity.name, rarity.chance],
    );
}

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.listen(process.env.PORT, () =>
    console.log(`Server running on  http://127.0.0.1:${process.env.PORT}`),
);

// Card routes
app.post("/card", (req, res) => apiHandler.PostCard(req, res));
app.get("/card", (req, res) => apiHandler.GetCard(req, res));
app.patch("/card/:id", (req, res) => apiHandler.PatchCard(req, res));
app.delete("/card/:id", (req, res) => apiHandler.DeleteCard(req, res));

// User routes
app.post("/user", (req, res) => apiHandler.PostUser(req, res));
app.get("/user", (req, res) => apiHandler.GetUser(req, res));
app.patch("/user/:id", (req, res) => apiHandler.PatchUser(req, res));
app.delete("/user/:id", (req, res) => apiHandler.DeleteUser(req, res));

// User-Card routes
app.post("/user/:userId/card/:cardId", (req, res) =>
    apiHandler.PostUserCard(req, res),
);
app.post("/user/:userId/card", (req, res) =>
    apiHandler.PostUnkownUserCard(req, res),
);
app.delete("/user/:userId/card/:cardId", (req, res) =>
    apiHandler.DeleteUserCard(req, res),
);
app.delete("/user/:userId/card", (req, res) =>
    apiHandler.DeleteUnknownUserCard(req, res),
);
app.patch("/user/:userId/card/random", (req, res) =>
    apiHandler.PatchRamdomCard(req, res),
);
