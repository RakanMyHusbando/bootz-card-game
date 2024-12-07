import random from "./random.json";

interface User {
    id: number | null;
    name: string;
    discord_id: string;
    user_cards: number[] | null;
}

interface Card {
    id: number | null;
    title: string;
    description: string;
    type: string;
    rarity: number;
    cost: number;
    attack: number;
    defense: number;
    health: number;
}

function ranInt(min: number, max: number): number {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

const addContent = async (): Promise<void> => {
    // post 100 cards
    let j = 0;
    for (let i = 0; i < random.names.length; i++) {
        const card: Card = {
            id: null,
            title: random.names[i],
            description: random.descriptions[i],
            type: random.types[j],
            rarity: ranInt(1, 10),
            cost: ranInt(1, 100),
            attack: ranInt(1, 100),
            defense: ranInt(1, 100),
            health: ranInt(1, 1000),
        };
        await fetch("http://localhost:5000/card", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(card),
        });
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
        });
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
    for (let i = 0; i < 100; i++) {
        const ranUserId = await users[ranInt(0, (await users.length) - 1)].id;
        const ranCardId = await cards[ranInt(0, (await cards.length) - 1)].id;
        await fetch(
            `http://localhost:5000/user/${ranUserId}/card/${ranCardId}`,
            { method: "POST" },
        );
    }
};

addContent().then(() => addUserCard());
