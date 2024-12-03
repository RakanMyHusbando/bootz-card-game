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
     * @param {string} [where] - An optional SQL WHERE clause to filter the selection.
     * @returns {Promise<any[]>} - Returns a promise that resolves to an array of selected rows.
     */
    select = async (table,columns,where) => {
        let query = `SELECT ${columns.join(",")} FROM ${table}`
        if(where)
            query += ` WHERE ${where}`
        return this.#execute(query)
    }

    /**
     * Updates rows in the specified table.
     * @param {string} table - The name of the table to update data in.
     * @param {string[]} columns - An array of column names to be updated.
     * @param {any[]} values - An array of values to be updated in the specified columns.
     * @param {string} [where] - An optional SQL WHERE clause to filter the update.
     * @returns {Promise<Error|null>} - Returns a promise that resolves to null if the update is successful, or an error if it fails.
     */
    update = async (table,columns,values,where) => {
        let query = `UPDATE ${table} SET ${columns.map((c,i)=>`${c} = ?`).join(",")}`
        if(where)
            query += ` WHERE ${where}`
        return this.#execute(query,values)
    }

    /**
     * Deletes rows from the specified table.
     * @param {string} table - The name of the table to delete data from.
     * @param {string} [where] - An optional SQL WHERE clause to filter the deletion.
     * @returns {Promise<Error|null>} - Returns a promise that resolves to null if the deletion is successful, or an error if it fails.
     */
    delete = async (table,where) => {
        let query = `DELETE FROM ${table}`
        if(where)
            query += ` WHERE ${where}`
        return this.#execute(query)
    }
}


/**
 * Represents a Card handler that extends SQLiteHandler.
 * Provides methods to select cards from the database.
 */
export class Card extends SQLiteHandler {
    /**
     * Creates an instance of Card.
     * @param {string} dbFile - The path to the SQLite database file.
     */
    constructor(dbFile) {
        super(dbFile);
    }

    /**
     * Selects a random card from the database.
     * @returns {Promise<Object>} A promise that resolves to a random card object.
     */
    SelectRandomCard = async () => {
           // TODO: better randomization
           return his.select("card",["*"])
           .then(rows=>rows[Math.floor(Math.random()*rows.length)])
    }

    /**
     * Selects cards from the database by type.
     * @param {string} type - The type of the card.
     * @returns {Promise<Array<Object>>} A promise that resolves to an array of card objects of the specified type.
     */
    SelectCardByType = async (type) => {
        return this.select("card",["*"],`type = "${type}"`)
    }

    /**
     * Selects cards from the database by type and value.
     * @param {string} type - The type of the card.
     * @param {string|number} value - The value of the card.
     * @returns {Promise<Array<Object>>} A promise that resolves to an array of card objects that match the specified type and value.
     */
    SelectCardByTypeAndValue = async (type, value) => {
        return this.select("card",["*"],`type = "${type}" AND value = "${value}"`)
    }

    /**
     * Selects cards from the database by value.
     * @param {string|number} value - The value of the card.
     * @returns {Promise<Array<Object>>} A promise that resolves to an array of card objects that match the specified value.
     */
    SelectCardByValue = async (value) => {
        return this.select("card",["*"],`value = "${value}"`)
    }
}

