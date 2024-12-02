create table if not exists User (
    id integer primary key autoincrement,
    discord_id text not null
);
create table if not exists Card (
    id integer primary key autoincrement,
    title text not null,
    description text not null,
    type text not null,
    rarity integer not null,
    attack integer not null,
    defense integer not null,
    health integer not null,
    foreign key(card_type) references CardType(id)
);
create table if not exists UserCard (
    user_id integer not null,
    card_id integer not null,
    amount integer not null,
    foreign key(user_id) references User(id),
    foreign key(card_id) references Card(id)
);