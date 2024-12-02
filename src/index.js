import sqlite3 from 'sqlite3'
import fs from "node:fs"
import { execute, createCard } from "./sqlite.js"

try {
    let db = new sqlite3.Database("data.db")

    // create table
    const schemaFile = fs.readFileSync("src/schema.sql").toString()
    const table = schemaFile.replaceAll("\n","").split(";")
    table.pop()
    table.forEach(async query => {
        await execute(db, query)
        console.log(`Created table: ${query.split(" ")[5]}`)
    })
    
    db.close()
    db = new sqlite3.Database("data.db")

    // create cards
    const cardsFile = fs.readFileSync("src/cards.json")
    JSON.parse(cardsFile).forEach(card => {
        createCard(db, card)
    })    

    db.close()
} catch (e) {
    console.error(e)
}
