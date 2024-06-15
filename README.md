# Easy Bazaar Server

This repository contains the server code for the Easy Bazaar web application, an online marketplace where users can browse and manage products and categories. The server is built using Node.js, Express.js, and MongoDB. Authentication is handled using JWT (JSON Web Tokens).

## Table of Contents

- [Easy Bazaar Server](#easy-bazaar-server)
  - [Table of Contents](#table-of-contents)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
  - [Usage](#usage)
  - [API Endpoints](#api-endpoints)
    - [Categories](#categories)
    - [Products](#products)
    - [Users](#users)
  - [License](#license)

## Installation

1. Clone the repository:
    ```sh
    git clone https://github.com/your-username/easy-bazar-server.git
    cd easy-bazar-server
    ```

2. Install the dependencies:
    ```sh
    npm install
    ```

3. Set up the environment variables as described in the [Environment Variables](#environment-variables) section.

4. Start the server:
    ```sh
    npm start
    ```

## Environment Variables

Create a `.env` file in the root directory of your project and add the following environment variables:

```env
PORT=your_port_number
DB_URI=your_mongodb_uri
```

## Usage

To start the server, run:

```sh
npm start
```

The server will be running on the port specified in the `.env` file.

## API Endpoints

### Categories

- **Create Category**
  - `POST /categories`
  - Request Body: `{ "name": "Category Name" }`
  - Response: JSON object of the created category

- **Get All Categories**
  - `GET /categories`
  - Response: Array of categories

### Products

- **Create Product**
  - `POST /products`
  - Headers: `{ "Authorization": "Bearer <token>" }`
  - Request Body: `{ "name": "Product Name", "price": 100, "categoryId": "categoryId" }`
  - Response: JSON object of the created product

- **Update Product**
  - `PATCH /products/:id`
  - Headers: `{ "Authorization": "Bearer <token>" }`
  - Request Body: `{ "name": "Updated Product Name", "price": 150 }`
  - Response: JSON object of the updated product

- **Delete Product**
  - `DELETE /products/:id`
  - Headers: `{ "Authorization": "Bearer <token>" }`
  - Response: JSON object with deletion status

- **Get All Products**
  - `GET /products`
  - Response: Array of products

- **Get Product by ID**
  - `GET /products/:id`
  - Response: JSON object of the product

### Users

- **Create User**
  - `POST /users`
  - Request Body: `{ "email": "user@example.com", "password": "password" }`
  - Response: JSON object with creation status and token

- **Get All Users**
  - `GET /users`
  - Response: Array of users

- **Get User by Email**
  - `GET /users/:email`
  - Response: JSON object of the user

- **Update User**
  - `PATCH /users/:email`
  - Headers: `{ "Authorization": "Bearer <token>" }`
  - Request Body: `{ "name": "Updated User Name" }`
  - Response: JSON object of the updated user

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

Feel free to contribute to this project by submitting issues or pull requests. If you have any questions, please contact the repository owner.