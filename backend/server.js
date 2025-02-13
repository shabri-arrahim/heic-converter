const express = require('express');
const multer = require('multer');
const sharp = require('sharp');

const app = express();
const PORT = 8000;
const upload = multer();

app.use(express.json());

app.post('/convert', upload.single('file'), async (req, res) => {
    try {
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

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
