const express = require('express');
const multer = require('multer');
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const cors = require('cors');

const app = express();
const upload = multer({ storage: multer.memoryStorage() });

app.use(cors());

app.post('/convert', upload.single('image'), async (req, res) => {
  const format = req.query.format || 'jpg';
  const ext = path.extname(req.file.originalname).toLowerCase();

  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  try {
    if (ext === '.heic' || ext === '.heif') {
      // Use ImageMagick for HEIC files
      const inputPath = `/tmp/${Date.now()}_input${ext}`;
      const outputPath = `/tmp/${Date.now()}_output.${format}`;
      
      fs.writeFileSync(inputPath, req.file.buffer);

      exec(`convert "${inputPath}" "${outputPath}"`, (err) => {
        if (err) {
          console.error('ImageMagick conversion error:', err);
          return res.status(500).json({ 
            error: 'HEIC conversion failed', 
            details: err.message 
          });
        }

        try {
          const output = fs.readFileSync(outputPath);
          res.setHeader('Content-Disposition', `attachment; filename=converted.${format}`);
          res.setHeader('Content-Type', `image/${format}`);
          res.send(output);

          // Cleanup
          fs.unlinkSync(inputPath);
          fs.unlinkSync(outputPath);
        } catch (readErr) {
          console.error('File read error:', readErr);
          res.status(500).json({ error: 'Output file read failed' });
        }
      });
    } else {
      // Use Sharp for other formats
      const converted = await sharp(req.file.buffer)
        .toFormat(format)
        .toBuffer();

      res.setHeader('Content-Disposition', `attachment; filename=converted.${format}`);
      res.setHeader('Content-Type', `image/${format}`);
      res.send(converted);
    }
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
});