# Blogging Platform with Database Relationships, Authentication, and Authorization

This project is a Blogging Platform that utilizes PostgreSQL, Sequelize, bcryptjs, cookies, express-session, and Postman for testing.

## Project Description
This project uses PostgreSQL, Sequelize, bcryptjs, and express-session to create a simple backend for a Blogging Platform. It provides the following features:

User authentication and authorization using bcryptjs for password hashing and express-session for managing user sessions.
User signup, login, and logout functionality with session cookies to ensure authenticated access to certain routes.
Only users can delete their own posts and comments, preventing unauthorized access.

## Technologies Used

* **PostgreSQL**: A powerful open-source relational database management system.
* **Sequelize**: An ORM (Object-Relational Mapping) for Node.js that simplifies database operations.
* **bcryptjs**: A library for hashing passwords and comparing hashed passwords for authentication.
* **cookies**: Used to store session information on the client-side.
* **express-session**: Middleware for Express.js to manage user sessions.
* **Postman**: A popular API development and testing tool.

## Installation

### PostgreSQL
PostgreSQL is a powerful, open-source, and feature-rich database system. It provides reliability, flexibility, and excellent support for complex queries and data types.

To install PostgreSQL, follow the instructions below based on your operating system:

#### macOS

1. Install PostgreSQL using Homebrew package manager by running the following command in the terminal:
   ```
   brew install postgresql
   ```
2. Start the PostgreSQL service using the following command:
   ```
   brew services start postgresql
   ```

3. PostgreSQL should now be running on your system. You can interact with it using the `psql` command-line tool.

#### Windows

1. Download the PostgreSQL installer from the official website: https://www.postgresql.org/download/windows/

2. Run the downloaded installer and follow the installation wizard.

3. During the installation, you will be prompted to set a password for the default PostgreSQL user ("postgres"). Make sure to remember this password as you will need it later.

4. Complete the installation, and PostgreSQL will be installed on your system.

#### Linux (Ubuntu)

1. Open a terminal and run the following command to install PostgreSQL:
   ```
   sudo apt update
   sudo apt install postgresql
   ```

2. PostgreSQL should now be installed and running as a service on your system. You can interact with it using the `psql` command-line tool.

### Sequelize, bcryptjs, cookies, and express-session
1. Clone this repository to your local machine.
2. Navigate to the project directory and run the following command to install the dependencies:

  ```
  npm install
  ```

With PostgreSQL and Sequelize set up, you're ready to connect your application to the database and start performing CRUD operations.

### Postman
1. Download and install Postman from the [official website](https://www.postman.com/downloads/).

## Database Relationships
In this project, we have established the following database relationships:

- One-to-Many: A User can have multiple Posts and Comments.
- One-to-Many: A Post can have multiple Comments.
- Many-to-One: A Comment belongs to a User and a Post.

## Endpoints
The following endpoints are available in the API:

- POST */signup*: Allows a user to sign up by providing a name, email, and password. The password is securely hashed using bcryptjs, and a session cookie is created for automatic sign-in after signing up.
- POST */login*: Allows a returning user to log in if they already have an account. Incorrect credentials are prevented from accessing accounts.
- DELETE */logout*: Destroys the session cookie and logs the user out.
- GET */posts*: Retrieves all posts along with the associated userId and comments.
- GET */posts/:id*: Retrieves a specific post along with its comments.
- GET */users*: Provides a list of all users (for administrative purposes).
- GET */users/:id/posts*: Retrieves the posts of a specific user.
- GET */users/:id/comments*: Retrieves all comments made by a specific user.
- GET */posts/:id/comments*: Lists all comments from the specified post.
- POST */posts*: Allows a user to create a new post.
- POST */posts/:id/comments*: Allows a user to comment on the specified post.
- PATCH */posts/:id*: Allows the original poster to edit their post.
- PATCH */posts/:postId/comments/:commentId*: Allows the original commenter to edit their comment on a specific post.
- DELETE */posts/:id*: Allows the original poster to delete their post.
- DELETE */posts/:postId/comments/:commentId*: Allows the original commenter to delete their comment.

Please interact with the endpoints using Postman for further details on their usage.

## Testing

**signup**
![Signup](/images/signup.png)
*Successful user sign-up API call*

**logout**
![Logout](/images/logout.png)
*Successful user logout API call*

**login(incorrect password)**
![Login](/images/wrongpassword.png)
*Incorrect password, validation using bcrypt*

**login**
![Login](/images/login.png)
*Successful user login*

**GET /posts**
![GetPosts](/images/getposts.png)
*Successful API call to retrieve posts along with userId and comments*

**GET /posts/:id**
![GetSpecificPost](/images/getspecificpost.png)
*Successful API call to retrieve specified post*

**GET /users**
![GetUsers](/images/getusers.png)
*Successful API call to retrieve list of users*

**GET /users/:id/posts**
![GetUsersPosts](/images/getpostsfromuser.png)
*Successful API call to retrieve all posts from specified user*

**GET /users/:id/comments**
![GetUserComments](/images/getcommentsfromuser.png)
*Successful API call to retrieve all comments from specified user*

**GET /posts/:id/comments**
![GetPostComments](/images/getspecificcomment.png)
*Successful API call to retrieve all comments from specified post*

**POST /posts**
![Post](/images/postnewpost.png)
*Successful API call to post a new post*

**POST /posts/:id/comments**
![PostComment](/images/postnewcomment.png)
*Successful API call to post a new comment on a specified post*

**PATCH /posts/:id**
![UpdatePost](/images/updatepost.png)
*Successful API call to update your post*

**PATCH /posts/:id/comments**
![UpdateComment](/images/updatecomment.png)
*Successful API call to update your comment*

**DELETE /posts/:id"
![DeletePostNotYours](/images/deletepostnotyours.png)
*Unsuccessful API call to delete a post that is not yours*

**DELETE /posts/:id"
![DeletePost](/images/deletepost.png)
*Successful API call to delete your post*

**Posts after deletion**
![PostsAfterDelete](/images/postandcommentgone.png)
*Posts after deletion, where both the post and comments of that post are deleted*

## Authors
Felix[(CodeWithFlexicon)](https://github.com/CodeWithFlexicon)
