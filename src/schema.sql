create table if not exists user (
    id integer primary key autoincrement,
    name text not null unique,
    packs integer not null,
    discord_id text not null unique
);

create table if not exists type (
    id integer primary key autoincrement,
    name text not null unique
);

create table if not exists rarity (
    id integer primary key autoincrement,
    name text not null unique,
    chance integer not null
);

create table if not exists card (
    id integer primary key autoincrement,
    name text unique not null,
    type_id integer not null,
    rarity_id integer not null,
    foreign key (type_id) references type (id),
    foreign key (rarity_id) references rarity (id)
);

create table if not exists user_card (
    user_id integer not null,
    card_id integer not null,
    owned integer not null,
    foreign key (user_id) references user (id),
    foreign key (card_id) references card (id)
);
