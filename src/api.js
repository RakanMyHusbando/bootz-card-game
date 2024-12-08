import { Storage } from "./storage.js";

const formApiResponse = (res, status, data, message) => {
    console.log(message);
    const body = {
        status: status,
        data: data,
        message: message.toString(),
    };
    res.status(status);
    res.json(body);
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

    /* -------------------------------------------- Card Handler -------------------------------------------- */

    #cardKeys = [
        "title",
        "description",
        "type",
        "rarity",
        "attack",
        "defense",
        "health",
    ];

    #StorageToRespData = (storageData) => {
        return {
            id: storageData.id,
            title: storageData.title,
            description: storageData.description,
            type: storageData.type,
            rarity: storageData.rarity,
            attack: storageData.attack,
            defense: storageData.defense,
            health: storageData.health,
        };
    };

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
     * @returns {null}
     */
    CardPost(req, res) {
        const data = [];
        try {
            for (const key of this.#cardKeys) {
                if (!req.body[key]) throw new Error("Missing required fields");
                data.push(req.body[key]);
            }
            this.insert("card", this.#cardKeys, data);
            formApiResponse(res, 200, null, "Card created");
        } catch (err) {
            return formApiResponse(res, 500, null, err);
        }
    }

    /**
     * Handle GET request to get all cards.
     * @param {Object} req - The request object.
     * @param {Object} res - The response object.
     * @returns {null}
     */
    CardGetAll(req, res) {
        const data = [];
        try {
            const rows = this.select("card", ["*"]);
            rows.forEach((row) => data.push(this.#StorageToRespData(row)));
            if (data.length === 0)
                return formApiResponse(res, 404, null, "No cards found");
            formApiResponse(res, 200, data, "Card retrieved");
        } catch (err) {
            formApiResponse(res, 500, null, err);
        }
    }

    /**
     * Handle GET request to get a card by id.
     * @param {Object} req - The request object.
     * @param {Object} req.params - The request parameters.
     * @param {string} req.params.id - The id of the card.
     * @param {Object} res - The response object.
     * @returns {null}
     */
    CardGetById(req, res) {
        const data = [];
        try {
            const rows = this.select("card", ["*"], {
                id: parseInt(req.params.id),
            });
            rows.forEach((storageData) =>
                data.push(this.#StorageToRespData(storageData)),
            );
            if (data.length === 0)
                return formApiResponse(res, 404, null, "No cards found");
            formApiResponse(res, 200, data, "Card retrieved");
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
     * @returns {null}
     */
    CardPatch(req, res) {
        const columns = [];
        const values = [];
        try {
            for (const key of this.#cardKeys)
                if (req.body[key]) {
                    values.push(req.body[key]);
                    columns.push(key);
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
     * @returns {null}
     */
    CardDelete(req, res) {
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
     * @returns {null}
     */
    UserPost(req, res) {
        const data = [];
        try {
            for (const key of this.#userKeys) {
                if (!req.body[key]) throw new Error("Missing required fields");
                data.push(req.body[key]);
            }
            data.push(0);
            this.insert(
                "user",
                this.#userKeys.concat("unknown_card_amount"),
                data,
            );
            formApiResponse(res, 200, null, "User created");
        } catch (err) {
            formApiResponse(res, 500, null, err);
        }
    }

    /**
     * Handle GET request to get all users.
     * @param {Object} req - The request object.
     * @param {Object} res - The response object.
     * @returns {null}
     */
    UserGetAll(req, res) {
        try {
            const rows = this.select("user", ["*"]);
            if (rows.length > 0) {
                for (let i = 0; i < rows.length; i++) {
                    rows[i].cards = this.#UserCardGet(rows[i].id);
                }
                formApiResponse(res, 200, rows, "User retrieved");
            } else formApiResponse(res, 404, null, "No user found");
        } catch (err) {
            formApiResponse(res, 500, null, err);
        }
    }

    /**
     * Handle GET request to get a user by id.
     * @param {Object} req - The request object.
     * @param {Object} req.params - The request parameters.
     * @param {string} req.params.id - The id of the user.
     * @param {Object} res - The response object.
     * @returns {null}
     **/
    UserGetById(req, res) {
        try {
            const rows = this.select("user", ["*"], {
                id: parseInt(req.params.id),
            });
            if (rows.length == 1) {
                rows[0].cards = this.#UserCardGet(parseInt(req.params.id));
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
     * @returns {null}
     */
    UserPatch(req, res) {
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
     * @returns {null}
     */
    UserDelete(req, res) {
        try {
            this.#UserCardGet(req.params.id).forEach((card) =>
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
     * @returns {null}
     */
    UserCardPost(req, res) {
        try {
            const userCards = this.#UserCardGet(
                parseInt(req.params.userId),
                parseInt(req.params.cardId),
            );
            const amount =
                userCards.length > 0 ? userCards[0].own_amount : null;
            if (amount) {
                this.update("user_card", ["own_amount"], [amount + 1], {
                    user_id: parseInt(req.params.userId),
                    card_id: parseInt(req.params.cardId),
                });
                formApiResponse(res, 200, null, "User card updated");
            } else {
                this.insert(
                    "user_card",
                    ["user_id", "card_id", "own_amount"],
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
     * Handle POST request to add a unknown card to a user's collection.
     * @param {Object} req - The request object.
     * @param {Object} req.params - The request parameters.
     * @param {string} req.params.userId - The id of the user.
     * @param {Object} res
     * @returns {null}
     */
    UserCardPostUnkown(req, res) {
        try {
            this.updateQuery(
                "UPDATE user SET unknown_card_amount = unknown_card_amount + 1 WHERE id = ?",
                [parseInt(req.params.userId)],
            );
            formApiResponse(res, 200, null, "Added 1 unknown card");
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
     * @returns {null}
     */
    UserCardDelete(req, res) {
        try {
            const userCards = this.#UserCardGet(
                parseInt(req.params.userId),
                parseInt(req.params.cardId),
            );
            const amount =
                userCards.length > 0 ? userCards[0].own_amount : null;
            if (amount) {
                this.update("user_card", ["own_amount"], [amount - 1], {
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
     * Handle DELETE request to to delete a unknown card from a user.
     * @param {Object} req - The request object.
     * @param {Object} req.params - The request parameters.
     * @param {string} req.params.userId - The id of the user.
     * @param {Object} res
     * @returns {null}
     */
    UserCardDeleteUnkown(req, res) {
        try {
            this.updateQuery(
                "UPDATE user SET unknown_card_amount = unknown_card_amount - 1 WHERE id = ?",
                [parseInt(req.params.userId)],
            );
            formApiResponse(res, 200, null, "Subtracted 1 unknown card");
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
    #UserCardGet = (userId, cardId) => {
        try {
            const select = ["own_amount"];
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
