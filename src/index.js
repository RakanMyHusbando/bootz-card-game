import fs from "node:fs"
import { SQLiteHandler } from "./sqlite.js"

const db = new SQLiteHandler("data.db")

// executing schema.sql to create tables
await db.executeSchema(fs.readFileSync("src/schema.sql").toString())
    .catch(err=>console.error(err))


// adding cards from cards.json to database 
const cardJson = JSON.parse(fs.readFileSync("src/cards.json"))
for (const card of cardJson) {
    const keys = []
    const values = []
    for(const key in card){
        keys.push(key)
        values.push(card[key])
    }

    db.insert("card",keys,values)
        .catch(err=>console.error(err+"for card: "+card))
}


