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
const random_json_1 = __importDefault(require("./random.json"));
function ranInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
// post 100 test cards and 100 test users
const addContent = () => __awaiter(void 0, void 0, void 0, function* () {
    let j = 0;
    for (let i = 0; i < random_json_1.default.names.length; i++) {
        const card = {
            id: null,
            title: random_json_1.default.names[i],
            description: random_json_1.default.descriptions[i],
            type: random_json_1.default.types[j],
            rarity: ranInt(1, 10),
            cost: ranInt(1, 100),
            attack: ranInt(1, 100),
            defense: ranInt(1, 100),
            health: ranInt(1, 1000),
        };
        yield fetch("http://localhost:5000/card", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(card),
        });
        j === 9 ? (j = 0) : j++;
    }
    // post 100 test users
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
        });
    }
});
const addUserCard = () => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield fetch("http://localhost:5000/user")
        .then((res) => res.json())
        .then((res) => res.data);
    const cards = yield fetch("http://localhost:5000/card")
        .then((res) => res.json())
        .then((res) => res.data);
    for (let i = 0; i < 100; i++) {
        const ranUserId = yield users[ranInt(0, (yield users.length) - 1)].id;
        const ranCardId = yield cards[ranInt(0, (yield cards.length) - 1)].id;
        yield fetch(`http://localhost:5000/user/${ranUserId}/card/${ranCardId}`, { method: "POST" });
    }
});
addContent().then(() => addUserCard());