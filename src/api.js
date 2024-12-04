import e from "express"
import { Storage } from "./storage.js"

export const formApiResponse = (res, status, data, message) => {
    console.log(message)
    const body = {
        status: data,
        data: data,
        message: message.toString()
    }
    res.status(status)
    res.json(body)
}

/**
 * Class representing the Card API.
 * @extends Storage
 */
export class CardHandler extends Storage {
    /**
     * Create a CardHandler instance.
     * @param {string} dbFile - The database file path.
     */
    constructor(dbFile) {
        super(dbFile)
    }

    #storageToRespData = (storageData) => {
        console.log(storageData)
        return {
            id: storageData.id,
            title: storageData.title,
            description: storageData.description,
            type: storageData.type,
            amount: {
                max: storageData.max_amount,
                remaining: storageData.remaining_amount
            },
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
     * @param {Object} req.body.amount - The amount of the card.
     * @param {number} req.body.amount.max - The max amount of the card.
     * @param {number} req.body.amount.remaining - The remaining amount of the card.
     * @param {number} req.body.attack - The attack value of the card.
     * @param {number} req.body.defense - The defense value of the card.
     * @param {number} req.body.health - The health value of the card.
     * @param {Object} res - The response object.
     * @returns {Promise<void>}
     */
    handlePost = async (req, res) => {
        const keys = ["title","description","type","max_amount","remaining_amount","attack","defense","health"]
        const values = []
        for (const key of keys) {
            if (key.includes("amount") && req.body["amount"][key.split("_")[0]]) 
                values.push(req.body["amount"][key.split("_")[0]])
            else if (req.body[key]) 
                values.push(req.body[key])
            else 
                return formApiResponse(res, 500, null, "Missing required fields")
        }
        await this.insert("card", keys, values)
            .then(data =>{ 
                if (data.errno) 
                    throw new Error(data.message)
                else 
                    formApiResponse(res, 200, data, "Card created")
            })
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
        await this.select("card",["*"],{id:req.params.id})
            .then(storageDataLst => {
                const data = []
                storageDataLst.forEach(storageData => {
                    data.push(this.#storageToRespData(storageData))
                })
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
     * @param {string} req.body.title - The title of the card.
     * @param {string} req.body.description - The description of the card.
     * @param {string} req.body.type - The type of the card.
     * @param {Object} req.body.amount - The amount of the card.
     * @param {number} req.body.amount.max - The max amount of the card.
     * @param {number} req.body.amount.remaining - The remaining amount of the card.
     * @param {number} req.body.attack - The attack value of the card.
     * @param {number} req.body.defense - The defense value of the card.
     * @param {number} req.body.health - The health value of the card.
     * @param {Object} res - The response object.
     * @returns {Promise<void>}
     */
    handlePatch = async (req, res) => {
        const keys = ["title","description","type","max_amount","remaining_amount","attack","defense","health"]
        const values = []
        for (const key of keys) {
            if (req.body[key]) {
                if (key == "amount" && req.body.amount.max && req.body.amount.remaining) {
                    values.push(req.body.amount.max)
                    values.push(req.body.amount.remaining)
                } else {
                    values.push(req.body[key])
                }
            } else {
                return formApiResponse(res, 500, null, err)
            }
        }
        await this.update("card", keys, values)
            .then(data => formApiResponse(res, 200, data, "Card updated"))
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
    handleDelete = async (req, res) => {
        const { id } = req.params
        await this.delete("card", id)
            .then(data => formApiResponse(res, 200, data, "Card deleted"))
            .catch(err => formApiResponse(res, 500, null, err))
    }
}

export class UserHandler extends Storage {
    
}