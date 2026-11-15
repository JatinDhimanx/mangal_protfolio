# Mangal Portfolio — Direct Video Showcase 🎬

Pure HTML, CSS, and JavaScript portfolio featuring direct video reels with GPU-accelerated infinite scrolling, responsive design, and automatic asset detection.

---

## 🚀 How It Works

1. **Direct Video Reels**:
   - Videos are displayed directly as clean, floating video reels without titles, tags, or subtitles.
   - Click any video to open it in the large 9:16 player with full audio, autoplay, and controls.

2. **Shows ONLY Videos in `assets/`**:
   - The feed displays **only and exactly** the videos you put in the `assets/` folder (e.g. `ve1.mp4`, `ve2.mp4`).
   - Automatically repeats them in a seamless loop for infinite scrolling.

3. **To Add More Videos**:
   - Just drop your `.mp4`, `.mov`, or `.webm` files into the `assets/` folder!
   - The site auto-detects new uploads every 4 seconds.

---

## ☁️ Deploying to Vercel

### Option 1: GitHub & Vercel Dashboard (Recommended)
1. Push this folder to a GitHub repository.
2. Go to [vercel.com](https://vercel.com) and click **"Add New Project"**.
3. Import your repository and click **"Deploy"**!
   - All settings, routing, and `/api/videos` are pre-configured in `vercel.json` and `api/videos.js`.

### Option 2: Vercel CLI
Run in your terminal:
```bash
npx vercel
```
Follow the quick prompts, and your site is live!

---

## 💻 Local Testing

```bash
node server.js
```
Then open:
👉 **`http://localhost:3000`**
