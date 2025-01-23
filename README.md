ScribblyPosts | Type Your Vibe 

Overview: A Comprehensive Blogging Platform
ScribblyPosts is a dynamic and user-friendly web application designed to facilitate a seamless blogging experience. It serves as a versatile platform where users 
can create, manage, and share blog posts on a wide range of topics, as well as explore content from other bloggers. 
Whether you are a passionate writer, an avid reader, or simply looking for inspiration, ScribblyPosts offers all the tools and features you need to engage with the blogging community.

Key Features:

1) User Authentication:
Registration: New users can easily create an account by providing their details. The registration process is straightforward and secure, allowing users to
join the ScribblyPosts community quickly.
Login: Existing users can log in to their accounts with their credentials to access personalized features and manage their blog posts.
Blog Post Creation:

2) Write and Publish: Once logged in, users can craft and publish their own blog posts. The editor supports rich text formatting, allowing for a professional
and visually appealing presentation of content.

3) Drafts and Edits: Users can save drafts of their posts, edit existing ones, or delete them if necessary, providing flexibility in content management.

Content Exploration:

4) Browse Posts: Users can browse through a diverse range of blog posts created by others. The platform’s intuitive design makes it easy to navigate through
various categories and discover posts of interest.

5) Search Functionality: A robust search feature allows users to find specific posts or topics by entering keywords, enhancing the overall user experience.

6) Interactive Community:
Comments and Feedback: Users can engage with content by leaving comments, sharing their thoughts, and providing feedback on posts they find intriguing or useful.
User Profiles: Each user has a profile page showcasing their blog posts and interactions within the community, helping to build a personalized blogging presence.
7) User Interface:
The application features a clean and modern interface, optimized for both desktop and mobile devices. The responsive design ensures that users
have a consistent and enjoyable experience regardless of the device they use.

8) Security and Privacy:
ScribblyPosts prioritizes user security and privacy. All user data is protected with industry-standard encryption methods, and the platform adheres to best practices
to safeguard user information.

Conclusion:
ScribblyPosts is more than just a blogging platform; it’s a community where users can express their ideas, share their passions, and connect with 
like-minded individuals. With its comprehensive features and user-centric design, ScribblyPosts aims to be the go-to destination for anyone interested in the art of blogging.

📖 Table of Contents

Features
Technology Stack
Project Structure
Prerequisites
Installation
API Documentation
Database Schema
Security Features
Troubleshooting

🚀 Features
User Management

Secure user registration and authentication
JWT-based session management
User profile customization
Post bookmarking system

Content Management

Rich text blog post creation
Post categorization
Image upload and management
Draft saving functionality

Community Features

Comment system
Post search and filtering
Category-based browsing
User interaction system

Technical Features

Responsive React frontend
RESTful API architecture
MongoDB data persistence
Image storage with ImageKit
Comprehensive error handling

🛠 Technology Stack
Backend

Node.js & Express.js
MongoDB with Mongoose
JWT Authentication
ImageKit for media storage
bcrypt for password security

Frontend

React.js
Tailwind CSS
Axios for API calls
React Router for navigation

📁 Project Structure
Copyscribbly-posts/
├── backend/
│   ├── models/
│   │   ├── User.js
│   │   ├── Post.js
│   │   └── Comment.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── posts.js
│   │   ├── comments.js
│   │   └── users.js
│   └── index.js
└── frontend/
    ├── src/
    │   ├── components/
    │   ├── pages/
    │   └── App.jsx
    └── index.html
⚙️ Prerequisites

Node.js (v14 or higher)
MongoDB
npm or yarn
ImageKit account

🚀 Installation

Clone the repository:

bashCopygit clone https://github.com/Aviral2403/scribbly-posts.git

Configure environment variables:

Backend (.env)
envCopyMONGO_URL=your_mongodb_url
PORT=8800
SECRET=your_jwt_secret
IMAGEKIT_URL_ENDPOINT=your_imagekit_endpoint
IMAGEKIT_PUBLIC_KEY=your_public_key
IMAGEKIT_PRIVATE_KEY=your_private_key
Frontend (.env)
envCopyVITE_API_URL=http://localhost:8800

Install dependencies and start services:

