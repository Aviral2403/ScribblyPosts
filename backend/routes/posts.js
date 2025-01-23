const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Post = require('../models/Post');
const Comment = require('../models/Comment');
const verifyToken = require('../VerifyToken');

// CREATE
router.post("/create", async (req, res) => {
    try {
        const token = req.query.token;
        const isValid = await verifyToken(token);
        if (!isValid) {
            return res.status(403).json("Not authenticated!");
        }
        const newPost = new Post(req.body);
        const savedPost = await newPost.save();
        
        res.status(200).json(savedPost);
    } catch (err) {
        res.status(500).json(err);
    }
});

// UPDATE
router.put("/:id", async (req, res) => {
    try {
        const token = req.query.token;
        const isValid = await verifyToken(token);
        
        if (!isValid) {
            return res.status(403).json("Not authenticated!");
        }
        
        // Find the post and verify ownership
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json("Post not found!");
        }
        
        if (post.userId !== req.body.userId) {
            return res.status(403).json("You can update only your posts!");
        }

        const updatedPost = await Post.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true }
        );
        
        res.status(200).json(updatedPost);
    } catch (err) {
        res.status(500).json(err);
    }
});


router.delete("/:id", async (req, res) => {
    try {
      const token = req.query.token;
      const isValid = await verifyToken(token);
      if (!isValid) {
        return res.status(403).json("Not authenticated!");
      }
  
      // Find the post and verify ownership
      const post = await Post.findById(req.params.id);
      if (!post) {
        return res.status(404).json("Post not found!");
      }
  
      // Add logging to debug
      console.log("Post userId:", post.userId);
      console.log("Request userId:", req.query.userId);
  
      if (post.userId !== req.query.userId) {
        return res.status(403).json("You can delete only your posts!");
      }
  
      await Post.findByIdAndDelete(req.params.id);
      await Comment.deleteMany({ postId: req.params.id });
      res.status(200).json("Post has been deleted!");
    } catch (err) {
      console.error("Delete error:", err);
      res.status(500).json(err);
    }
  });

// GET POST DETAILS
router.get("/:id", async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        res.status(200).json(post);
    } catch (err) {
        res.status(500).json(err);
    }
});

// GET POSTS (Searching of posts)
router.get("/", async (req, res) => {
    const query = req.query;
    
    try {
        // Define the search filter
        const searchFilter = [];
        
        if (query.search) {
            searchFilter.push(
                { title: { $regex: query.search, $options: "i" } },
                { username: { $regex: query.search, $options: "i" } },
                { categories: { $regex: query.search, $options: "i" } }
            );
        }
        
        // Fetch posts based on the search filter
        const posts = await Post.find(query.search ? { $or: searchFilter } : {});
        res.status(200).json(posts);
    } catch (err) {
        res.status(500).json(err);
    }
});

// GET POSTS OF A PARTICULAR USER
router.get("/user/:userId", async (req, res) => {
    try {
        const posts = await Post.find({ userId: req.params.userId });
        res.status(200).json(posts);
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;