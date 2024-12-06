import sqlite3 from 'better-sqlite3'

export class Storage {
    /**
     * Creates an instance of Storage.
     * @param {string} dbFile - The path to the SQLite database file.
     * @param {number} [timeout=5000] - The timeout for the SQLite database connection.
     */
    constructor(dbFile, timeout = 5000) {
        this.db = new sqlite3(dbFile, { timeout: timeout });
        process.on('SIGINT', () => {
            this.close();
            process.exit(0);
        });
    }

    /**
     * Closes the connection to the SQLite database.
     */
    close() {
        this.db.close();
        console.log("Connection closed.");
    }

    /**
     * Executes a series of SQL queries defined in the schema content.
     * @param {string} schemaContent - The SQL schema content containing multiple queries separated by semicolons.
     * @returns {null} - Returns null if all queries are executed successfully, or an error if any query fails.
     */
    executeSchema(schemaContent) {
        const queries = schemaContent.replace(/\n/g, "").split(";").filter(Boolean);
        try {
            this.db.transaction(() => {
                for (const query of queries) {
                    const stmt = this.db.prepare(query);
                    stmt.run();
                }
            })();
            return null;
        } catch (err) {
            console.error(err);
        }
    }

    /**
     * Inserts a new row into the specified table.
     * @param {string} table - The name of the table to insert the data into.
     * @param {string[]} columns - An array of column names where the data will be inserted.
     * @param {any[]} values - An array of values to be inserted into the specified columns.
     * @returns {Error|null} - Returns null if the insertion is successful, or an error if it fails.
     */
    insert(table, columns, values) {
        let query = `INSERT INTO ${table} (${columns.join(",")}) VALUES (${values.map(v => "?").join(",")})`;
        try {
            const stmt = this.db.prepare(query);
            stmt.run(...values);
            return null;
        } catch (err) {
            throw err;
        }
    }

    /**
     * Selects rows from the specified table.
     * @param {string} table - The name of the table to select data from.
     * @param {string[]} columns - An array of column names to be selected.
     * @param {Object} [where] - An optional object representing the SQL WHERE clause to filter the selection.
     * @returns {any[]|Error} - Returns an array of selected rows or Error.
     */
    select(table, columns, where) {
        let query = `SELECT ${columns.join(",")} FROM ${table}`;
        const params = [];
        if (where) {
            query += " WHERE";
            let i = 0;
            for (const key in where) {
                params.push(where[key]);
                if (i > 0)
                    query += " AND";
                query += ` ${key} = ?`;
                i++;
            }
        }
        try {
            const stmt = this.db.prepare(query);
            return stmt.all(...params);
        } catch (err) {
            throw err;
        }
    }

    /**
     * Updates rows in the specified table.
     * @param {string} table - The name of the table to update data in.
     * @param {string[]} columns - An array of column names to be updated.
     * @param {any[]} values - An array of values to be updated in the specified columns.
     * @param {Object} [where] - An optional object representing the SQL WHERE clause to filter the selection.
     * @returns {Promise<Error|null>} - Returns a promise that resolves to null if the update is successful, or an error if it fails.
     */
    update(table, columns, values, where) {
        let query = `UPDATE ${table} SET ${columns.map((c, i) => `${c} = ?`).join(",")}`;
        const params = values;
        if (where) {
            query += " WHERE";
            let i = 0;
            for (const key in where) {
                if (i > 0)
                    query += " AND";
                query += ` ${key} = ?`;
                i++;
                params.push(where[key]);
            }
        }
        try {
            const stmt = this.db.prepare(query);
            stmt.run(...params);
            return null;
        } catch (err) {
            throw err;
        }
    }

    /**
     * Deletes rows from the specified table.
     * @param {string} table - The name of the table to delete data from.
     * @param {Object} [where] - An optional object representing the SQL WHERE clause to filter the deletion.
     * @returns {Error|null} - Returns null if the deletion is successful, or an error if it fails.
     */
    delete(table, where) {
        let query = `DELETE FROM ${table}`;
        const params = [];
        if (where) {
            query += " WHERE";
            let i = 0;
            for (const key in where) {
                if (i > 0)
                    query += " AND";
                query += ` ${key} = ?`;
                i++;
                params.push(where[key]);
            }
        }
        try {
            const stmt = this.db.prepare(query);
            stmt.run(...params);
            return null;
        } catch (err) {
            throw err;
        }
    }
}