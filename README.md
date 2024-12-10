# Bootz card game
## Description

Bootz card game is a web application that allows users to manage and play with collectible cards. Users can create, update, delete, and view cards, as well as manage their own collections of cards.

## Setup

1. Install Node.js from the [official website](https://nodejs.org/) or using a version manager like [nvm](https://github.com/nvm-sh/nvm).

2. Clone the repository:
    ```sh
    git clone https://github.com/yourusername/bootz-card-game.git
    cd bootz-card-game
    ```

3. Install dependencies:
    ```sh
    npm install
    ```

4. Create a `.env` file based on the `.env.example`:
    ```sh
    cp .env.example .env
    ```

5. Update the `.env` file with your configuration


6. Run the application:
    ```sh
    npm run start
    npm run dev # developer mode
    ```

## API Endpoints

### Card Endpoints

- **Create a new card**
    ```http
    POST /card
    ```
    **Request Body:**
    ```json
    {
        "title": "Card Title",
        "description": "Card Description",
        "type": "Card Type",
        "rarity": 1,
        "attack": 10,
        "defense": 5,
        "health": 20
    }
    ```

- **Get all cards**
    ```http
    GET /card
    ```

- **Get a card by ID**
    ```http
    GET /card/:id
    ```

- **Update a card by ID**
    ```http
    PATCH /card/:id
    ```
    **Request Body:**
    ```json
    {
        "title": "Updated Title",
        "description": "Updated Description",
        "type": "Updated Type",
        "rarity": 2,
        "attack": 15,
        "defense": 10,
        "health": 25
    }
    ```

- **Delete a card by ID**
    ```http
    DELETE /card/:id
    ```

### User Endpoints

- **Create a new user**
    ```http
    POST /user
    ```
    **Request Body:**
    ```json
    {
        "name": "User Name",
        "discord_id": "Discord ID"
    }
    ```

- **Get all users**
    ```http
    GET /user
    ```

- **Get a user by ID**
    ```http
    GET /user/:id
    ```

- **Update a user by ID**
    ```http
    PATCH /user/:id
    ```
    **Request Body:**
    ```json
    {
        "name": "Updated Name",
        "discord_id": "Updated Discord ID"
    }
    ```

- **Delete a user by ID**
    ```http
    DELETE /user/:id
    ```

### User-Card Endpoints

- **Add a unknown card to a user's collection**
    ```http
    POST /user/:userId/card
    ```

- **Remove a unknown card from a user's collection**
    ```http
    DELETE /user/:userId/card
    ```

- **Add a card to a user's collection**
    ```http
    POST /user/:userId/card/:cardId
    ```

- **Remove a card from a user's collection**
    ```http
    DELETE /user/:userId/card/:cardId
    ```
