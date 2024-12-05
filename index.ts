import random from "./random.json"

interface PostUser {
    name: string;
    discord_id: string;
}

interface PostCard {
    title: string;
    description: string;
    type: string;
    rarity: number;
    cost: number;
    attack: number;
    defense: number;
    health: number;
}

function ranInt(min: number, max: number):number {
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min + 1)) + min
}


// post 100 test cards
let j = 0
for(let i = 0; i < random.names.length; i++){
    const card: PostCard = {
        title: random.names[i],
        description: random.descriptions[i],
        type: random.types[j],
        rarity: ranInt(1, 10),
        cost: ranInt(1, 100),
        attack: ranInt(1, 100),
        defense: ranInt(1, 100),
        health: ranInt(1, 1000)
    }

    fetch("http://localhost:5000/card", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(card)
    })

    j === 9 ? j = 0 : j++
}

// post 100 test users
for(let i = 0; i < 100; i++){
    const user: PostUser = {
        name: "name"+i,
        discord_id: "dc"+i
    }
    fetch("http://localhost:5000/user", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(user)
    })
}
