const express = require("express");
const app = express();
const multer = require('multer');
const path = require("path");
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const authRoute = require('./routes/auth');
const userRoute = require('./routes/userss');
const postRoute = require('./routes/posts');
const commentRoute = require('./routes/comments');
const ImageKit = require('imagekit');


dotenv.config();

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT
});

// Increase payload size limits
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Increase payload size limits
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:5174", "https://scribblyposts.onrender.com"],
  credentials: true,
  exposedHeaders: ["Authorization"]
}));

app.use("/images", express.static(path.join(__dirname, "/images")));
app.use(cookieParser());

// Configure multer with size limits and file filter
const storage = multer.diskStorage({
  destination: (req, file, fn) => {
    fn(null, "images");
  },
  filename: (req, file, fn) => {
    fn(null, req.body.img || Date.now() + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Not an image! Please upload only images.'), false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 50 * 1024 * 1024 // 50MB limit
  },
  fileFilter: fileFilter
});

app.use('/api/auth', authRoute);
app.use('/api/users', userRoute);
app.use('/api/posts', postRoute);
app.use('/api/comments', commentRoute);


app.post('/api/upload', async (req, res) => {
  try {
    const { file } = req.body;
    
    // Handle base64 image data
    let base64Image = file;
    if (file.startsWith('data:image')) {
      base64Image = file.replace(/^data:image\/\w+;base64,/, '');
    }

    // Upload to ImageKit
    const response = await imagekit.upload({
      file: base64Image,
      fileName: `${Date.now()}_blog_image`,
      folder: '/blog-images/'
    });

    res.status(200).json({
      url: response.url,
      fileId: response.fileId,
      name: response.name
    });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json("Error uploading image");
  }
});


const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("database is connected successfully!");
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
};

connectDB().then(() => {
  app.listen(process.env.PORT, () => {
    console.log("app is running on port " + process.env.PORT);
  });
});
