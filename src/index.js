import fs from "node:fs"
import  express  from "express"
import dotenv from "dotenv"
import { Storage } from "./storage.js"
import { CardHandler, UserHandler } from "./api.js"

dotenv.config()


const db = new Storage(process.env.DB_FILE)

// executing schema.sql to create tables
await db.executeSchema(fs.readFileSync("src/schema.sql").toString())
    .catch(err=>console.error(err))


const app = express()

app.use(express.urlencoded({extended:true}))
app.use(express.json())

app.listen(process.env.PORT,() => console.log(`Server running on  http://127.0.0.1:${process.env.PORT}`))

const cardHandler = new CardHandler(process.env.DB_FILE)

// Card routes
app.post("/cards", async (req,res) => await cardHandler.handlePost(req,res))
app.get("/cards", async (req,res) => await cardHandler.handleGetAll(req,res))
app.get("/cards/:id", async (req,res) => await cardHandler.handleGetById(req,res))
app.patch("/cards/:id", async (req,res) => await cardHandler.handlePatch(req,res))
app.delete("/cards/:id", async (req,res) => await cardHandler.handleDelete(req,res))


const userHandler = new UserHandler(process.env.DB_FILE)

// User routes
app.post("/users", async (req,res) => await userHandler.handlePost(req,res))
app.get("/users", async (req,res) => await userHandler.handleGetAll(req,res))
app.get("/users/:id", async (req,res) => await userHandler.handleGetById(req,res))
app.patch("/users/:id", async (req,res) => await userHandler.handlePatch(req,res))
app.delete("/users/:id", async (req,res) => await userHandler.handleDelete(req,res))