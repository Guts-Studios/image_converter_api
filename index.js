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
    const converted = await sharp(req.file.buffer)
      .toFormat(format)
      .toBuffer();

    res.setHeader('Content-Disposition', `attachment; filename=converted.${format}`);
    res.setHeader('Content-Type', `image/${format}`);
    res.send(converted);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Image conversion failed' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
