import fs from "node:fs";
import express from "express";
import dotenv from "dotenv";
import { marked } from "marked";
import { ApiHandler } from "./api.js";

dotenv.config();

const apiHandler = new ApiHandler(process.env.DB_FILE);

apiHandler.executeSchema(fs.readFileSync("src/schema.sql").toString());

const data = fs.readFileSync("./src/insert.json");
for (const elem of JSON.parse(data)) {
    for (const row of elem.values) {
        const columns = [];
        const values = [];
        for (const key in row) {
            columns.push(key);
            values.push(row[key]);
        }
        if (
            apiHandler.select(elem.table, ["*"], { name: row.name }).length == 0
        )
            apiHandler.insert(elem.table, columns, values);
    }
}

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const server = app.listen(process.env.PORT, () =>
    console.log(`Server running on  http://127.0.0.1:${process.env.PORT}`),
);

server.setTimeout(3000);

// Home route
app.get("/", (req, res) => {
    const readme = fs.readFileSync("README.md").toString();
    res.send(marked(readme.substring(readme.indexOf("## API Endpoints"))));
});

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
app.patch("/user/:userId/card/random", (req, res) =>
    apiHandler.PatchRamdomCard(req, res),
);
app.delete("/user/:userId/card/:cardId", (req, res) =>
    apiHandler.DeleteUserCard(req, res),
);

// User-Pack routes
// app.post("/user/:userId/pack", (req, res) => apiHandler.PostPack(req, res));
// app.patch("/user/:userId/pack", (req, res) => apiHandler.PatchPack(req, res));
