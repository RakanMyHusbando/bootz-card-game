create table if not exists user (
    id integer primary key autoincrement,
    discord_id text not null
);
create table if not exists card (
    id integer primary key autoincrement,
    title text unique not null,
    description text not null,
    type text not null,
    max_amount integer not null,
    remaining_amount integer not null,
    attack integer not null,
    defense integer not null,
    health integer not null
);
create table if not exists user_card (
    user_id integer not null,
    card_id integer not null,
    own_amount integer not null,
    foreign key(user_id) references user(id),
    foreign key(card_id) references card(id)
);