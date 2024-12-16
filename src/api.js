import { Storage } from "./storage.js";

const formApiResponse = (res, status, data, message) => {
    console.log(message);
    const body = {
        status: status,
        data: data,
        message: message.toString(),
    };
    res.json(body).status(status);
};

export class ApiHandler extends Storage {
    /**
     * Creates an instance of ApiHandler.
     * @param {string} dbFile - The path to the SQLite database file.
     * @param {number} [timeout=5000] - The timeout for the SQLite database connection.
     */
    constructor(dbFile, timeout = 5000) {
        super(dbFile, timeout);
    }

    /**
     * Search for query parameters in the request object.
     * @param {string[]} params - A list of expected query parameters.
     * @param {Object} req - The request object.
     */
    #QueryParams(req, params) {
        const where = {};
        let found = false;
        for (const key of params) {
            if (req.query[key]) {
                where[key] = req.query[key];
                found = true;
            }
        }
        return found ? where : null;
    }

    /* -------------------------------------------- Card Handler -------------------------------------------- */

    #cardKeys = ["name", "type_id", "rarity_id"];

    /**
     * Handle POST request to create a new card.
     * @param {Object} req - The request object.
     * @param {Object} req.params - The request parameters.
     * @param {string} req.params.id - The id of the card.
     * @param {Object} req.body - The body of the request.
     * @param {string} req.body.title - The title of the card.
     * @param {string} req.body.description - The description of the card.
     * @param {string} req.body.type - The type of the card.
     * @param {Object} req.body.rarity - The rarity of the card.
     * @param {number} req.body.attack - The attack value of the card.
     * @param {number} req.body.defense - The defense value of the card.
     * @param {number} req.body.health - The health value of the card.
     * @param {Object} res - The response object.
     * @returns {void}
     */
    PostCard(req, res) {
        const columns = [];
        const values = [];
        try {
            for (const elem of this.#cardKeys) {
                let key = elem;
                let value = req.body[key];
                if (elem.includes("_id")) {
                    key = elem.replace("_id", "");
                    value = this.select(key, ["id"], { name: req.body[key] })[0]
                        .id;
                }
                if (!value) throw new Error("Missing required fields");
                values.push(value);
                columns.push(elem);
            }
            this.insert("card", columns, values);
            formApiResponse(res, 200, null, "Card created");
        } catch (err) {
            return formApiResponse(res, 500, null, err);
        }
    }

    /**
     * Handle GET request to get all cards.
     * @param {Object} req - The request object.
     * @param {Object} res - The response object.
     * @returns {void}
     */
    GetCard(req, res) {
        const data = [];
        try {
            const rows = this.select(
                "card",
                ["*"],
                this.#QueryParams(req, this.#cardKeys),
            );
            rows.forEach((row) => {
                const rowResp = {
                    id: row.id,
                    rarity: this.select("rarity", ["name"], {
                        id: row.rarity_id,
                    })[0].name,
                    type: this.select("type", ["name"], {
                        id: row.type_id,
                    })[0].name,
                };
                for (const key of this.#cardKeys)
                    if (!key.includes("_id")) rowResp[key] = row[key];
                data.push(rowResp);
            });
            if (data.length === 0)
                formApiResponse(res, 404, null, "No cards found");
            else formApiResponse(res, 200, data, "Card retrieved");
        } catch (err) {
            formApiResponse(res, 500, null, err);
        }
    }

    /**
     * Handle PATCH request to update a card by id.
     * @param {Object} req - The request object.
     * @param {Object} req.params - The request parameters.
     * @param {string} req.params.id - The id of the card.
     * @param {Object} req.body - The body of the request.
     * @param {string} [req.body.title] - The title of the card.
     * @param {string} [req.body.description] - The description of the card.
     * @param {string} [req.body.type] - The type of the card.
     * @param {Object} [req.body.rarity] - The rarity of the card.
     * @param {number} [req.body.attack] - The attack value of the card.
     * @param {number} [req.body.defense] - The defense value of the card.
     * @param {number} [req.body.health] - The health value of the card.
     * @param {Object} res - The response object.
     * @returns {void}
     */
    PatchCard(req, res) {
        const columns = [];
        const values = [];
        try {
            for (const elem of this.#cardKeys) {
                let key = elem;
                let value = req.body[key];
                if (elem.includes("_id")) {
                    key = elem.replace("_id", "");
                    value = this.select(key, ["id"], { name: req.body[key] });
                }
                if (value) {
                    values.push(value);
                    columns.push(key);
                }
            }
            this.update("card", columns, values, {
                id: parseInt(req.params.id),
            });
            formApiResponse(res, 200, null, "Card updated");
        } catch (err) {
            formApiResponse(res, 500, null, err);
        }
    }

    /**
     * Handle DELETE request to delete a card by id.
     * @param {Object} req - The request object.
     * @param {Object} req.params - The request parameters.
     * @param {string} req.params.id - The id of the card.
     * @param {Object} res - The response object.
     * @returns {void}
     */
    DeleteCard(req, res) {
        try {
            this.delete("card", { id: parseInt(req.params.id) });
            formApiResponse(res, 200, data, "Card deleted");
        } catch (err) {
            formApiResponse(res, 500, null, err);
        }
    }

    /* -------------------------------------------- User Handler -------------------------------------------- */

    #userKeys = ["name", "discord_id"];

    /**
     * Handle POST request to create a new user.
     * @param {Object} req - The request object.
     * @param {Object} req.body - The body of the request.
     * @param {string} req.body.name - The name of the user.
     * @param {string} req.body.discord_id - The discord id of the user.
     * @param {Object} res - The response object.
     * @returns {void}
     */
    PostUser(req, res) {
        const data = [];
        try {
            for (const key of this.#userKeys) {
                if (!req.body[key]) throw new Error("Missing required fields");
                data.push(req.body[key]);
            }
            data.push(0);
            this.insert("user", this.#userKeys.concat("packs"), data);
            formApiResponse(res, 200, null, "User created");
        } catch (err) {
            if (
                err.message ==
                "SqliteError: UNIQUE constraint failed: user.discord_id"
            ) {
                formApiResponse(
                    res,
                    424,
                    null,
                    new Error("Discord-ID already exists"),
                );
            } else if (
                err.message ==
                "SqliteError: UNIQUE constraint failed: user.name"
            ) {
                formApiResponse(
                    res,
                    424,
                    null,
                    new Error("Name already exists"),
                );
            }
        }
    }

    /**
     * Handle GET request to get all users.
     * @param {Object} req - The request object.
     * @param {Object} res - The response object.
     * @returns {void}
     */
    GetUser(req, res) {
        try {
            const rows = this.select(
                "user",
                ["*"],
                this.#QueryParams(req, this.#userKeys),
            );
            if (rows.length > 0) {
                for (let i = 0; i < rows.length; i++) {
                    rows[i].cards = this.#GetUserCard(rows[i].id);
                }
                formApiResponse(res, 200, rows, "User retrieved");
            } else formApiResponse(res, 404, null, "No user found");
        } catch (err) {
            formApiResponse(res, 500, null, err);
        }
    }

    /**
     * Handle PATCH request to update a user by id.
     * @param {Object} req - The request object.
     * @param {Object} req.params - The request parameters.
     * @param {string} req.params.id - The id of the user.
     * @param {Object} req.body - The body of the request.
     * @param {string} [req.body.name] - The name of the user.
     * @param {string} [req.body.discord_id] - The discord id of the user.
     * @param {Object} res - The response object.
     * @returns {void}
     */
    PatchUser(req, res) {
        const data = [];
        try {
            for (const key of this.#userKeys)
                if (req.body[key]) data.push(req.body[key]);
            this.update("user", this.#userKeys, values, {
                id: parseInt(req.params.id),
            });
            formApiResponse(res, 200, null, "User updated");
        } catch (err) {
            formApiResponse(res, 500, null, err);
        }
    }

    /**
     * Handle DELETE request to delete a user by id.
     * @param {Object} req - The request object.
     * @param {Object} req.params - The request parameters.
     * @param {string} req.params.id - The id of the user.
     * @param {Object} res - The response object.
     * @returns {void}
     */
    DeleteUser(req, res) {
        try {
            this.#GetUserCard(req.params.id).forEach((card) =>
                this.delete("user_card", {
                    user_id: parseInt(req.params.id),
                    card_id: card.id,
                }),
            );
            this.delete("user", { id: parseInt(req.params.id) });
            formApiResponse(res, 200, null, "User deleted");
        } catch (err) {
            formApiResponse(res, 500, null, err);
        }
    }

    /* -------------------------------------------- User-Card Handler -------------------------------------------- */

    /**
     * Handle POST request to add a card to a user's collection.
     * @param {Object} req - The request object.
     * @param {Object} req.params - The request parameters.
     * @param {string} req.params.userId - The id of the user.
     * @param {string} req.params.cardId - The id of the card.
     * @param {Object} res
     * @returns {void}
     */
    PostUserCard(req, res) {
        try {
            const userCards = this.#GetUserCard(
                parseInt(req.params.userId),
                parseInt(req.params.cardId),
            );
            const amount = userCards.length > 0 ? userCards[0].owned : null;
            if (amount) {
                this.update("user_card", ["owned"], [amount + 1], {
                    user_id: parseInt(req.params.userId),
                    card_id: parseInt(req.params.cardId),
                });
                formApiResponse(res, 200, null, "User card updated");
            } else {
                this.insert(
                    "user_card",
                    ["user_id", "card_id", "owned"],
                    [
                        parseInt(req.params.userId),
                        parseInt(req.params.cardId),
                        1,
                    ],
                );
                formApiResponse(res, 200, null, "User card created");
            }
        } catch (err) {
            formApiResponse(res, 500, null, err);
        }
    }

    /**
     * Handle DELETE request to delete a card from a user.
     * @param {Object} req - The request object.
     * @param {Object} req.params - The request parameters.
     * @param {string} req.params.userId - The id of the user.
     * @param {Object} req.params.cardId - The id of the card.
     * @param {Object} res - The response object.
     * @returns {void}
     */
    DeleteUserCard(req, res) {
        try {
            const userCards = this.#GetUserCard(
                parseInt(req.params.userId),
                parseInt(req.params.cardId),
            );
            const amount = userCards.length > 0 ? userCards[0].owned : null;
            if (amount) {
                this.update("user_card", ["owned"], [amount - 1], {
                    user_id: parseInt(req.params.userId),
                    card_id: parseInt(req.params.cardId),
                });
                formApiResponse(res, 200, null, "User card updated");
            } else {
                this.delete("user_card", {
                    user_id: parseInt(req.params.userId),
                    card_id: parseInt(req.params.cardId),
                });
                formApiResponse(res, 200, null, "User card deleted");
            }
        } catch (err) {
            formApiResponse(res, 500, null, err);
        }
    }

    /**
     * Get user cards.
     * @param {number} userId - The id of the user.
     * @param {number} cardId - The id of the card.
     * @returns {Object[]} - Returns an array of user cards.
     */
    #GetUserCard = (userId, cardId) => {
        try {
            const select = ["owned"];
            const where = { user_id: userId };

            if (cardId) where.card_id = cardId;
            else select.push("card_id");

            return this.select("user_card", select, where);
        } catch (err) {
            console.error(err);
            return [];
        }
    };
}
