"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const random_card_json_1 = __importDefault(require("./random-card.json"));
function ranInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
const addContent = () => __awaiter(void 0, void 0, void 0, function* () {
    // post 100 cards
    let j = 0;
    for (let i = 0; i < random_card_json_1.default.length; i++) {
        const card = {
            id: null,
            name: random_card_json_1.default[i].name,
            type: random_card_json_1.default[i].type,
            rarity: random_card_json_1.default[i].rarity,
        };
        yield fetch("http://localhost:5000/card", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(card),
        })
            .then((res) => res.json())
            .then((res) => console.log(res))
            .catch((err) => console.log(err));
        j === 9 ? (j = 0) : j++;
    }
    // post 100 users
    for (let i = 0; i < 100; i++) {
        const user = {
            id: null,
            name: "name" + i,
            discord_id: "dc" + i,
            user_cards: null,
        };
        yield fetch("http://localhost:5000/user", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(user),
        })
            .then((res) => res.json())
            .then((res) => console.log(res))
            .catch((err) => console.log(err));
    }
});
const addUserCard = () => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield fetch("http://localhost:5000/user")
        .then((res) => res.json())
        .then((res) => res.data);
    const cards = yield fetch("http://localhost:5000/card")
        .then((res) => res.json())
        .then((res) => res.data);
    // post 100 user cards
    for (let i = 0; i < 1000; i++) {
        const ranUserId = yield users[ranInt(0, (yield users.length) - 1)].id;
        const ranCardId = yield cards[ranInt(0, (yield cards.length) - 1)].id;
        console.log(`http://localhost:5000/user/${ranUserId}/card/${ranCardId}`);
        yield fetch(`http://localhost:5000/user/${ranUserId}/card/${ranCardId}`, { method: "POST" });
    }
});
addContent()
    // .then(() => addUserCard())
    .catch((err) => console.log(err));
