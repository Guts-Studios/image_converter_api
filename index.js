const express = require('express');
const multer = require('multer');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const { execFile } = require('child_process');

const app = express();
const upload = multer({ storage: multer.memoryStorage() });

app.use(cors());

app.post('/convert', upload.single('image'), async (req, res) => {
  const format = req.query.format || 'jpg';

  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const inputPath = `/tmp/${Date.now()}_input.heic`;
  const outputPath = `/tmp/${Date.now()}_output.${format}`;
  fs.writeFileSync(inputPath, req.file.buffer);

  execFile('ffmpeg', ['-i', inputPath, outputPath], (err) => {
    if (err) {
      console.error('FFmpeg Error:', err);
      return res.status(500).json({ error: 'Image conversion failed' });
    }

    const output = fs.readFileSync(outputPath);
    res.setHeader('Content-Disposition', `attachment; filename=converted.${format}`);
    res.setHeader('Content-Type', `image/${format}`);
    res.send(output);

    fs.unlinkSync(inputPath);
    fs.unlinkSync(outputPath);
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
