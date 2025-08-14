# WTWR (What to Wear?): Back End

## Project Description

This back-end project creates a RESTful API server for the WTWR (What to Wear?) application, a service that helps users decide what to wear based on the weather. The server provides endpoints for user management and clothing items, complete with features for creating, reading, updating, and deleting resources. Users can create accounts, add clothing items appropriate for different weather conditions, and like/unlike items added by other users.

## Functionality

- **User Management**:

  - Create new user profiles with name and avatar
  - Retrieve information about specific users or all users
  - Secure user data storage

- **Clothing Item Management**:

  - Add clothing items with name, weather type, and image
  - Browse all available clothing items
  - Update and delete clothing items
  - Filter items by weather type (hot, warm, cold)

- **Social Features**:

  - Like/unlike clothing items
  - Track which users have liked which items

- **Error Handling**:
  - Comprehensive error messages
  - Proper HTTP status codes
  - Validation for data integrity

## Technologies and Techniques Used

### Backend Stack

- **Node.js**: JavaScript runtime environment
- **Express.js**: Web server framework
- **MongoDB**: NoSQL database for storing user and item data
- **Mongoose**: Object data modeling library for MongoDB

### Development Tools

- **ESLint**: Code quality and style checking (Airbnb configuration)
- **Prettier**: Code formatting
- **Nodemon**: Development server with auto-reload capability

### API Design

- **RESTful Architecture**: Standard HTTP methods (GET, POST, PUT, DELETE)
- **JSON**: Data format for request/response communication
- **Middleware Pattern**: For request processing and authentication simulation

### Data Validation

- **Validator.js**: URL validation for avatar and image URLs
- **Mongoose Schemas**: Data structure enforcement with built-in validators

## API Endpoints

### Users

- `GET /users` - Returns all users
- `GET /users/:userId` - Returns a specific user by ID
- `POST /users` - Creates a new user

### Clothing Items

- `GET /items` - Returns all clothing items
- `POST /items` - Creates a new clothing item
- `DELETE /items/:itemId` - Deletes a specific item
- `PUT /items/:itemId/likes` - Adds the current user to the item's likes
- `DELETE /items/:itemId/likes` - Removes the current user from the item's likes

## Screenshots

[Add screenshots of your API responses, perhaps from Postman tests]

## Demo Video

[Add a link to a video demonstration of your API in action]

## Running the Project

```bash
# Install dependencies
npm install

# Start the server
npm run start

# Start with hot-reload for development
npm run dev

# Run linting
npm run lint
```
