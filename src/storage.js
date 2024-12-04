import sqlite3 from 'sqlite3'

export class Storage {
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
     * @returns {Promise<any[]|Error>} - Returns a promise that resolves to an array of rows returned by the query, or an error object if the query fails.
     * @private
     */
    #execute = async (query,params=[]) => new Promise((resolve, reject) => {
        const db = new sqlite3.Database(this.dbFile)
        if (params.length > 0)
            db.all(query, params, (err, rows) => err ? reject(err) : resolve(rows))
        else
            db.all(query, (err, rows) => err ? reject(err) : resolve(rows))
        db.close()
    })

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
            await this.#execute(query)
                .catch(err=>errors.push(err))
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
        return this.#execute(query,values)
    }


    /**
     * Selects rows from the specified table.
     * @param {string} table - The name of the table to select data from.
     * @param {string[]} columns - An array of column names to be selected.
     * @param {Object} [where] - An optional object representing the SQL WHERE clause to filter the selection.
     * @returns {Promise<any[]>} - Returns a promise that resolves to an array of selected rows.
     */
    select = async (table,columns,where) => {
        let query = `SELECT ${columns.join(",")} FROM ${table}`
        const params = []
        if(where){
            query += " WHERE"
            let i = 0
            for(const key in where){
                params.push(where[key])
                if (i>0)
                    query += " AND"
                query += ` ${key} = ?`
                i++
            }
        }
        return this.#execute(query,params)
    }

    /**
     * Updates rows in the specified table.
     * @param {string} table - The name of the table to update data in.
     * @param {string[]} columns - An array of column names to be updated.
     * @param {any[]} values - An array of values to be updated in the specified columns.
     * @param {Object} [where] - An optional object representing the SQL WHERE clause to filter the selection.
     * @returns {Promise<Error|null>} - Returns a promise that resolves to null if the update is successful, or an error if it fails.
     */
    update = async (table,columns,values,where) => {
        let query = `UPDATE ${table} SET ${columns.map((c,i)=>`${c} = ?`).join(",")}`
        const params = values
        if(where){
            query += " WHERE"
            let i = 0
            for(const key in where){
                if (i>0)
                    query += " AND"
                query += ` ${key} = ?`
                i++
                params.push(where[key])
            }
        }
        return this.#execute(query,params)
    }

    /**
     * Deletes rows from the specified table.
     * @param {string} table - The name of the table to delete data from.
     * @param {Object} [where] - An optional object representing the SQL WHERE clause to filter the deletion.
     * @returns {Promise<Error|null>} - Returns a promise that resolves to null if the deletion is successful, or an error if it fails.
     */
    delete = async (table,where) => {
        let query = `DELETE FROM ${table}`
        const columns = []
        if(where){
            query += " WHERE"
            let i = 0
            for(const key in where){
                if (i>0)
                    query += " AND"
                query += ` ${key} = ?`
                i++
                columns.push(where[key])
            }
        }
        return this.#execute(query, columns.length>0 ? columns : undefined)
    }
}