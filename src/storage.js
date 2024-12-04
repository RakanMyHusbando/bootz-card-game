import sqlite3 from 'sqlite3'

export class SQLiteHandler {
    /**
     * Creates an instance of SQLiteHandler.
     * @param {string} dbFile - The path to the SQLite database file.
     */
    constructor(dbFile) {
        this.dbFile = dbFile
    }

    /**
     * Executes a SQL query.
     * @param {string} query - The SQL query to execute.
     * @param {any[]} [params=[]] - An optional array of parameters to bind to the query.
     * @returns {Promise<any[]>} - Returns a promise that resolves to an array of rows returned by the query.
     * @private
     */
    #execute = async (query,params=[]) => {
        const db = new sqlite3.Database(this.dbFile)
        return new Promise((reject,resolve)=>{
            if (params.length>0)
                db.all(query,params,(err,rows)=>err ? reject(err) : resolve(rows))
            else
                db.all(query,(err,rows)=>err ? reject(err) : resolve(rows))
            db.close()
        })
    }

    /**
     * Executes a series of SQL queries defined in the schema content.
     * @param {string} schemaContent - The SQL schema content containing multiple queries separated by semicolons.
     * @returns {Promise<Error|null>} - Returns a promise that resolves to null if all queries are executed successfully, or an error if any query fails.
     */
    executeSchema = async (schemaContent) => {
        const errors = []
        let query = schemaContent.replaceAll("\n","").split(";")
        query.pop()
        query.forEach(async query=>{
            await this.#execute(query).catch(err=>errors.push(err))
        })   
        return errors.length>0 ? new Error("Error while executing schema.") : null
    }

    /**
     * Inserts a new row into the specified table.
     * @param {string} table - The name of the table to insert the data into.
     * @param {string[]} columns - An array of column names where the data will be inserted.
     * @param {any[]} values - An array of values to be inserted into the specified columns.
     * @returns {Promise<Error|null>} - Returns a promise that resolves to null if the insertion is successful, or an error if it fails.
     */
    insert = async (table,columns,values) => {
        let query = `INSERT INTO ${table} (${columns.join(",")}) VALUES (${values.map(v=>"?").join(",")})`
        return this.#execute(query,values).catch(err=>console.error(err))
    }


    /**
     * Selects rows from the specified table.
     * @param {string} table - The name of the table to select data from.
     * @param {string[]} columns - An array of column names to be selected.
     * @param {Map<string, any>} [where] - An optional map representing the SQL WHERE clause to filter the selection.
     * @returns {Promise<any[]>} - Returns a promise that resolves to an array of selected rows.
     */
    select = async (table,columns,where) => {
        let query = `SELECT ${columns.join(",")} FROM ${table}`
        if(where){
            query += " WHERE"
            let i = 0
            for(const key in where){
                if (i>0)
                    query += " AND"
                query += ` ${key} = ?`
                i++
            }
        }
        return this.#execute(query)
    }

    /**
     * Updates rows in the specified table.
     * @param {string} table - The name of the table to update data in.
     * @param {string[]} columns - An array of column names to be updated.
     * @param {any[]} values - An array of values to be updated in the specified columns.
     * @param {Map<string, any>} [where] - An optional map representing the SQL WHERE clause to filter the selection.
     * @returns {Promise<Error|null>} - Returns a promise that resolves to null if the update is successful, or an error if it fails.
     */
    update = async (table,columns,values,where) => {
        let query = `UPDATE ${table} SET ${columns.map((c,i)=>`${c} = ?`).join(",")}`
        if(where){
            query += " WHERE"
            let i = 0
            for(const key in where){
                if (i>0)
                    query += " AND"
                query += ` ${key} = ?`
                i++
            }
        }
        return this.#execute(query,values)
    }

    /**
     * Deletes rows from the specified table.
     * @param {string} table - The name of the table to delete data from.
     * @param {Map<string, any>} [where] - An optional map representing the SQL WHERE clause to filter the deletion.
     * @returns {Promise<Error|null>} - Returns a promise that resolves to null if the deletion is successful, or an error if it fails.
     */
    delete = async (table,where) => {
        let query = `DELETE FROM ${table}`
        if(where){
            query += " WHERE"
            let i = 0
            for(const key in where){
                if (i>0)
                    query += " AND"
                query += ` ${key} = ?`
                i++
            }
        }
        return this.#execute(query)
    }
}

export class Card {
    /**
     * Creates an instance of Card.
     * @param {SQLiteHandler} db - The SQLite database handler.
     */
    constructor(db) {
        this.db = db
    }

    /**
     * Retrieves all cards from the database.
     * @returns {Promise<any[]>} - Returns a promise that resolves to an array of cards.
     */
    getAll = async () => this.db.select("card")

    /**
     * Retrieves a card by its ID.
     * @param {number} id - The ID of the card to retrieve.
     * @returns {Promise<any>} - Returns a promise that resolves to the card with the specified ID.
     */
    getById = async (id) => this.db.select("card",["id"],[id])

