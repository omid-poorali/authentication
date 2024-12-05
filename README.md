# authentication

Free Open source REST API built with | Nodejs + Express + Mongodb ⚡️ Made with developer experience first Prettier + VSCode setup.

# Table of contents

- [Author](#Author)
- [Technologies](#Technologies)
- [Contributing](#Contributing)
- [Features](#Features)
- [Feedback](#Feedback)
- [Run Locally](#Run_Locally)
- [Environment Variables](#Environment)

# Author

### <a href="https://github.com/omid-poorali">Omid Poorali</a>

# Technologies

- Node.js
- Express
- MongoDB
- JSON Web Token (JWT)
- bcryptjs

# Features

##### (Users)

- Complete user authentication
- Users can sign in
- Users can sign out


# API_Reference


#### User signup

```http
  POST https://localhost:8080/api/v1/auth/signup
```

| Parameter         | Type      | Description   |
| :---------------- | :-------- | :------------ |
| `username`        | `string`  | **Required**. |
| `password`        | `string`  | **Required**. |


#### User Login

```http
  POST https://localhost:8080/api/v1/auth/login
```

| Parameter  | Type     | Description   |
| :--------- | :------- | :------------ |
| `username` | `string` | **Required**. |
| `password` | `string` | **Required**. |


# Environment

- To run this project, you will need to add the following environment variables to your .env file (check environment.config.js file for more examples)

- JWT_SECRET
- MONGO_URL
- REDIS_URL

# Contributing

Contributions are always welcome!

# Feedback

If you have any feedback, please reach out to me at omidpoorali1992@gmail.com

Linkedin.
https://www.linkedin.com/in/omid-poorali

Github
https://github.com/omid-poorali


# Run_Locally

Clone the project

```bash
https://github.com/omid-poorali/authentication.git
```

Go to the project directory

```bash
  cd authentication
```

Install dependencies

```bash
yarn install
# or
npm install
```

Start the server

```bash
  node app.js
  or
  nodemon app.js
```