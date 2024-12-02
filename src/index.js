import sqlite3 from 'sqlite3'
import fs from "node:fs"
import { execute, createCard } from "./sqlite.js"

try {
    const db = new sqlite3.Database("datebase.db")
    const f = fs.readFileSync("cards.json")

    JSON.parse(f).forEach(card => {
        createCard(db, card)
    })

    db.close()
} catch (e) {
    console.error(e)
}d