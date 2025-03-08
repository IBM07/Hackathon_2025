const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const cors = require('cors');


const app = express();

// Middleware
app.use(cors()); // Enable CORS
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // Serve uploaded files

// Connect to MongoDB Atlas
const dbURI = 'mongodb+srv://ibrahimaejaz:Neymar%40321@hackathon.l5ski.mongodb.net/testDB?retryWrites=true&w=majority&appName=Hackathon';
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB Atlas'))
    .catch(err => console.error('Error connecting:', err));

// Define Video Schema
const videoSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    thumbnailUrl: { type: String, required: true },
    videoUrl: { type: String, required: true },
    uploadDate: { type: Date, default: Date.now }
});

const Video = mongoose.model('Video', videoSchema);

// Multer Setup for File Upload
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const folder = file.fieldname === 'thumbnail' ? 'uploads/thumbnails' : 'uploads/videos';
        cb(null, folder);
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}_${file.originalname}`);
    },
});

const upload = multer({ storage });

// API Endpoint to Handle Video Upload
app.post('/upload', upload.fields([
    { name: 'thumbnail', maxCount: 1 },
    { name: 'videoFile', maxCount: 1 },
]), async (req, res) => {
    console.log('Received a POST request to /upload');
    console.log('Request body:', req.body);
    console.log('Files:', req.files);

    try {

        const { title, description } = req.body;
        const thumbnailUrl = path.join('/uploads/thumbnails', req.files.thumbnail[0].filename);
        const videoUrl = path.join('/uploads/videos', req.files.videoFile[0].filename);

        // Save metadata to MongoDB
        const video = new Video({ title, description, thumbnailUrl, videoUrl});
        await video.save();

        res.status(201).json({ message: 'Video uploaded successfully', video });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to upload video' });
    }
});

// API Endpoint to Fetch All Videos
app.get('/videos', async (req, res) => {
    try {
        const videos = await Video.find(); // Fetch all videos from the database
        res.status(200).json(videos);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch videos' });
    }
});

// Start the Server
app.listen(5500, () => console.log('Server running on http://localhost:5500'));
