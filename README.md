# WTWR (What to Wear?): Back End API

## Links

- **Backend API:** https://api.whattowearproject.jumpingcrab.com
- **Frontend Repository:** https://github.com/huntermelrose831/se_project_react
- **Project Pitch Video:** [(https://www.loom.com/share/86b20e79ec654d10ab7f8646fc1dcc98)]

## Project Description

This back-end project provides a secure RESTful API for the WTWR (What to Wear?) application. The server handles user authentication, profile management, and the creation and management of clothing items. It is built with Node.js, Express, and MongoDB, and features a full suite of automated tests that run on every code change via GitHub Actions.

## Core Functionality

- **Secure User Management**:
  - User registration (`/signup`) and login (`/signin`) using JWT for authentication.
  - Secure password storage using `bcrypt` hashing.
  - Users can retrieve and update their own profile information (`/users/me`).
- **Clothing Item Management**:
  - Authenticated users can add, and delete their own clothing items.
  - All users (even unauthenticated) can browse the full list of clothing items.
  - Ownership is enforced; users can only delete items they have created.
- **Social Features**:
  - Authenticated users can "like" and "unlike" clothing items.
- **Automated Testing**:
  - A Continuous Integration (CI) pipeline using GitHub Actions automatically runs a full suite of Postman/Newman tests on every push to the `main` branch.

## Technologies and Techniques Used

- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose for data modeling and validation.
- **Authentication**: JSON Web Tokens (JWT) for securing endpoints.
- **Security**: `bcryptjs` for password hashing, middleware for authorization.
- **Development Tools**: ESLint (Airbnb config), Prettier, Nodemon for hot-reloading.
- **CI/CD**: GitHub Actions and Newman for automated API testing.

## API Endpoints

### Authentication

- `POST /signup` - Creates a new user.
- `POST /signin` - Logs in a user and returns a JWT.

### Users (Requires Authentication)

- `GET /users/me` - Returns the logged-in user's profile information.
- `PATCH /users/me` - Updates the logged-in user's name and avatar.

### Clothing Items

- `GET /items` - Returns all clothing items. (Publicly accessible)
- `POST /items` - Creates a new clothing item. (Requires Authentication)
- `DELETE /items/:itemId` - Deletes an item by its ID. (Requires Authentication & Ownership)
- `PUT /items/:itemId/likes` - Adds a "like" to an item. (Requires Authentication)
- `DELETE /items/:itemId/likes` - Removes a "like" from an item. (Requires Authentication)

## Project Setup and Usage

```bash
# 1. Clone the repository
git clone https://github.com/huntermelrose831/se_project_express.git

# 2. Navigate to the project directory
cd se_project_express

# 3. Install dependencies
npm install

# 4. Start the server for production
npm run start

# 5. Start the server with hot-reload for development
npm run dev
```

The server will be running on `http://localhost:3001`.
