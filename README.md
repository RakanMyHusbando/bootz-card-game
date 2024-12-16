# Bootz card game
## Description

Bootz card game is a web application that allows users to manage and play with collectible cards. Users can create, update, delete, and view cards, as well as manage their own collections of cards.

## Setup

1. Install Node.js from the [official website](https://nodejs.org/) or using a version manager like [nvm](https://github.com/nvm-sh/nvm).

2. Clone the repository:
    ```sh
    git clone https://github.com/yourusername/bootz-card-game.git  backend
    ```
3. Navigate to the project directory:
   ```sh
   cd backend
   ```
4. Install dependencies:
    ```sh
    npm install
    ```
5. Create a `.env` file based on the `.env.example`:
    ```sh
    cp .env.example .env
    ```
6. Update the `.env` file with your configuration
7. Run the application:
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
    }
    ```

- **Get all cards**
    ```http
    GET /card
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

- **Add a card to a user's collection**
    ```http
    POST /user/:userId/card/:cardId
    ```

- **Remove a card from a user's collection**
    ```http
    DELETE /user/:userId/card/:cardId
    ```

- **Add unknown card to user**
    ```http
    POST /user/:userId/card/random
    ```

### User-Packs Endpoints

- **Add a pack to user**
    ```http
    PATCH /user/:userId/pack/add
    ```

- **Open a pack**
    ```http
    PATCH /user/:userId/pack/open
    ```
