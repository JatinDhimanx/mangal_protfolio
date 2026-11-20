const fs = require('fs');
const path = require('path');

const DEFAULT_VIDEO_CDN =
  'https://cdn.jsdelivr.net/gh/JatinDhimanx/mangal_protfolio@main/assets';

function getVideoUrl(file) {
  const cdnBase = (process.env.VIDEO_CDN_URL || DEFAULT_VIDEO_CDN).replace(/\/+$/, '');
  return `${cdnBase}/${encodeURIComponent(file)}`;
}

module.exports = (req, res) => {
  const assetsDir = path.join(process.cwd(), 'assets');
  let videoFiles = [];

  try {
    if (fs.existsSync(assetsDir)) {
      const files = fs.readdirSync(assetsDir);
      videoFiles = files.filter(f => /\.(mp4|mov|webm|m4v)$/i.test(f));
    }
  } catch (err) {
    console.error('Error reading assets directory:', err);
  }

  const videos = videoFiles.map(file => {
    const baseId = path.parse(file).name.toLowerCase().replace(/[^a-z0-9_-]/g, '-');
    return {
      id: baseId,
      videoUrl: getVideoUrl(file)
    };
  });

  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.status(200).json(videos);
};
