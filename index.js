const express = require('express');
const multer = require('multer');
const sharp = require('sharp');
const cors = require('cors');

const app = express();
const upload = multer({ storage: multer.memoryStorage() });

app.use(cors());

app.post('/convert', upload.single('image'), async (req, res) => {
  const format = req.query.format || 'jpg';

  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  try {
    console.log(`Converting ${req.file.originalname} to ${format}`);
    
    const converted = await sharp(req.file.buffer)
      .toFormat(format)
      .toBuffer();

    res.setHeader('Content-Disposition', `attachment; filename=converted.${format}`);
    res.setHeader('Content-Type', `image/${format}`);
    res.send(converted);
    
    console.log('Conversion successful');
  } catch (error) {
    console.error('Conversion error:', error);
    res.status(500).json({ 
      error: 'Image conversion failed', 
      details: error.message 
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Image Converter API running on port ${PORT}`);
  console.log('Sharp version:', sharp.versions);
});