    /**
     * Inserts a new card into the database.
     * @param {Map<string, any>} card - The card object to insert.
     * @returns {Promise<Error|null>} - Returns a promise that resolves to null if the insertion is successful, or an error if it fails.
     */
    post = async (card) => {
        const keys = []
        const values = []
        for(const key in card){
            keys.push(key)
            values.push(card[key])
        }
        return this.db.insert("card",keys,values)
    }

    /**
     * Updates an existing card in the database.
     * @param {number} id - The ID of the card to update.
     * @param {Map<string, any>} card - The updated card object.
     * @returns {Promise<Error|null>} - Returns a promise that resolves to null if the update is successful, or an error if it fails.
     */
    patch = async (id,card) => {
        const keys = []
        const values = []
        for(const key in card){
            keys.push(key)
            values.push(card[key])
        }
        return this.db.update("card",keys,values,["id"],[id])
    }

    /**
     * Deletes a card from the database.
     * @param {number} id - The ID of the card to delete.
     * @returns {Promise<Error|null>} - Returns a promise that resolves to null if the deletion is successful, or an error if it fails.
     */
    delete = async (id) => this.db.delete("card",["id"],[id])
}

export class User {
    /**
     * Creates an instance of User.
     * @param {SQLiteHandler} db - The SQLite database handler.
     */
    constructor(db) {
        this.db = db
    }

    /**
     * Retrieves all cards owned by a user.
     * @param {number} userid - The ID of the user to retrieve the cards for.
     * @returns {Promise<any[]>} - Returns a promise that resolves to an array of cards owned by the user.
     * @private
     */
    #getUserCards = async (userid) => {
        const userCards = await this.db.select("user_card",["card_id","own_amount"],{user_id:userid})
        const cards = []
        for(const userCard of userCards){
            const card = await this.db.select("card",["id","title","description","type","attack","defense","health"],{id:userCard.card_id})
            cards.push({...card[0],own_amount:userCard.own_amount})
        }
        return cards
    }

    /**
     * Retrieves all users from the database.
     * @returns {Promise<any[]>} - Returns a promise that resolves to an array of users.
     */
    getAll = async () => await this.db.select("user",["*"])
        .then(async users => {
            for (const user of users) 
                user.cards = await this.#getUserCards(user.id)
            return users
        })
        .catch(err=>console.error(err))

    /**
     * Retrieves a user by their ID.
     * @param {number} id - The ID of the user to retrieve.
     * @returns {Promise<any>} - Returns a promise that resolves to the user with the specified ID.
     */
    getById = async (id) => this.db.select("user",["id"],[id])
        .then(async user => { 
            user.cards = await this.#getUserCards(user.id)
            return user
        })

    /**
     * Inserts a new user into the database.
     * @param {Map<string, any>} user - The user object to insert.
     * @returns {Promise<Error|null>} - Returns a promise that resolves to null if the insertion is successful, or an error if it fails.
     */
    post = async (user) => {
        const keys = []
        const values = []
        for(const key in user){
            keys.push(key)
            values.push(user[key])
        }
        return this.db.insert("user",keys,values)
    }

    /**
     * Inserts a new card into the user's collection.
     * @param {number} userid - The ID of the user to insert the card for.
     * @param {Map<string, any>} card - The card object to insert.
     * @returns {Promise<Error|null>} - Returns a promise that resolves to null if the insertion is successful, or an error if it fails.
     */
    postCard = async (userid,cardId) => {
        const userCard = await this.db.select("user_card",["*"],{user_id:userid,card_id:cardId})
        if (userCard.length>0)
            return this.db.update("user_card",["own_amount"],[ownAmount[0].own_amount+1],["user_id","card_id"],[userid,cardId])
        else
            return this.db.insert("user_card",["user_id","card_id","own_amount"],[userid,cardId,1])
    }

    /**
     * Updates an existing user in the database.
     * @param {number} id - The ID of the user to update.
     * @param {Map<string, any>} user - The updated user object.
     * @returns {Promise<Error|null>} - Returns a promise that resolves to null if the update is successful, or an error if it fails.
     */
    patch = async (id,user) => {
        const keys = []
        const values = []
        for(const key in user){
            keys.push(key)
            values.push(user[key])
        }
        return this.db.update("user",keys,values,["id"],[id])
    }

    /**
     * Deletes a user from the database.    
     * @param {number} id - The ID of the user to delete.
     * @returns {Promise<Error|null>} - Returns a promise that resolves to null if the deletion is successful, or an error if it fails.
     */
    delete = async (id) => this.db.delete("user",["id"],[id])

    /**
     * Deletes a card from the user's collection.
     * @param {number} userid - The ID of the user to delete the card from.
     * @param {number} cardid - The ID of the card to delete.
     * @returns {Promise<Error|null>} - Returns a promise that resolves to null if the deletion is successful, or an error if it fails.
     */
    deleteCard = async (userid,cardid) => {
        const ownAmount = await this.db.select("user_card",["own_amount"],{user_id:userid,card_id:cardid})
        if (ownAmount[0].own_amount>1)
            return this.db.update("user_card",["own_amount"],[ownAmount[0].own_amount-1],["user_id","card_id"],[userid,cardid])
        else
            return this.db.delete("user_card",["user_id","card_id"],[userid,cardid])
    }
}


