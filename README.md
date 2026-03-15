# Blog List Application

Fullstack web application for creating, viewing and managing blog posts.
The application allows users to register, log in, create blogs, like posts and delete blogs they have created.

This project was developed as part of the Full Stack Open course and demonstrates a complete fullstack architecture with a React frontend and a Node.js backend.

---

# Live Features

Users can:

- register and log in
- create new blog posts
- view a list of blogs
- like blogs
- delete blogs they created
- remain logged in after refreshing the page

The application uses token-based authentication and persistent login via localStorage.

---

# Tech Stack

## Frontend

- React
- JavaScript (ES6+)
- Axios
- CSS
- LocalStorage (for session persistence)

Key concepts used:

- React hooks (useState, useEffect)
- component-based architecture
- controlled forms
- conditional rendering
- API communication
- client-side state management

---

## Backend

- Node.js
- Express.js
- MongoDB
- Mongoose

Backend functionality includes:

- REST API
- CRUD operations for blogs
- user authentication
- password hashing
- protected API endpoints
- middleware architecture

---

## Authentication & Security

Authentication is implemented using:

- JSON Web Tokens (JWT)
- bcrypt password hashing

Features:

- secure password storage
- token-based authentication
- protected routes for creating and deleting blogs
- user-specific blog ownership

---

## Testing

Backend API endpoints are tested using:

- Node.js built-in test runner (`node:test`)
- Supertest for HTTP endpoint testing
- Node assert module
- Playwrite e2e tesing

Tests include:

- blog retrieval
- blog creation
- blog deletion
- validation logic

---

# Project Structure

backend

controllers
models
utils
middleware
tests

frontend

components
services
App.js

---

# REST API Endpoints

## Blogs

GET /api/blogs
Returns all blogs

POST /api/blogs
Creates a new blog (requires authentication)

DELETE /api/blogs/:id
Deletes a blog created by the authenticated user

PUT /api/blogs/:id
Updates blog likes

---

## Users

POST /api/users
Creates a new user

GET /api/users
Returns all users

---

## Login

POST /api/login
Authenticates user and returns JWT token

---

# Learning Outcomes

Through this project I practiced:

- building a fullstack application
- designing REST APIs
- implementing authentication
- structuring a backend application
- connecting React frontend with backend APIs
- testing backend endpoints
- managing application state

---

# Author

Developed by Aleksandr Romanov while studying fullstack development.