Backend
bashCopycd backend
npm install
npm start
Frontend
bashCopycd frontend
npm install
npm run dev
📚 API Documentation
Authentication Endpoints
Register User
httpCopyPOST /api/auth/register
Request Body:
jsonCopy{
    "username": "user123",
    "email": "user@example.com",
    "password": "securepass123"
}
Success Response (200):
jsonCopy{
    "_id": "user_id",
    "username": "user123",
    "email": "user@example.com",
    "createdAt": "2024-01-22T10:30:00.000Z",
    "updatedAt": "2024-01-22T10:30:00.000Z"
}
Error Response (400):
jsonCopy{
    "error": "Username already exists"
}
Login User
httpCopyPOST /api/auth/login
Request Body:
jsonCopy{
    "email": "user@example.com",
    "password": "securepass123"
}
Success Response (200):
jsonCopy{
    "user": {
        "_id": "user_id",
        "username": "user123",
        "email": "user@example.com",
        "savedPosts": []
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
Error Response (401):
jsonCopy{
    "error": "Wrong credentials!"
}
Post Management
Create Post
httpCopyPOST /api/posts/create
Headers:
CopyAuthorization: Bearer {jwt_token}
Request Body:
jsonCopy{
    "title": "My First Blog",
    "desc": "Post content...",
    "photo": "base64_image",
    "username": "user123",
    "categories": ["technology"]
}
Success Response (201):
jsonCopy{
    "_id": "post_id",
    "title": "My First Blog",
    "desc": "Post content...",
    "photo": "image_url",
    "photoId": "image_id",
    "username": "user123",
    "userId": "user_id",
    "categories": ["technology"],
    "createdAt": "2024-01-22T11:00:00.000Z",
    "updatedAt": "2024-01-22T11:00:00.000Z"
}
Error Response (403):
jsonCopy{
    "error": "Not authenticated!"
}
Update Post
httpCopyPUT /api/posts/:id
Headers:
CopyAuthorization: Bearer {jwt_token}
Request Body:
jsonCopy{
    "title": "Updated Title",
    "desc": "Updated content..."
}
Success Response (200):
jsonCopy{
    "_id": "post_id",
    "title": "Updated Title",
    "desc": "Updated content...",
    "photo": "image_url",
    "username": "user123",
    "categories": ["technology"],
    "updatedAt": "2024-01-22T12:00:00.000Z"
}
Error Response (403):
jsonCopy{
    "error": "You can update only your posts!"
}
Get Posts
httpCopyGET /api/posts?search=technology
Success Response (200):
jsonCopy[
    {
        "_id": "post_id1",
        "title": "Tech Blog",
        "desc": "Technology content...",
        "photo": "image_url1",
        "username": "user123",
        "categories": ["technology"],
        "createdAt": "2024-01-22T10:00:00.000Z"
    },
    {
        "_id": "post_id2",
        "title": "Tech News",
        "desc": "Latest technology updates...",
        "photo": "image_url2",
        "username": "user456",
        "categories": ["technology", "news"],
        "createdAt": "2024-01-22T11:00:00.000Z"
    }
]
Comment Management
Add Comment
httpCopyPOST /api/comments/create
Request Body:
jsonCopy{
    "comment": "Great post!",
    "author": "user123",
    "postId": "post_id",
    "userId": "user_id"
}
Success Response (201):
jsonCopy{
    "_id": "comment_id",
    "comment": "Great post!",
    "author": "user123",
    "postId": "post_id",
    "userId": "user_id",
    "createdAt": "2024-01-22T13:00:00.000Z"
}
Error Response (400):
jsonCopy{
    "error": "Comment text is required"
}
Get Post Comments
httpCopyGET /api/comments/post/:postId
Success Response (200):
jsonCopy[
    {
        "_id": "comment_id1",
        "comment": "Great post!",
        "author": "user123",
        "postId": "post_id",
        "createdAt": "2024-01-22T13:00:00.000Z"
    },
    {
        "_id": "comment_id2",
        "comment": "Very informative",
        "author": "user456",
        "postId": "post_id",
        "createdAt": "2024-01-22T14:00:00.000Z"
    }
]
User Management
Save/Unsave Post
httpCopyPUT /api/users/save-post/:postId
Request Body:
jsonCopy{
    "userId": "user_id"
}
Success Response (200):
jsonCopy{
    "message": "Post saved successfully"
}
Error Response (404):
jsonCopy{
    "error": "Post not found"
}
Get Saved Posts
httpCopyGET /api/users/saved-posts/:userId
Success Response (200):
jsonCopy[
    {
        "_id": "post_id1",
        "title": "Saved Blog 1",
        "desc": "Content...",
        "photo": "image_url1",
        "username": "author1",
        "categories": ["technology"]
    },
    {
        "_id": "post_id2",
        "title": "Saved Blog 2",
        "desc": "Content...",
        "photo": "image_url2",
        "username": "author2",
        "categories": ["lifestyle"]
    }
]

📊 Database Schema
User Model
javascriptCopy{
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    savedPosts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post'
    }]
}
Post Model
javascriptCopy{
    title: {
        type: String,
        required: true,
        unique: true
    },
    desc: {
        type: String,
        required: true
    },
    photo: String,
    username: {
        type: String,
        required: true
    },
    categories: Array
}
Comment Model
javascriptCopy{
    comment: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    postId: {
        type: String,
        required: true
    },
    userId: {
        type: String,
        required: true
    }
}
🔒 Security Features

Password hashing with bcrypt
JWT authentication
Input validation and sanitization
CORS protection
Request rate limiting
Secure image upload handling
XSS protection

❗ Error Handling
Common Response Codes

200: Success
201: Resource created
400: Bad request
401: Unauthorized
403: Forbidden
404: Not found
500: Server error

Error Response Format
jsonCopy{
    "error": {
        "message": "Error description",
        "code": "ERROR_CODE"
    }
}
🔧 Troubleshooting
Common Issues

Connection Issues


Verify MongoDB connection string
Check if server is running
Confirm correct port configuration


Authentication Problems


Verify JWT token expiration
Check login credentials
Clear browser cache


Image Upload Issues


Verify ImageKit credentials
Check file size limits
Confirm supported file formats