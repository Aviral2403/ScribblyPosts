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

        // Normalize email with fallback for existing users
        const normalizedEmail = validator.normalizeEmail(email, {
            all_lowercase: true,
            gmail_remove_dots: true
        })

        // Try normalized email first
        let user = await User.findOne({ email: normalizedEmail })

        // If no user found, try original email
        if (!user) {
            user = await User.findOne({ email: email })
        }

        if (!user) {
            return res.status(404).json({ error: "User not found" })
        }

        const match = await bcrypt.compare(password, user.password)
        if (!match) {
            return res.status(401).json({ error: "Invalid credentials" })
        }

        // Update user's email to normalized version if different
        if (user.email !== normalizedEmail) {
            user.email = normalizedEmail
            await user.save()
        }

        const token = jwt.sign(
            { id: user.id, username: user.username, email: user.email }, 
            process.env.SECRET, 
            { expiresIn: "3d" }
        )
        const { password: userPassword, ...info } = user._doc
        res.cookie("token", token).status(200).json({
            user: info,
            token: token
        })
    }
    catch (err) {
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

// REFETCH USER
router.get("/refetch", (req, res) => {
    const params = req.query
    const token = params.token
    jwt.verify(token, process.env.SECRET, {}, async (err, data) => {
        if (err) {
            return res.status(404).json(err)
        }
        res.status(200).json(data)
    })
})

module.exports = router