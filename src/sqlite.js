import sqlite3 from 'sqlite3'

export class SQLiteHandler {
    constructor(dbFile) {
        this.dbFile = dbFile
    }

    #exectue = async (query,params=[]) => {
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
            await this.#exectue(query).catch(err=>errors.push(err))
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
        return this.#exectue(query,values).catch(err=>console.error(err))
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
        return this.#exectue(query)
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
        return this.#exectue(query,values)
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
        return this.#exectue(query)
    }
}