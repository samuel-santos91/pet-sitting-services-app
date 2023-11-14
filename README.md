# pet-sitting-services-app
## Description
This application mocks an pet sitting service exchange
### Purpose
* The purpose of this project was to practice building a full stack application
### Tech Stack
#### FRONTEND
* React.js
* TypeScript
* Tailwind CSS
#### BACKEND
* Express.js
#### DATABASE
* MySQL

## Preview
### Log into your account or sign in if you don't have one <br>
<img width="500" alt="Screenshot 2023-08-03 at 20 47 04" src="https://github.com/samuel-santos91/pet-sitting-services-app/assets/107240729/97cee252-fe3f-48a7-b8bb-a7a0d7ce6ee3">
<img width="500" alt="Screenshot 2023-08-03 at 20 47 23" src="https://github.com/samuel-santos91/pet-sitting-services-app/assets/107240729/294a6ce2-6ac6-4fbf-ac04-b824955a582f">

### As a customer you can choose the type of service you prefer <br>
<img width="500" alt="Screenshot 2023-08-03 at 20 49 35" src="https://github.com/samuel-santos91/pet-sitting-services-app/assets/107240729/05d89f21-83ec-4ba8-a8aa-3903037edc00">

### You can check your list of requests <br>
<img width="500" alt="Screenshot 2023-08-03 at 20 51 20" src="https://github.com/samuel-santos91/pet-sitting-services-app/assets/107240729/5947c04b-331c-4468-8af1-c0d5e82684ac">

### As a sitter choose to accept or reject each request <br>
<img width="500" alt="Screenshot 2023-08-03 at 20 52 39" src="https://github.com/samuel-santos91/pet-sitting-services-app/assets/107240729/867393d4-d3c0-48ac-a545-db7a3b0cd2b4">

## About
### Sections
* There are four different sections in this app:
  * Log in/ Sign in page
  * Customer's page
  * Sitter's page
  * Requests page
* You can log in as a user/sitter or create an account
* Users make a request by choosing:
  * type of pet
  * to upload a picture of your pet
  * type of service
  * sitter
* The sitter will have the request listed on his requests page and can choose to accept it 
### Features
* All pictures are saved on the server
* All the request are saved in a <strong>MySQL</strong> database
* When the request is accepted or reject, the status column in the database is updated
* When user logs in, the server generates a <strong>JWT</strong> token that is stored in the <strong>Local Storage</strong>

## Json Web Token(JWT)
This application uses <strong>JWT</strong>
* Why <strong>JWT</strong>?
  * We make sure the user who is sending requests to your server is the same user who logged in during authentication
  * Instead of storing information on the server after authentication, JWT creates a JSON web token and encodes, sterilizes, and adds a signature with a secret key that cannot be tampered with
  * This key is sent back to the browser. Each time a request is sent, it verifies and sends the response back.
  
## Backend repository
Refer to https://github.com/samuel-santos91/pet-sitting-services-app-backend

## Prerequisites

### Install Node JS
Refer to https://nodejs.org/en/

### Install MySQL
Refer to https://dev.mysql.com/downloads/installer/

## Cloning and Running the Application in local

Clone the project into local

Install all the npm packages. Go into the project folder and type the following command to install all npm packages

```bash
npm install
```

In order to run the application Type the following command

```bash
npm run dev
```

The frontend runs on **127.0.0.1:5173** <br>
The backend runs on **localhost:3000** 

