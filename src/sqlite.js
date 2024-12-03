import sqlite3 from 'sqlite3'

export const execute = async (db,query,params=[]) => {
    if (params.length>0){
        return new Promise((reject,resolve)=>{
            db.all(query,params,(err,rows)=>{
                if(err) reject(err)
                resolve(rows)
            })
        })
    }
    return new Promise((resolve,reject)=>{
        db.exec(query,(err)=>{
            if(err) reject(err)
            resolve(err)
        })
    })
}

const connectAndExecute = async (dbFile,query,params=[]) => {
    const db = new sqlite3.Database(dbFile)
    const result = await execute(db,query,params)
        .then(res=>result=res)
        .catch(err=>null)
    db.close()
    console.log(result)
    return result
}

class dbHandler {
    constructor(dbFile) {
        this.dbFile = dbFile
    }
}

export const createCard = async (db,cardMap) => {
    for(const key in cardMap)
        if(cardMap[key] == undefined && cardMap[key] == null)
            return new Error(`Missing key: ${key}`)  
        
    return execute(db,
        `INSERT INTO Card (
            title,
            description,
            type,
            rarity,
            attack,
            defense,
            health
        ) VALUES (?,?,?,?,?,?,?)`, [
            cardMap["title"],
            cardMap["description"],
            cardMap["type"],
            cardMap["rarity"],
            cardMap["attack"],
            cardMap["defense"],
            cardMap["health"]
        ]
    )
}