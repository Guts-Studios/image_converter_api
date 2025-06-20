# Image Converter API (HEIC ➜ JPG/PNG/WEBP)

A simple Node.js API using Express and Sharp to convert uploaded images to different formats.

### Endpoints

POST `/convert?format=jpg|png|webp`

**Form Field:** `image` (file)

Returns: Converted image as file (with proper `Content-Type`)

---

**To Deploy:**
1. Push to GitHub.
2. Deploy on [https://render.com](https://render.com).
