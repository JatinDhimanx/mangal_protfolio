# Mangal Portfolio — Automated Video Showcase 🎬

Pure HTML, CSS, and JavaScript portfolio featuring GPU-accelerated infinite reel scrolling, an Instagram-style profile, and automatic video reflection from the `assets/` folder.

---

## 🚀 How to Add New Videos

Just drop your video files into the **`assets/`** folder!

### Naming:
- `ve1.mp4`, `ve2.mp4`, `ve3.mov`, etc.
- Any filename like `gym_deal.mp4` or `app_promo.mp4`

### Automatic Behavior:
1. **Zero Configuration**:
   - No JSON files, no database, no coding needed.
   - Any video in `assets/` is instantly recognized and displayed on the website.
2. **Auto-Formatting**:
   - `ve1.mp4` ➔ **Video Edit 01**
   - `gym_deal.mp4` ➔ **Gym Deal**
3. **Seamless In-Feed Video & 9:16 Large Modal**:
   - Videos play directly looped inside their cards in the feed.
   - Clicking any video opens it in the focused **large 9:16 vertical ratio frame** with autoplay and audio controls.
4. **Live Auto-Refresh**:
   - The website updates automatically every 4 seconds when new video files are dropped into `assets/`.

---

## 💻 Running the Website

```bash
node server.js
```
Then open:
👉 **`http://localhost:3000`**
