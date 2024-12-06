"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function ranInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
// post 100 test cards
/*let j = 0
for(let i = 0; i < random.names.length; i++){
    const card: Card = {
        id: null,
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
    const user: User = {
        id: null,
        name: "name"+i,
        discord_id: "dc"+i,
        user_cards: null
    }
    fetch("http://localhost:5000/user", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(user)
    })
}*/
// post 100 cards to random users
for (var i = 0; i < 100; i++) {
    var user_id = ranInt(1, 100);
    var card_id = ranInt(1, 100);
    fetch("http://localhost:5000/user/".concat(user_id, "/card/").concat(card_id), {
        method: "POST"
    })
        .then(function (res) { return res.json(); })
        .then(function (data) { return console.log(data); });
}
var user = [];
var card = [];
// get all cards
fetch("http://localhost:5000/card")
    .then(function (res) { return res.json(); })
    .then(function (data) {
    card.push.apply(card, data);
});
// get all users
fetch("http://localhost:5000/user")
    .then(function (res) { return res.json(); })
    .then(function (data) {
    user.push.apply(user, data);
});
