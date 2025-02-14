const express = require('express');
const multer = require('multer');
const sharp = require('sharp');

const app = express();
const PORT = 8000;
const upload = multer();

// Ensure Express trusts the proxy headers (important for Cloudflare)
app.set('trust proxy', true);

app.use(express.json());

app.get('/api/', (req, res) => {
    res.send('Welcome to the HEIC Converter API');
});

app.post('/api/convert', upload.single('file'), async (req, res) => {
    try {
        console.log('Incoming Request:', req.hostname, req.headers);

        const { format, width } = req.body;
        const buffer = req.file.buffer;

        // Convert image using Sharp
        const convertedBuffer = await sharp(buffer)
            .resize(parseInt(width) || 800)
            .toFormat(format)
            .toBuffer();

        // Convert buffer to Base64
        const base64Image = `data:image/${format};base64,${convertedBuffer.toString('base64')}`;

        res.json({ image: base64Image });
    } catch (error) {
        res.status(500).json({ error: 'Conversion failed', details: error.message });
    }
});

// Start the server
app.listen(PORT, () => console.log(`Server running on http://0.0.0.0:${PORT}`));
