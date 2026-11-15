/**
 * Mangal Portfolio — Direct Video Showcase Engine
 * 
 * Shows ONLY the exact video files uploaded in the 'assets/' folder.
 * Pure video frames with zero titles, zero tags, and seamless infinite looping.
 */

document.addEventListener('DOMContentLoaded', async () => {
  const reelsViewport = document.getElementById('reels-viewport');
  const reelsFeed = document.getElementById('reels-feed');
  const videoModal = document.getElementById('video-modal');
  const modalCloseBtn = document.getElementById('modal-close-btn');
  const modalLargeContainer = document.getElementById('modal-large-container');

  let videosData = [];
  const videosMap = new Map();

  // ==========================================
  // 1. Fetch ONLY Videos Present in assets/
  // ==========================================
  async function fetchVideos() {
    // 1. Fetch from server endpoint /api/videos (scans assets/ directory)
    try {
      const res = await fetch(`/api/videos?t=${Date.now()}`);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) return data;
      }
    } catch (e) {
      // Backend not running (e.g. static hosting or Live Server)
    }

    // 2. Client-side probe fallback for static hosting
    return await probeStaticAssets();
  }

  // Client-side probe for assets/ve1.mp4 ... assets/ve25.mp4
  async function probeStaticAssets() {
    const list = [];
    const candidates = [];
    for (let i = 1; i <= 25; i++) candidates.push(`ve${i}.mp4`);
    candidates.push('final.mp4');

    const checks = candidates.map(fileName => {
      const url = `assets/${fileName}`;
      return fetch(url, { method: 'HEAD' })
        .then(res => {
          if (res.ok) {
            const base = fileName.replace(/\.[^/.]+$/, '');
            return {
              id: base,
              videoUrl: url
            };
          }
          return null;
        })
        .catch(() => null);
    });

    const results = await Promise.all(checks);
    results.forEach(v => {
      if (v) list.push(v);
    });

    return list;
  }

  // ==========================================
  // 2. Render Direct Video Cards (No Titles, No Tags)
  // ==========================================
  function createCardElement(video) {
    const article = document.createElement('article');
    article.className = 'reel-item';
    article.setAttribute('data-reel-id', video.id);

    // Direct clean video reel container: no title, no tags, pure video
    article.innerHTML = `
      <div class="reel-preview-card">
        <div class="reel-video-container autoplay-active">
          <video src="${video.videoUrl}" autoplay loop muted playsinline class="reel-cover"></video>
          <div class="reel-lighting-glow"></div>

          <div class="card-video-timeline">
            <div class="card-timeline-fill" id="timeline-${video.id}"></div>
          </div>

          <button class="play-btn" aria-label="Play Video">
            <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22">
              <path d="M8 5v14l11-7z"/>
            </svg>
          </button>
        </div>
      </div>
    `;

    return article;
  }

  function renderFeed(videos) {
    if (!reelsFeed) return;
    reelsFeed.innerHTML = '';

    if (!videos || !videos.length) {
      reelsFeed.innerHTML = `
        <div style="padding: 40px 20px; text-align: center; color: #71717a;">
          <p style="font-size: 1.1rem; font-weight: 600; color: #18181b; margin-bottom: 8px;">No videos in assets folder</p>
          <p style="font-size: 0.85rem;">Drop your .mp4 files into <code>assets/</code> to show them here automatically.</p>
        </div>
      `;
      return;
    }

    // Multiply the assets array so the feed has enough height for a smooth loop (minimum 4 cards per set)
    const minCardsPerSet = 4;
    const repeatMultiplier = Math.max(1, Math.ceil(minCardsPerSet / videos.length));

    const loopSet = [];
    for (let r = 0; r < repeatMultiplier; r++) {
      loopSet.push(...videos);
    }

    // Add Base Set (shows only the videos from assets/)
    loopSet.forEach(v => reelsFeed.appendChild(createCardElement(v)));

    // Add Clone Set for mathematically seamless infinite wrapping
    loopSet.forEach(v => {
      const clone = createCardElement(v);
      clone.setAttribute('data-is-clone', 'true');
      reelsFeed.appendChild(clone);
    });

    requestAnimationFrame(updateLoopHeight);
  }

  let singleLoopHeight = 0;
  function updateLoopHeight() {
    if (!reelsFeed) return;
    singleLoopHeight = reelsFeed.scrollHeight / 2;
  }
  window.addEventListener('resize', updateLoopHeight);

  function updateDataAndFeed(videos) {
    videosData = videos || [];
    videosMap.clear();
    videosData.forEach(v => videosMap.set(v.id, v));
    renderFeed(videosData);
  }

  // Initial load
  const initialVideos = await fetchVideos();
  updateDataAndFeed(initialVideos);

  // Auto-refresh feed when new videos are added to assets/ without needing manual reload
  let lastSignature = videosData.map(v => v.id + v.videoUrl).join('|');
  setInterval(async () => {
    if (document.querySelector('.modal-backdrop.active')) return;
    try {
      const fresh = await fetchVideos();
      if (fresh && fresh.length) {
        const sig = fresh.map(v => v.id + v.videoUrl).join('|');
        if (sig !== lastSignature) {
          lastSignature = sig;
          updateDataAndFeed(fresh);
        }
      }
    } catch (e) {}
  }, 4000);

  // ==========================================
  // 3. Ultra-Smooth Infinite Scroll Engine (GPU-Accelerated)
  // ==========================================
  let currentY = 0;
  let targetY = 0;
  const autoDriftSpeed = 0.75;
  let isHovered = false;
  let isDragging = false;
  let lastFrameTime = performance.now();

  function animateLoop(now) {
    const dt = Math.min((now - lastFrameTime) / 16.67, 2);
    lastFrameTime = now;

    if (!isHovered && !isDragging) {
      targetY -= autoDriftSpeed * dt;
    }

    currentY += (targetY - currentY) * 0.12;

    if (singleLoopHeight > 0) {
      while (currentY <= -singleLoopHeight) {
        currentY += singleLoopHeight;
        targetY += singleLoopHeight;
      }
      while (currentY > 0) {
        currentY -= singleLoopHeight;
        targetY -= singleLoopHeight;
      }
    }

    if (reelsFeed) {
      reelsFeed.style.transform = `translate3d(0, ${currentY.toFixed(2)}px, 0)`;
    }

    requestAnimationFrame(animateLoop);
  }
  requestAnimationFrame(animateLoop);

  // Responsive Wheel & Touch Handlers
  const isDesktop = () => window.innerWidth > 860;

  window.addEventListener('wheel', (e) => {
    if (document.querySelector('.modal-backdrop.active')) return;
    if (isDesktop() || e.target.closest('#reels-viewport')) {
      e.preventDefault();
      targetY -= e.deltaY * 0.85;
    }
  }, { passive: false });

  let touchStartPos = 0;
  let isTouchingFeed = false;

  window.addEventListener('touchstart', (e) => {
    if (document.querySelector('.modal-backdrop.active')) return;
    touchStartPos = e.touches[0].clientY;
    isTouchingFeed = !!e.target.closest('#reels-viewport');
    if (isDesktop() || isTouchingFeed) {
      isDragging = true;
    }
  }, { passive: true });

  window.addEventListener('touchmove', (e) => {
    if (document.querySelector('.modal-backdrop.active')) return;
    if (isDesktop() || isTouchingFeed) {
      const currentTouch = e.touches[0].clientY;
      targetY -= (touchStartPos - currentTouch) * 1.35;
      touchStartPos = currentTouch;
    }
  }, { passive: true });

  window.addEventListener('touchend', () => {
    isDragging = false;
    isTouchingFeed = false;
  });

  if (reelsViewport) {
    reelsViewport.addEventListener('mouseenter', () => { isHovered = true; });
    reelsViewport.addEventListener('mouseleave', () => { isHovered = false; });
  }

  // In-Card Progress Timelines
  setInterval(() => {
    videosData.forEach((v, idx) => {
      const el = document.querySelectorAll(`#timeline-${v.id}`);
      if (!el.length) return;
      const progress = ((Date.now() / 35 + idx * 25) % 100);
      el.forEach(bar => { bar.style.width = `${progress}%`; });
    });
  }, 50);

  // ==========================================
  // 4. Large Video Modal (9:16 Ratio & Instant Autoplay)
  // ==========================================
  if (reelsFeed) {
    reelsFeed.addEventListener('click', (e) => {
      const card = e.target.closest('.reel-item');
      if (!card) return;

      const reelId = card.getAttribute('data-reel-id');
      const data = videosMap.get(reelId);
      if (!data || !data.videoUrl) return;

      if (modalLargeContainer) {
        modalLargeContainer.innerHTML = `
          <video 
            src="${data.videoUrl}" 
            autoplay 
            controls 
            playsinline 
            style="width: 100%; height: 100%; object-fit: cover; border-radius: 28px; display: block;"
          ></video>
        `;
      }

      if (videoModal) {
        videoModal.classList.add('active');
        isHovered = true;
      }
    });
  }

  function closeModal(modal) {
    if (!modal) return;
    modal.classList.remove('active');
    isHovered = false;
    if (modal === videoModal && modalLargeContainer) {
      modalLargeContainer.innerHTML = '';
    }
  }

  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', () => closeModal(videoModal));
  }

  // Agency Modal
  const agencyModal = document.getElementById('agency-modal');
  const openAgencyBtn = document.getElementById('open-agency-btn');
  const agencyCloseBtn = document.getElementById('agency-close-btn');
  const agencyContactBtn = document.getElementById('agency-contact-btn');

  if (openAgencyBtn) {
    openAgencyBtn.addEventListener('click', (e) => {
      e.preventDefault();
      if (agencyModal) {
        agencyModal.classList.add('active');
        isHovered = true;
      }
    });
  }

  if (agencyCloseBtn) {
    agencyCloseBtn.addEventListener('click', () => closeModal(agencyModal));
  }

  if (agencyContactBtn) {
    agencyContactBtn.addEventListener('click', () => {
      closeModal(agencyModal);
      window.location.href = "mailto:mangal@lesgoomedia.com?subject=Lesgoo%20Media%20Growth%20Inquiry";
    });
  }

  [videoModal, agencyModal].forEach(modal => {
    if (!modal) return;
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal(modal);
    });
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeModal(videoModal);
      closeModal(agencyModal);
    }
  });

  // ==========================================
  // 5. Polaroid 3D Tilt & Toast Notification
  // ==========================================
  const polaroidWrapper = document.getElementById('polaroid-wrapper');
  const polaroidCard = document.getElementById('polaroid-card');
  const toast = document.getElementById('toast');
  const toastMsg = document.getElementById('toast-message');
  let toastTimer = null;

  function showToast(message) {
    if (toastTimer) clearTimeout(toastTimer);
    toastMsg.textContent = message;
    toast.classList.add('show');
    toastTimer = setTimeout(() => {
      toast.classList.remove('show');
    }, 3200);
  }

  if (polaroidWrapper && polaroidCard) {
    polaroidWrapper.addEventListener('mousemove', (e) => {
      const rect = polaroidCard.getBoundingClientRect();
      const cardX = e.clientX - rect.left - rect.width / 2;
      const cardY = e.clientY - rect.top - rect.height / 2;
      const rotateX = - (cardY / (rect.height / 2)) * 10;
      const rotateY = (cardX / (rect.width / 2)) * 10;
      polaroidCard.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) rotate(-2deg) scale(1.04)`;
    });

    polaroidWrapper.addEventListener('mouseleave', () => {
      polaroidCard.style.transform = `rotate(-3.5deg) scale(1)`;
    });

    polaroidCard.addEventListener('click', () => {
      polaroidCard.style.transition = 'transform 0.15s ease';
      polaroidCard.style.transform = 'scale(0.96) rotate(-5deg)';
      setTimeout(() => {
        polaroidCard.style.transform = 'scale(1.06) rotate(0deg)';
        showToast("📸 Say cheese! Nice to meet you :)");
      }, 150);
      setTimeout(() => {
        polaroidCard.style.transition = '';
        polaroidCard.style.transform = 'rotate(-3.5deg)';
      }, 500);
    });
  }

  // Email Copy Pill
  const emailPill = document.getElementById('email-pill');
  if (emailPill) {
    emailPill.addEventListener('click', (e) => {
      e.preventDefault();
      const email = 'mangal@lesgoomedia.com';
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(email).then(() => {
          showToast(`Copied ${email} to clipboard! ✨`);
        }).catch(() => {
          window.location.href = `mailto:${email}`;
        });
      } else {
        window.location.href = `mailto:${email}`;
      }
    });
  }
});
