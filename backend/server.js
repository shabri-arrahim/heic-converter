const express = require('express');
const multer = require('multer');
const sharp = require('sharp');

const app = express();
const PORT = 8000;
const upload = multer({ 
    limits: { fileSize: 50 * 1024 * 1024 } // 50MB limit
});


app.set('trust proxy', true);
app.use(express.json());

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK' });
});

// Image conversion endpoint
app.post('/api/convert', upload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }
        
        const { format, width } = req.body;
        const buffer = req.file.buffer;

        const convertedBuffer = await sharp(buffer)
            .resize(parseInt(width) || 800)
            .toFormat(format)
            .toBuffer();

        const base64Image = `data:image/${format};base64,${convertedBuffer.toString('base64')}`;
        res.json({ image: base64Image });

    } catch (error) {
        res.status(500).json({ error: 'Conversion failed', details: error.message });
    }
});

// Start the server and listen on 0.0.0.0
app.listen(PORT, '0.0.0.0', () => console.log(`Server running on http://0.0.0.0:${PORT}`));

// Export the app for debugging
module.exports = app;
