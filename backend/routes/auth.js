const express = require('express')
const router = express.Router()
const User = require('../models/User')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const validator = require('validator')

// Helper function to validate password
function validatePassword(password) {
    const errors = [];
    
    if (password.length < 8) {
        errors.push("Password must be at least 8 characters long");
    }
    if (!/[A-Z]/.test(password)) {
        errors.push("Password must contain at least one uppercase letter");
    }
    if (!/[a-z]/.test(password)) {
        errors.push("Password must contain at least one lowercase letter");
    }
    if (!/[0-9]/.test(password)) {
        errors.push("Password must contain at least one number");
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
        errors.push("Password must contain at least one special character");
    }
    
    return errors;
}

// REGISTER
router.post("/register", async (req, res) => {
    try {
        const { username, email, password } = req.body

        // Validate email format
        if (!validator.isEmail(email)) {
            return res.status(400).json({ error: "Invalid email format" })
        }

        // Normalize email
        const normalizedEmail = validator.normalizeEmail(email, {
            all_lowercase: true,
            gmail_remove_dots: true
        })

        // Check existing users
        const existingUser = await User.findOne({
            $or: [
                { email: normalizedEmail },
                { username: username }
            ]
        })

        if (existingUser) {
            if (existingUser.email === normalizedEmail) {
                return res.status(400).json({ error: "Email already in use" })
            }
            if (existingUser.username === username) {
                return res.status(400).json({ error: "Username already exists" })
            }
        }

        // Validate password
        const passwordValidationErrors = validatePassword(password);
        if (passwordValidationErrors.length > 0) {
            return res.status(400).json({ error: passwordValidationErrors[0] });
        }

        // Create user
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hashSync(password, salt)
        const newUser = new User({ 
            username, 
            email: normalizedEmail, 
            password: hashedPassword 
        })
        const savedUser = await newUser.save()
        res.status(200).json(savedUser)
    }
    catch (err) {
        // Handle specific MongoDB errors
        if (err.code === 11000) {
            return res.status(400).json({ error: "Duplicate key error" });
        }
        console.error(err)
        res.status(500).json({ error: "Server error during registration" })
    }
})

// LOGIN
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body

        // Validate input
        if (!email || !password) {
            return res.status(400).json({ error: "Email and password are required" });
        }

        // Normalize email
        const normalizedEmail = validator.normalizeEmail(email, {
            all_lowercase: true,
            gmail_remove_dots: true
        })

        // Find user
        const user = await User.findOne({ 
            $or: [
                { email: normalizedEmail },
                { email: email }
            ]
        })

        if (!user) {
            return res.status(404).json({ error: "User not found" })
        }

        // Verify password
        const match = await bcrypt.compare(password, user.password)
        if (!match) {
            return res.status(401).json({ error: "Invalid credentials" })
        }

        // Generate token with longer expiration
        const token = jwt.sign(
            { 
                id: user._id, 
                username: user.username, 
                email: user.email 
            }, 
            process.env.SECRET, 
            { expiresIn: "7d" } // Extended token validity
        )

        // Remove password from user object
        const { password: userPassword, ...userInfo } = user._doc

        // Send token in multiple ways
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        })

        res.status(200).json({
            user: userInfo,
            token: token
        })
    }
    catch (err) {
        console.error("Login error:", err)
        res.status(500).json({ error: "Server error during login" })
    }
})


// LOGOUT
router.get("/logout", async (req, res) => {
    try {
        res.clearCookie("token", { sameSite: "none", secure: true }).status(200).send("User logged out successfully!")
    }
    catch (err) {
        res.status(500).json(err)
    }
})




router.get("/refetch", async (req, res) => {
    const token = req.query.token;
    
    // Log incoming request for debugging
    console.log("Refetch request received with token:", token);
    
    // Check if token exists
    if (!token) {
      console.warn("No token provided in refetch request");
      return res.status(401).json({ error: "No token provided" });
    }
    
    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.SECRET);
      console.log("Decoded token:", decoded);
      
      // Fetch user, excluding password
      const user = await User.findById(decoded.id).select('-password');
      
      if (!user) {
        console.warn(`User not found for ID: ${decoded.id}`);
        return res.status(404).json({ error: "User not found" });
      }
      
      // Construct a clean user object
      const userResponse = {
        id: user._id,
        username: user.username,
        email: user.email
      }
      
      // Log successful user retrieval
    //   console.log(`User retrieved successfully: ${user.username}`);
      
      // Return user info
      res.status(200).json(userResponse);
    } catch (err) {
      // Detailed error logging
      console.error("Refetch error details:", {
        name: err.name,
        message: err.message,
        stack: err.stack
      });
  
      // Handle specific token verification errors
      if (err.name === 'JsonWebTokenError') {
        return res.status(401).json({ error: "Invalid token" });
      }
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ error: "Token expired" });
      }
      
      // Generic server error
      res.status(500).json({ error: "Server error during user refetch" });
    }
  });


module.exports = router
