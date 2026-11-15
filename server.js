const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const ASSETS_DIR = path.join(__dirname, 'assets');

const MIME_TYPES = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.json': 'application/json',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.mp4': 'video/mp4',
  '.mov': 'video/quicktime',
  '.webm': 'video/webm',
  '.m4v': 'video/mp4',
  '.xml': 'application/xml',
  '.txt': 'text/plain'
};

// Scans assets/ directly for all uploaded video files
function getAssetVideos() {
  if (!fs.existsSync(ASSETS_DIR)) {
    fs.mkdirSync(ASSETS_DIR, { recursive: true });
  }

  const files = fs.readdirSync(ASSETS_DIR);
  const videoFiles = files.filter(f => /\.(mp4|mov|webm|m4v)$/i.test(f));

  return videoFiles.map(file => {
    const baseId = path.parse(file).name.toLowerCase().replace(/[^a-z0-9_-]/g, '-');
    return {
      id: baseId,
      videoUrl: `assets/${file}`
    };
  });
}

// HTTP Server
const server = http.createServer((req, res) => {
  const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const reqPath = parsedUrl.pathname;

  // Endpoint: returns exact videos from assets folder
  if (reqPath === '/api/videos') {
    const videos = getAssetVideos();
    res.writeHead(200, {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Access-Control-Allow-Origin': '*'
    });
    res.end(JSON.stringify(videos));
    return;
  }

  // Static file serving
  const relativeFile = reqPath === '/' ? '/index.html' : reqPath;
  const filePath = path.join(__dirname, relativeFile);

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('Not Found');
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    // HTTP 206 Partial Content: allows seamless video seeking and fast playback
    const range = req.headers.range;
    if (range && (ext === '.mp4' || ext === '.mov' || ext === '.webm' || ext === '.m4v')) {
      const totalSize = stats.size;
      const parts = range.replace(/bytes=/, "").split("-");
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : totalSize - 1;

      if (start >= totalSize || end >= totalSize) {
        res.writeHead(416, { 'Content-Range': `bytes */${totalSize}` });
        return res.end();
      }

      res.writeHead(206, {
        'Content-Range': `bytes ${start}-${end}/${totalSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': (end - start) + 1,
        'Content-Type': contentType,
        'Access-Control-Allow-Origin': '*'
      });
      fs.createReadStream(filePath, { start, end }).pipe(res);
      return;
    }

    // Standard static file response
    res.writeHead(200, {
      'Content-Type': contentType,
      'Content-Length': stats.size,
      'Accept-Ranges': 'bytes',
      'Access-Control-Allow-Origin': '*'
    });
    fs.createReadStream(filePath).pipe(res);
  });
});

function startServer(portToTry) {
  server.listen(portToTry, () => {
    console.log(`Server running at http://localhost:${portToTry}`);
  }).on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      startServer(portToTry + 1);
    } else {
      console.error('Server error:', err);
    }
  });
}

startServer(PORT);
