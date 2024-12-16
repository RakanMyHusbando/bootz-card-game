import random from "./random-card.json";

interface User {
    id: number | null;
    name: string;
    discord_id: string;
    user_cards: number[] | null;
}

interface Card {
    id: number | null;
    name: string;
    type: string;
    rarity: string;
}

function ranInt(min: number, max: number): number {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

const addContent = async (): Promise<void> => {
    // post 100 cards
    let j = 0;
    for (let i = 0; i < random.length; i++) {
        const card: Card = {
            id: null,
            name: random[i].name,
            type: random[i].type,
            rarity: random[i].rarity,
        };
        await fetch("http://localhost:5000/card", {
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
        const user: User = {
            id: null,
            name: "name" + i,
            discord_id: "dc" + i,
            user_cards: null,
        };
        await fetch("http://localhost:5000/user", {
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
};

const addUserCard = async (): Promise<void> => {
    const users = await fetch("http://localhost:5000/user")
        .then((res) => res.json())
        .then((res) => res.data);
    const cards = await fetch("http://localhost:5000/card")
        .then((res) => res.json())
        .then((res) => res.data);

    // post 100 user cards
    for (let i = 0; i < 1000; i++) {
        const ranUserId = await users[ranInt(0, (await users.length) - 1)].id;
        const ranCardId = await cards[ranInt(0, (await cards.length) - 1)].id;
        console.log(
            `http://localhost:5000/user/${ranUserId}/card/${ranCardId}`,
        );
        await fetch(
            `http://localhost:5000/user/${ranUserId}/card/${ranCardId}`,
            { method: "POST" },
        );
    }
};

addContent()
    .then(() => addUserCard())
    .catch((err) => console.log(err));
