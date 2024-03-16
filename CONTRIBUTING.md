### Starting the Server

To start the backend server, follow these steps:

**Step 1: Install Dependencies**

- Run `npm install` to install the required dependencies for the backend.

**Step 2: Start the Server**

- Run `npm start` to launch the server using Nodemon, which automatically restarts the server when changes are made. If you don't have Nodemon installed, you can do so globally by running `npm i -g nodemon`. This will install Nodemon globally on your PC.

These two steps will initiate the backend server, allowing you to access the APIs and services provided by the Social Media App Backend. Ensure that your environment variables are correctly set to enable seamless server operation.

## Environment Variables

To run and deploy the backend successfully, you need to configure the following environment variables based on your deployment environment (Development, Preview, Production):

- **MONGO_URI:** `<your MongoDB uri here>` The URI to connect to your MongoDB database, for running locally you can set `mongodb://localhost:27017` in production enter your MognoDB Altas uri.
- **MONGO_URI:** `<your MongoDB uri here>` The URI to connect to your MongoDB database, where user and post data are stored. Since I've used MongoDB in this project, make sure to replace with your actual MongoDB Atlas connection string.
- **CLOUDINARY_API_KEY:** Your Cloudinary API key for handling image and video uploads.
- **CLOUDINARY_API_SECRET:** Your Cloudinary API secret for secure access to the Cloudinary service.
- **CLOUDINARY_CLOUD_NAME:** Your Cloudinary cloud name, identifying your Cloudinary account.
- **SMTP_USER:** Your email address through which you want to send emails using Nodemailer.
- **SMTP_PASS:** This is not your Gmail password. To obtain the correct value, go to your Google Account settings, search for "App passwords," create a new app password, and use that generated password.
- **SMTP_SERVICE:** Use "gmail" as the SMTP service provider.
- **SMTP_PORT:** Set this to "465," which is the port number for the SMTP service.
- **SMTP_HOST:** Use "smtp.gmail.com" as the host or server address for the SMTP service.
- **NODE_ENV:** Set it to "Production" to indicate the production environment.
- **JWT_SECRET:** Your secret key for generating JSON Web Tokens (JWTs) for user authentication and authorization.
- **PORT:** The port on which the backend server will listen for incoming requests.

These environment variables are crucial for the proper functioning and security of the backend. You should set them according to your deployment environment and the services you're using.

## Docker Installation
### Prerequisites
Before you begin, ensure that you have the following prerequisites installed on your system:

Docker**: [Install Docker](https://docs.docker.com/engine/install/)

Docker Compose**: [Install Docker Compose](https://docs.docker.com/compose/install/)

#### Clone the Repository:
`git clone https://github.com/shivang-16/Social_Media_App_Backend`

#### Environment Configuration:
Edit the environment variable in the `.env` file in source code.
Note- For docker installation use `mongodb://mongo_db:2717` as local MONGO_URI

#### Build Docker Images and Start the server:
`docker-compose up --build` or simply `docker compose up`
 
#### Access the Application:
Once the containers are up and running, access the backend server at the port you have assigned in you .env file.

#### Stopping the Application
`docker-compose down`

With this backend in place and properly configured, you can build and integrate your frontend application to create a fully functional social media platform. Users will be able to register, log in, create and interact with posts, follow/unfollow other users, and more, all powered by this backend infrastructure.
