import fs from "node:fs"
import  express  from "express"
import dotenv from "dotenv"
import { SQLiteHandler, Card, User } from "./storage.js"

dotenv.config()


const db = new SQLiteHandler(process.env.DB_FILE)

// executing schema.sql to create tables
await db.executeSchema(fs.readFileSync("src/schema.sql").toString())
    .catch(err=>console.error(err))


const app = express()

app.use(express.urlencoded({extended:true}))
app.use(express.json())

app.listen(process.env.PORT,() => console.log(`Server running on port ${process.env.PORT}`))

const card = new Card(db)
const user = new User(db)

// Card routes
app.get("/cards",async (req,res)=>res.json(await card.getAll()))
app.get("/cards/:id",async (req,res)=>res.json(await card.get(req.params.id)))
app.post("/cards",async (req,res)=>res.json(await card.create(req.body)))
app.patch("/cards/:id",async (req,res)=>res.json(await card.update(req.params.id,req.body)))
app.delete("/cards/:id",async (req,res)=>res.json(await card.delete(req.params.id)))

// User routes 
app.get("/users",async (req,res)=>res.json(await user.getAll()))
app.get("/users/:id",async (req,res)=>res.json(await user.get(req.params.id)))
app.post("/users",async (req,res)=>res.json(await user.create(req.body)))
app.patch("/users/:id",async (req,res)=>res.json(await user.update(req.params.id,req.body)))
app.delete("/users/:id",async (req,res)=>res.json(await user.delete(req.params.id)))

// User cards routes
app.post("/users/:userId/cards/",async (req,res) => res.json(await user.addCard(req.params.userId,req.body.cardId)))
app.delete("/users/:userId/cards/:cardId",async (req,res) => res.json(await user.removeCard(req.params.userId,req.params.cardId)))