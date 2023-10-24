# Social Media App Backend

## Project Overview
The Social Media App Backend serves as the core infrastructure for a social networking platform. It provides a comprehensive set of APIs and services for user management, post creation, interaction with posts, and user connections. The backend is designed to be easily deployable on various server platforms, such as Vercel or Netlify, making it accessible for integration into your own website or application.

## GitHub Repository
You can access the source code and project files on the GitHub repository: [Social Media App Backend Repository](https://github.com/shivang-16/Social_Media_App_Backend)

## Deployment and Integration
The backend is deployable on various server platforms, including Vercel and Netlify. Once deployed, you can seamlessly integrate it into your frontend application, enabling users to register, create posts, interact with content, and establish connections on your social media platform. To get started:

### Starting the Server
To start the backend server, follow these steps:

**Step 1: Install Dependencies**
- Run `npm install` to install the required dependencies for the backend.

**Step 2: Start the Server**
- Run `npm start` to launch the server using Nodemon, which automatically restarts the server when changes are made. If you don't have Nodemon installed, you can do so globally by running `npm i -g nodemon`. This will install Nodemon globally on your PC.

These two steps will initiate the backend server, allowing you to access the APIs and services provided by the Social Media App Backend. Ensure that your environment variables are correctly set to enable seamless server operation.

## Environment Variables
To run and deploy the backend successfully, you need to configure the following environment variables based on your deployment environment (Development, Preview, Production):

- **FRONTEND_URL:** The URL of the frontend application that will communicate with this backend. For example, during development, use "http://localhost:3000," and when you deploy your frontend, update this variable with the actual frontend URL.
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

With this backend in place and properly configured, you can build and integrate your frontend application to create a fully functional social media platform. Users will be able to register, log in, create and interact with posts, follow/unfollow other users, and more, all powered by this backend infrastructure.

## API Documentation
For in-depth details and comprehensive documentation of the API endpoints, you can explore my Postman collection. This collection offers a well-structured and interactive guide to using the Social Media App Backend:
[#### Social Media App Backend Postman Documentation - ](https://documenter.getpostman.com/view/28918164/2s9YRDyq1z)
By visiting this documentation, you'll find examples, explanations, and the ability to interact directly with the API endpoints. It's a valuable resource for understanding and testing the capabilities of this backend.

### For users
This section encompasses API endpoints related to user management and profiles. Users can register, log in, update their profiles, reset passwords, and interact with their own and other users' profiles.

#### POST Register
- **Endpoint:** `http://localhost:5000/api/v1/user/register`
- **Description:** Register a new user with the provided information.
- **Body:** User details including name, username, email, and password.

#### POST OTP Verification
- **Endpoint:** `http://localhost:5000/api/v1/user/verify`
- **Description:** Verify the user's identity by entering the OTP received on the registered email during registration.
- **Body:** OTP (One-Time Password) for verification.

#### POST Login
- **Endpoint:** `http://localhost:5000/api/v1/user/login`
- **Description:** Log in to the platform with your credentials.
- **Body:** User's login identifier (username or email) and password.

#### GET Logout
- **Endpoint:** `http://localhost:5000/api/v1/user/logout`
- **Description:** Log out from the platform, ending the current user session.

#### POST Get User by ID
- **Endpoint:** `http://localhost:5000/api/v1/user/{userId}`
- **Description:** Retrieve user information by providing the user's unique ID.
- **Parameters:** `userId` - The unique user id in the database.

#### PATCH Update User Details
- **Endpoint:** `http://localhost:5000/api/v1/user/update`
- **Description:** Update user profile information.
- **Body:** Form data with fields for name, bio, date of birth, location, website link, and avatar image (all fields are optional).
  
#### GET Remove Avatar
- **Endpoint:** `http://localhost:5000/api/v1/user/deleteAvatar`
- **Description:** Remove the user's profile picture (avatar).

#### GET Get All Users with Filters and Pagination
- **Endpoint:** `http://localhost:5000/api/v1/user/all`
- **Description:** Retrieve a list of all users with optional filters and pagination.
  You can set the limit of users per page and navigate to different pages by using query parameters - `page` and `limit`. For example, `http://localhost:5000/api/v1/user/all?limit=4&page=2`.

#### GET My Profile
- **Endpoint:** `http://localhost:5000/api/v1/user/myProfile`
- **Description:** Fetch the profile information of the currently logged-in user.

#### GET My Posts
- **Endpoint:** `http://localhost:5000/api/v1/user/me/posts`
- **Description:** Retrieve the posts made by the currently logged-in user.

#### GET My Bookmarks
- **Endpoint:** `http://localhost:5000/api/v1/user/me/bookmarks`
- **Description:** Get a list of posts bookmarked by the currently logged-in user.

#### GET Get User's Posts by User ID
- **Endpoint:** `http://localhost:5000/api/v1/user/posts/{userId}`
- **Description:** Retrieve posts made by a specific user, identified by their unique user ID.
- **Parameters:** `userId` - The unique user id in the database.

#### DELETE Delete User
- **Endpoint:** `http://localhost:5000/api/v1/user/delete`
- **Description:** Delete the user's account and associated data.

#### POST Forgot Password
- **Endpoint:** `http://localhost:5000/api/v1/user/forgetPassword`
- **Description:** Initiate the process to reset the user's password by providing their email.
- **Body:** User's email for password reset.

#### POST Change Password
- **Endpoint:** `http://localhost:5000/api/v1/user/changePassword`
- **Description:** Change the user's password by providing an OTP and the new password.
- **Body:** Username (associated with your account), OTP, and the newPassword.

### For Posts
This section covers API endpoints related to creating, viewing, and managing posts on the platform. Users can create new posts, retrieve posts, update captions, like, comment on, and bookmark posts in this section.

#### POST Create Post
- **Endpoint:** `http://localhost:5000/api/v1/post/create`
- **Description:** Create a new post with an optional caption and image attachment.
- **Body:** Form data with a caption and an image attachment. The caption is mandatory, and the image attachment is optional.

#### GET Get All Posts
- **Endpoint:** `http://localhost:5000/api/v1/post/all`
- **Description:** Retrieve all posts on the platform.

#### GET Get Post by ID
- **Endpoint:** `http://localhost:5000/api/v1/post/{postId}`
- **Description:** Retrieve a specific post by its unique ID.
- **Parameters:** `postId` - The unique post id in the database.

#### GET Get Posts of Following
- **Endpoint:** `http://localhost:5000/api/v1/post/following`
- **Description:** Fetch posts from users that the current user is following.

#### DELETE Delete Post
- **Endpoint:** `http://localhost:5000/api/v1/post/{postId}`
- **Description:** Delete a post by providing its unique post ID.
- **Parameters:** `postId` - The unique post id in the database.

#### PATCH Update Post
- **Endpoint:** `http://localhost:5000/api/v1/post/{postId}`
- **Description:** Update the caption of the post.
- **Body:** New caption for the post.
- **Parameters:** `postId` - The unique post id in the database.

#### GET Like-Dislike Post
- **Endpoint:** `http://localhost:5000/api/v1/post/likes/{postId}`
- **Description:** Like or dislike a post by providing its unique post ID.
- **Parameters:** `postId` - The unique post id in the database.

#### POST Comments
- **Endpoint:** `http://localhost:5000/api/v1/post/comments/{postId}`
- **Description:** Add a comment to a specific post.
- **Body:** Comment content.
- **Parameters:** `postId` - The unique post id in the database.

#### GET Bookmarks
- **Endpoint:** `http://localhost:5000/api/v1/post/bookmark/{postId}`
- **Description:** Bookmark or unbookmark a post.
- **Parameters:** `postId` - The unique post id in the database.

#### DELETE Delete Comment
- **Endpoint:** `http://localhost:5000/api/v1/post/{postId}/comments/{commentId}`
- **Description:** Delete a comment on a post by providing the comment's unique ID.
- **Parameters:** `postId` - The unique post id in the database.
- **Parameters:** `commentId` - The unique comment id in the database.

### Followers/Following
In this section, you'll find API endpoints for managing user connections and relationships on the platform. This includes following and unfollowing other users, which affects the content users see in their feed and interactions with the posts of followed users.

#### GET Follow/Unfollow
- **Endpoint:** `http://localhost:5000/api/v1/follow/{userId}`
- **Description:** Follow or unfollow a specific user by providing their user ID.
- **Parameters:** `userId` - The unique user id in the database.

I hope this README has provided you with the insights and information you need to get started with the Social Media App Backend. 

Should you have any questions, encounter issues, or wish to contribute to this project, please don't hesitate to reach out via my GitHub repository. Your feedback and collaboration are greatly appreciated as we work towards enhancing this backend for the benefit of the developer community.
