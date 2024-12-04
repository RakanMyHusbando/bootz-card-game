import { Storage } from "./storage.js"

const formApiResponse = (res, status, data, message) => {
    console.log(message)
    const body = {
        status: status,
        data: data,
        message: message.toString()
    }
    res.status(status)
    res.json(body)
}

export class CardHandler extends Storage {
    /**
     * Create a CardHandler instance.
     * @param {string} dbFile - The database file path.
     */
    constructor(dbFile) {
        super(dbFile)
    }

    #keys = ["title","description","type","rarity","attack","defense","health"]

    #storageToRespData = (storageData) => {
        return {
            id: storageData.id,
            title: storageData.title,
            description: storageData.description,
            type: storageData.type,
            rarity: storageData.rarity,
            attack: storageData.attack,
            defense: storageData.defense,
            health: storageData.health
        }
    }

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
     * @returns {Promise<void>}
     */
    handlePost = async (req, res) => {
        const values = []
        for (const key of this.#keys) {
            if (req.body[key]) 
                values.push(req.body[key])
            else 
                return formApiResponse(res, 500, null, "Missing required fields")
        }
        await this.insert("card", this.#keys, values)
            .then(data => formApiResponse(res, 200, data, "Card created"))
            .catch(err => formApiResponse(res, 500, null, err))
    }

    /**
     * Handle GET request to get all cards.
     * @param {Object} req - The request object.
     * @param {Object} res - The response object.
     * @returns {Promise<void>}
     */
    handleGetAll = async (req,res) => {
        await this.select("card",["*"])
            .then(storageDataLst => {
                const data = []
                storageDataLst.forEach(storageData => {
                    data.push(this.#storageToRespData(storageData))
                })
                if (data.length === 0) 
                    return formApiResponse(res, 404, null, "No cards found")
                formApiResponse(res, 200, data, "Card retrieved")
            })
            .catch(err => formApiResponse(res, 500, null, err))
    }

    /**
     * Handle GET request to get a card by id.
     * @param {Object} req - The request object.
     * @param {Object} req.params - The request parameters.
     * @param {string} req.params.id - The id of the card.
     * @param {Object} res - The response object.
     * @returns {Promise<void>}
     */
    handleGetById = async (req, res) => {
        await this.select("card",["*"],{id:parseInt(req.params.id)})
            .then(storageDataLst => {
                const data = []
                storageDataLst.forEach(storageData => {
                    data.push(this.#storageToRespData(storageData))
                })
                if(data.length === 0)
                    return formApiResponse(res, 404, null, "Card not found")
                formApiResponse(res, 200, data, "Card retrieved")
            })
            .catch(err => formApiResponse(res, 500, null, err))
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
     * @returns {Promise<void>}
     */
    handlePatch = async (req, res) => {
        const keys = ["title","description","type","max_amount","remaining_amount","attack","defense","health"]
        const columns = []
        const values = []
        for (const key of keys) 
            if (req.body[key]) {
                values.push(req.body[key])
                columns.push(key)
            }
        await this.update("card", columns, values, {id:parseInt(req.params.id)})
            .then(data => formApiResponse(res, 200, null, "Card updated"))
            .catch(err => formApiResponse(res, 500, null, err))
    }

    /**
     * Handle DELETE request to delete a card by id.
     * @param {Object} req - The request object.
     * @param {Object} req.params - The request parameters.
     * @param {string} req.params.id - The id of the card.
     * @param {Object} res - The response object.
     * @returns {Promise<void>}
     */
    handleDelete = async (req, res) => await this.delete("card", {id:parseInt(req.params.id)})
        .then(data => formApiResponse(res, 200, data, "Card deleted"))
        .catch(err => formApiResponse(res, 500, null, err))
}


export class UserHandler extends Storage {
    /**
     * Create a UserHandler instance.
     * @param {string} dbFile - The database file path.
     */
    constructor(dbFile) {
        super(dbFile)
    }

    /**
     * Handle POST request to create a new user.
     * @param {Object} req - The request object.
     * @param {Object} req.body - The body of the request.
     * @param {string} req.body.name - The name of the user.
     * @param {string} req.body.discord_id - The discord id of the user.
     * @param {Object} res - The response object.
     * @returns {Promise<void>}
     */
    handlePost = async (req, res) => {
        const keys = ["name","discord_id"]
        const values = []
        for (const key of keys) {
            if (req.body[key]) 
                values.push(req.body[key])
            else 
                return formApiResponse(res, 500, null, "Missing required fields")
        }
        await this.insert("user", keys, values)
            .then(data => formApiResponse(res, 200, null, "User created"))
            .catch(err => formApiResponse(res, 500, null, err))
    }

    /**
     * Handle GET request to get all users.
     * @param {Object} req - The request object.
     * @param {Object} res - The response object.
     * @returns {Promise<void>}
     */
    handleGetAll = async (req,res) => await this.select("user",["*"])
        .then(async data => {
            if(data.length > 0){
                for (const user of data) 
                    user.cards = await this.#getCards(user.id).catch(()=>[])
                formApiResponse(res, 200, data, "User retrieved")
            } else
                formApiResponse(res, 404, null, "No user found")
        })
        .catch(err => formApiResponse(res, 500, null, err))

    /**
     * Handle GET request to get a user by id.
     * @param {Object} req - The request object.
     * @param {Object} req.params - The request parameters.
     * @param {string} req.params.id - The id of the user.
     * @param {Object} res - The response object.
     * @returns {Promise<void>}
     **/
    handleGetById = async (req,res) => await this.select("user",["*"],{id:parseInt(req.params.id)})
        .then(async data => {
            if(data.length > 0){
                for (const user of data) 
                    user.cards = await this.#getCards(user.id).catch(()=>[])
                formApiResponse(res, 200, data, "User retrieved")
            } else
                formApiResponse(res, 404, null, "No user found")
        })
        .catch(err => formApiResponse(res, 500, null, err))

    /**
     * Handle PATCH request to update a user by id.
     * @param {Object} req - The request object.
     * @param {Object} req.params - The request parameters.
     * @param {string} req.params.id - The id of the user.
     * @param {Object} req.body - The body of the request.
     * @param {string} [req.body.name] - The name of the user.
     * @param {string} [req.body.discord_id] - The discord id of the user.
     * @param {Object} res - The response object.
     * @returns {Promise<void>}
     */
    handlePatch = async (req,res) => {
        const keys = ["name","discord_id"]
        const columns = []
        const values = []
        for (const key of keys) {
            if (req.body[key]) {
                values.push(req.body[key])
                columns.push(key)
            }
        }
        await this.update("user", columns, values, {id:parseInt(req.params.id)})
            .then(data => formApiResponse(res, 200, null, "User updated"))
            .catch(err => formApiResponse(res, 500, null, err))
    }

    /**
     * Handle DELETE request to delete a user by id.
     * @param {Object} req - The request object.
     * @param {Object} req.params - The request parameters.
     * @param {string} req.params.id - The id of the user.
     * @param {Object} res - The response object.
     * @returns {Promise<void>}
     */
    handleDelete = async (req,res) => await this.delete("user_card",{user_id:parseInt(req.params.id)})
        .then(async ()=> await this.delete("user", {id:parseInt(req.params.id)}))
        .then(data => formApiResponse(res, 200, null, "User and user_card deleted"))
        .catch(err => formApiResponse(res, 500, null, err))

    /**
     * Handle POST request to add a card to a user's collection.
     * @param {Object} req - The request object.
     * @param {Object} req.params - The request parameters.
     * @param {string} req.params.userId - The id of the user.
     * @param {string} req.params.cardId - The id of the card.
     * @param {Object} res
     * @returns {Promise<void>} 
     */
    handlePostCard = async (req, res) => {
        const userCardOwnAmount = await this.#getCard(parseInt(req.params.userId),parseInt(req.params.cardId))
            .then(data=>data.length > 0 ? data[0].own_amount : null)
            .catch(err=>{
                console.error(err)
                return null
            })
        if(userCard)
            await this.#updateCards(parseInt(req.params.userId),parseInt(req.params.cardId),userCardOwnAmount+1)
                .then(() => formApiResponse(res, 200, null, "User card updated"))
                .catch(err => formApiResponse(res, 500, null, err))
        else 
            await this.insert("user_card",["user_id","card_id","own_amount"],[parseInt(req.params.userId),parseInt(req.params.cardId),1])
                .then(() => formApiResponse(res, 200, null, "User card created"))
                .catch(err => formApiResponse(res, 500, null, err))
    }
    /**
     * Handle DELETE request to get all cards for a user.
     * @param {Object} req - The request object.
     * @param {Object} req.params - The request parameters.
     * @param {string} req.params.userId - The id of the user.
     * @param {Object} req.params.cardId - The id of the card.
     * @param {Object} res - The response object.
     * @returns {Promise<void>} 
     */
    handleDeleteCard = async (req,res) => { 
        const userCardOwnAmount = await this.#getCard(parseInt(req.params.userId),parseInt(req.params.cardId))
            .then(data=>data.length > 0 ? data[0].own_amount : null)
            .catch(err=>{
                console.error(err)
                return null
            })
        if(userCard)
            await this.#updateCards(parseInt(req.params.userId),parseInt(req.params.cardId),userCardOwnAmount-1)
                .then(() => formApiResponse(res, 200, null, "User card updated"))
                .catch(err => formApiResponse(res, 500, null, err))
        else 
            await this.delete("user_card",{user_id:parseInt(req.params.userId),card_id:parseInt(req.params.cardId)})
                .then(() => formApiResponse(res, 200, null, "User card deleted"))
                .catch(err => formApiResponse(res, 500, null, err))
    }
    /**
     * Get all cards for a user.
     * @param {number} userId - The id of the user.
     * @returns {Promise<any[]|Error>} - Returns a promise that resolves to an array of rows returned by the query, or an error object if the query fails.
     * @private
     **/
    #getCards = async (userId) => await this.select("user_card",["*"],{user_id:userId})

    /**
     * Get a card for a user by card id.
     * @param {number} userId 
     * @param {number} cardId 
     * @returns {Promise<any[]|Error>} - Returns a promise that resolves to an array of rows returned by the query, or an error object if the query fails.
     * @private
     */
    #getCard = async (userId, cardId) => await this.select("user_card",["*"],{user_id:userId, card_id:cardId})

    /**
     * Update the amount of a card owned by a user.
     * @param {number} userId - The id of the user.
     * @param {number} cardId - The id of the card.
     * @param {number} ownAmount - The amount of the card owned by the user.
     * @returns {Promise<any[]|Error>} - Returns a promise that resolves to an array of rows returned by the query, or an error object if the query fails.
     * @private
     * */
    #updateCards = async (userId, cardId, ownAmount) => await this.update(
        "user_card", 
        ["own_amount"], 
        [ownAmount], 
        {user_id:userId, card_id:cardId}
    )
}