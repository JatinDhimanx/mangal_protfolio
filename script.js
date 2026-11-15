/**
 * Mangal Portfolio — Dynamic Engine
 * 
 * Features:
 * 1. Reads & renders videos dynamically from 'videos.json' (Easy to edit & add new videos)
 * 2. Entire website is fixed; mouse wheel anywhere scrolls videos up & down
 * 3. All visible scrollbars removed completely
 * 4. Infinite seamless auto-scroll with pause-on-hover & ON/OFF toggle
 * 5. In-card video autoplay timeline progress & cycling kinetic captions
 * 6. Interactive 3D polaroid tilt & one-click email copy with toast notification
 */

document.addEventListener('DOMContentLoaded', async () => {
  const reelsViewport = document.getElementById('reels-viewport');
  const reelsFeed = document.getElementById('reels-feed');
  const autoScrollBtn = document.getElementById('auto-scroll-btn');
  const autoScrollLabel = document.getElementById('auto-scroll-label');
  const speedButtons = document.querySelectorAll('.speed-btn');

  let videosData = [];
  let caseStudies = {};

  // ==========================================
  // 1. Load Videos from videos.json
  // ==========================================
  async function fetchVideos() {
    try {
      const res = await fetch(`videos.json?t=${Date.now()}`);
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      const data = await res.json();
      return data;
    } catch (err) {
      console.warn('Could not load videos.json directly (e.g. file:// protocol). Using default fallback data.', err);
      return null;
    }
  }

  // Fallback data if loaded directly via file:// without web server
  const DEFAULT_VIDEOS = [
    {
      id: "intro",
      title: "Mangal · Official Showreel",
      subtitle: "A my intro · Video Editor Portfolio",
      category: "viral founder",
      views: "3.5M views",
      coverImage: "assets/reel1-tigle.jpg",
      driveId: "1-gyjlMsl8qHIEFnuuiopyIv6Z70v09Xw",
      driveUrl: "https://drive.google.com/file/d/1-gyjlMsl8qHIEFnuuiopyIv6Z70v09Xw/preview",
      tags: ["Showreel", "Creator Edit", "Signature Style"],
      kineticCaptions: [
        "hey, mangal this side :)",
        "video editor & visual storyteller",
        "scroll down to watch my best work 🔥"
      ],
      hud: "kinetic",
      caseStudy: {
        badge: "Creator Showreel",
        metricsText: "⚡ 3.5M Views across client projects",
        hook: "High-energy pacing, custom sound design, and kinetic typography engineered to maintain watch-time above 85%.",
        outcome: "Helped 40+ founders and brands scale their short-form content pipeline from zero to millions of organic impressions.",
        m1: "3.5M",
        m1Label: "Total Views",
        m2: "89%",
        m2Label: "Watch-Through",
        m3: "24.5k",
        m3Label: "Shares & Saves"
      }
    },
    {
      id: "app-promo",
      title: "App Launch Promo · Mobile D2C",
      subtitle: "app promo · High-Conversion SaaS Reel",
      category: "brand viral",
      views: "1.8M views",
      coverImage: "assets/reel2-interview.jpg",
      driveId: "1lreUJjJQh33--whpcSnHXwY8JLp6Mj84",
      driveUrl: "https://drive.google.com/file/d/1lreUJjJQh33--whpcSnHXwY8JLp6Mj84/preview",
      tags: ["App Promo", "SaaS", "Motion Graphics"],
      kineticCaptions: [
        "the app that changed how founders work",
        "fast UI animations & sound design",
        "50,000+ downloads in 7 days 📱"
      ],
      hud: "camcorder",
      hudTimecode: "CAMERA PLAY ▶ 00:01:24",
      hudDate: "14.11.2026",
      caseStudy: {
        badge: "App Marketing",
        metricsText: "⚡ 1.8M Views · 50k App Installs",
        hook: "Punchy screen recordings paired with 3D device mockups and trending audio drops to showcase the product experience.",
        outcome: "Cut customer acquisition cost (CAC) by 45% compared to static ad creatives, driving 50k+ installs in week one.",
        m1: "1.8M",
        m1Label: "Total Views",
        m2: "50k+",
        m2Label: "Downloads",
        m3: "45%",
        m3Label: "CAC Drop"
      }
    },
    {
      id: "gym-deal",
      title: "Elite Fitness Brand Deal",
      subtitle: "final gym deal · Commercial Edit",
      category: "brand",
      views: "2.4M views",
      coverImage: "assets/reel1-tigle.jpg",
      driveId: "1lJ0lj5d0I3Rouwrgf34BDK8oYYWCBuhJ",
      driveUrl: "https://drive.google.com/file/d/1lJ0lj5d0I3Rouwrgf34BDK8oYYWCBuhJ/preview",
      tags: ["Commercial", "Fitness", "Color Grading"],
      kineticCaptions: [
        "crush your limits every single rep",
        "cinematic color grade & sound design",
        "viral athlete sponsorship campaign 💪"
      ],
      hud: "kinetic",
      caseStudy: {
        badge: "Brand Commercial",
        metricsText: "⚡ 2.4M Organic Views",
        hook: "Aggressive bass drops synchronized with heavy lifting reps and textured film grain to build raw athlete desire.",
        outcome: "Sold out the client's promotional gym membership package within 48 hours of launch.",
        m1: "2.4M",
        m1Label: "Views",
        m2: "94%",
        m2Label: "Retention",
        m3: "12.8k",
        m3Label: "Shares"
      }
    },
    {
      id: "gym-edit",
      title: "Raw Intensity · Gym Edit",
      subtitle: "gym edit · High-BPM Action Reel",
      category: "viral",
      views: "1.9M views",
      coverImage: "assets/reel2-interview.jpg",
      driveId: "1l2Q1XWiPVC12E0o813PRsgdMRMwvyymz",
      driveUrl: "https://drive.google.com/file/d/1l2Q1XWiPVC12E0o813PRsgdMRMwvyymz/preview",
      tags: ["Speed Ramps", "Sound FX", "Action"],
      kineticCaptions: [
        "train like an absolute beast",
        "seamless speed ramps & shake transitions",
        "over 15,000 saves on Instagram ⚡"
      ],
      hud: "camcorder",
      hudTimecode: "CAMERA PLAY ▶ 00:00:48",
      hudDate: "PUMP MODE",
      caseStudy: {
        badge: "Viral Fitness",
        metricsText: "🔥 1.9M Views · 15.4k Saves",
        hook: "Fast-twitch speed ramping timed down to milliseconds against heavy drill kicks.",
        outcome: "Became the client's top performing reel of the quarter, gaining 18k profile visits.",
        m1: "1.9M",
        m1Label: "Total Views",
        m2: "15.4k",
        m2Label: "Saves",
        m3: "91%",
        m3Label: "Watch-Through"
      }
    },
    {
      id: "trailer-intro",
      title: "Cinematic Film Hook · Trailer Intro",
      subtitle: "trailer intro · Hollywood Pacing",
      category: "founder viral",
      views: "3.1M views",
      coverImage: "",
      driveId: "1KUQHoNDCIvGyw1PQWB0QoAQKXYtrx9jC",
      driveUrl: "https://drive.google.com/file/d/1KUQHoNDCIvGyw1PQWB0QoAQKXYtrx9jC/preview",
      tags: ["Cinematic", "Film Hook", "Storytelling"],
      kineticCaptions: [
        "\"in a world of ordinary content...\"",
        "\"cinematic soundscapes & tension build\"",
        "\"watch till the very end 🎬\""
      ],
      hud: "hook",
      caseStudy: {
        badge: "Cinematic Trailer",
        metricsText: "⚡ 3.1M Views · 96% Retention",
        hook: "Epic orchestral riser build-up with a slow-burn reveal that pulls viewers past the 30-second mark.",
        outcome: "Generated over 35,000 shares across YouTube and Reels, driving record organic subscriber growth.",
        m1: "3.1M",
        m1Label: "Total Views",
        m2: "96%",
        m2Label: "Retention",
        m3: "35k+",
        m3Label: "Shares"
      }
    },
    {
      id: "riya-teaser",
      title: "Riya · Character Teaser",
      subtitle: "riya teaser · Narrative Visuals",
      category: "founder",
      views: "1.2M views",
      coverImage: "assets/reel2-interview.jpg",
      driveId: "1_kzos1xbXalSJ5PIA571UkZ4jI73HnkF",
      driveUrl: "https://drive.google.com/file/d/1_kzos1xbXalSJ5PIA571UkZ4jI73HnkF/preview",
      tags: ["Narrative", "Mood Cut", "Aesthetic"],
      kineticCaptions: [
        "a story that needed to be told",
        "moody visual grading & micro-cuts",
        "emotional connection that converts ✨"
      ],
      hud: "camcorder",
      hudTimecode: "CAMERA PLAY ▶ 00:02:04",
      hudDate: "CINEMA 24P",
      caseStudy: {
        badge: "Narrative Short",
        metricsText: "⚡ 1.2M Views · 8.9k Shares",
        hook: "Intimate dialogue cuts contrasting with grand cinematic vistas to craft deep viewer resonance.",
        outcome: "Gained 12,000 new targeted followers for the creator in under 5 days.",
        m1: "1.2M",
        m1Label: "Total Views",
        m2: "8.9k",
        m2Label: "Shares",
        m3: "87%",
        m3Label: "Avg Duration"
      }
    },
    {
      id: "futur",
      title: "Cyberpunk / Futuristic Edit",
      subtitle: "futur · 3D VFX & Motion Graphics",
      category: "viral brand",
      views: "2.7M views",
      coverImage: "",
      driveId: "1dBX768LlLyMptmdaBKvbBsFc6HFSvNBr",
      driveUrl: "https://drive.google.com/file/d/1dBX768LlLyMptmdaBKvbBsFc6HFSvNBr/preview",
      tags: ["Sci-Fi VFX", "Glitch Edit", "Visual Effects"],
      kineticCaptions: [
        "\"the future of visual content is here\"",
        "\"glitch transitions & neon aesthetics\"",
        "\"stop the scroll instantly 🤖\""
      ],
      hud: "chart",
      caseStudy: {
        badge: "VFX & Motion",
        metricsText: "⚡ 2.7M Views · 14.1k Saves",
        hook: "Neon glitch displacement maps and futuristic HUD overlays that command immediate thumb-stopping attention.",
        outcome: "Won Top Creative Edit at the creator visual sprint and featured on leading design curation pages.",
        m1: "2.7M",
        m1Label: "Total Views",
        m2: "14.1k",
        m2Label: "Saves",
        m3: "93%",
        m3Label: "Retention"
      }
    },
    {
      id: "digital-zilla",
      title: "Digital Zilla · Agency Brand Film",
      subtitle: "B digital zilla · Corporate Rebrand",
      category: "brand",
      views: "1.5M views",
      coverImage: "assets/reel1-tigle.jpg",
      driveId: "1DvSsUslG5qg__6VTHThAEpmxB-6dvWK8",
      driveUrl: "https://drive.google.com/file/d/1DvSsUslG5qg__6VTHThAEpmxB-6dvWK8/preview",
      tags: ["Corporate Film", "Rebrand", "B2B Story"],
      kineticCaptions: [
        "scaling brands through bold digital storytelling",
        "corporate film redefined for modern audiences",
        "over ₹1.2 Cr in pipeline generated 🚀"
      ],
      hud: "kinetic",
      caseStudy: {
        badge: "Agency Film",
        metricsText: "⚡ 1.5M Views · High B2B Conversion",
        hook: "Clean typographic kinetic openers paired with executive sound bites to transform traditional B2B communications.",
        outcome: "Directly supported landing 6 new enterprise accounts for the agency.",
        m1: "1.5M",
        m1Label: "Total Views",
        m2: "₹1.2Cr",
        m2Label: "Pipeline",
        m3: "85%",
        m3Label: "Watch-Through"
      }
    }
  ];

  // ==========================================
  // 2. Render Cards Dynamically from Data
  // ==========================================
  function createCardElement(video) {
    const article = document.createElement('article');
    article.className = 'reel-item';
    article.setAttribute('data-category', video.category || 'viral');
    article.setAttribute('data-reel-id', video.id);

    // Media element: Real video tag if videoUrl is set, or coverImage, or gradient
    let mediaHtml = '';
    if (video.videoUrl) {
      mediaHtml = `<video src="${video.videoUrl}" autoplay loop muted playsinline class="reel-cover"></video>`;
    } else if (video.coverImage) {
      mediaHtml = `<img src="${video.coverImage}" alt="${video.title}" class="reel-cover video-motion-kenburns">`;
    } else if (video.hud === 'chart') {
      mediaHtml = `
        <div class="placeholder-mockup-content">
          <div class="mockup-sparkle animate-spin-slow">✦</div>
          <div class="mockup-hook" id="caption-${video.id}">${video.kineticCaptions ? video.kineticCaptions[0] : video.title}</div>
          <div class="mockup-graph-preview">
            <span class="bar bar-1"></span>
            <span class="bar bar-2"></span>
            <span class="bar bar-3"></span>
            <span class="bar bar-4"></span>
          </div>
        </div>
      `;
    } else {
      mediaHtml = `
        <div class="hook-card-content">
          <div class="hook-badge-tag">${video.tags ? video.tags[0] : 'Viral Showcase'}</div>
          <div class="hook-quote" id="caption-${video.id}">${video.kineticCaptions ? video.kineticCaptions[0] : video.title}</div>
          <div class="hook-drop-indicator">
            <span>0-3s Hook</span>
            <div class="hook-arrow-down">↓ 88% Retention</div>
          </div>
        </div>
      `;
    }

    // HUD overlays
    let hudHtml = '';
    if (video.hud === 'camcorder') {
      hudHtml = `
        <div class="camcorder-hud">
          <div class="hud-top">
            <span class="rec-dot"></span>
            <span class="hud-text" id="camcorder-timecode-${video.id}">${video.hudTimecode || 'CAMERA PLAY ▶ 00:01:16'}</span>
          </div>
          <div class="hud-bottom">
            <span>${video.hudDate || '27.02.1997 TUE'}</span>
            <span class="hud-where" id="caption-${video.id}">${video.kineticCaptions ? video.kineticCaptions[0] : 'where'}</span>
          </div>
        </div>
      `;
    } else if (video.coverImage && video.kineticCaptions && video.kineticCaptions.length) {
      hudHtml = `
        <div class="reel-kinetic-caption" id="caption-${video.id}">
          <span class="caption-text kinetic-pop">${video.kineticCaptions[0]}</span>
        </div>
      `;
    }

    const tagsHtml = (video.tags || []).map(t => `<span class="tag">${t}</span>`).join('');
    const bgClass = (!video.coverImage && !video.videoUrl) ? (video.hud === 'chart' ? 'brand-placeholder-grad' : 'hook-card-grad') : '';

    article.innerHTML = `
      <div class="reel-preview-card">
        <div class="reel-video-container autoplay-active ${bgClass}">
          ${mediaHtml}
          <div class="reel-lighting-glow"></div>
          ${hudHtml}
          
          <div class="card-video-timeline">
            <div class="card-timeline-fill" id="timeline-${video.id}"></div>
          </div>

          <button class="play-btn" aria-label="Play Reel">
            <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
              <path d="M8 5v14l11-7z"/>
            </svg>
          </button>

          <div class="reel-tag-badge">
            <span class="live-dot pulse"></span>
            <span class="badge-text">${video.views || '1.5M views'}</span>
          </div>

          <div class="reel-sound-icon active" title="Sound preview available">
            <div class="mini-equalizer">
              <span></span><span></span><span></span>
            </div>
          </div>
        </div>

        <div class="reel-meta">
          <h3 class="reel-title">${video.title}</h3>
          <p class="reel-subtitle">${video.subtitle}</p>
          <div class="reel-tags">
            ${tagsHtml}
          </div>
        </div>
      </div>
    `;

    return article;
  }

  function renderFeed(videos) {
    if (!reelsFeed) return;
    reelsFeed.innerHTML = '';
    
    // Add all original video cards
    videos.forEach(v => {
      reelsFeed.appendChild(createCardElement(v));
    });

    // Clone cards for seamless infinite scroll loop
    videos.forEach(v => {
      const clone = createCardElement(v);
      clone.setAttribute('data-is-clone', 'true');
      reelsFeed.appendChild(clone);
    });
  }

  // Initialize Data
  const remoteVideos = await fetchVideos();
  videosData = (remoteVideos && remoteVideos.length) ? remoteVideos : DEFAULT_VIDEOS;

  // Build case studies lookup
  videosData.forEach(v => {
    caseStudies[v.id] = {
      title: v.title,
      subtitle: v.subtitle,
      badge: v.caseStudy?.badge || (v.tags ? v.tags[0] : 'Case Study'),
      metricsText: v.caseStudy?.metricsText || `⚡ ${v.views}`,
      img: v.coverImage || 'assets/reel1-tigle.jpg',
      driveId: v.driveId || '',
      driveUrl: v.driveUrl || '',
      hook: v.caseStudy?.hook || 'Tailored viral storytelling and hook optimization.',
      outcome: v.caseStudy?.outcome || `Generated ${v.views} across organic channels.`,
      m1: v.caseStudy?.m1 || v.views,
      m1Label: v.caseStudy?.m1Label || 'Total Views',
      m2: v.caseStudy?.m2 || '91%',
      m2Label: v.caseStudy?.m2Label || 'Retention',
      m3: v.caseStudy?.m3 || '10k+',
      m3Label: v.caseStudy?.m3Label || 'Shares'
    };
  });

  renderFeed(videosData);

  // ==========================================
  // 3. Full-Page Scroll Forwarding
  // (Website stays fixed; mouse wheel anywhere scrolls videos up/down)
  // ==========================================
  let autoScrollActive = true;
  let baseScrollSpeed = 0.85;
  let speedMultiplier = 1;
  let isUserHovering = false;
  let isUserScrolling = false;
  let userScrollTimeout = null;

  window.addEventListener('wheel', (e) => {
    // If a modal is currently open, do not override its scroll
    if (document.querySelector('.modal-backdrop.active')) return;

    if (reelsViewport) {
      reelsViewport.scrollTop += e.deltaY;

      // Handle seamless infinite loop wrap on manual scroll
      const halfHeight = reelsFeed.scrollHeight / 2;
      if (reelsViewport.scrollTop >= halfHeight) {
        reelsViewport.scrollTop -= halfHeight;
      } else if (reelsViewport.scrollTop <= 0) {
        reelsViewport.scrollTop += halfHeight;
      }

      // Temporarily pause auto-scroll during manual user scroll
      isUserScrolling = true;
      clearTimeout(userScrollTimeout);
      userScrollTimeout = setTimeout(() => {
        isUserScrolling = false;
      }, 1600);
    }
  }, { passive: true });

  // 60fps Smooth Auto-Scroll Loop
  function stepAutoScroll() {
    if (autoScrollActive && !isUserHovering && !isUserScrolling && reelsViewport && reelsFeed) {
      const delta = baseScrollSpeed * speedMultiplier;
      reelsViewport.scrollTop += delta;

      const halfHeight = reelsFeed.scrollHeight / 2;
      if (reelsViewport.scrollTop >= halfHeight) {
        reelsViewport.scrollTop -= halfHeight;
      }
    }
    requestAnimationFrame(stepAutoScroll);
  }
  requestAnimationFrame(stepAutoScroll);

  // Hover detection to pause on viewport
  if (reelsViewport) {
    reelsViewport.addEventListener('mouseenter', () => { isUserHovering = true; });
    reelsViewport.addEventListener('mouseleave', () => { isUserHovering = false; });

    // Touch events for mobile
    reelsViewport.addEventListener('touchstart', () => { isUserScrolling = true; }, { passive: true });
    reelsViewport.addEventListener('touchend', () => {
      clearTimeout(userScrollTimeout);
      userScrollTimeout = setTimeout(() => { isUserScrolling = false; }, 1800);
    });
  }

  // Toggle Auto-Scroll Button
  if (autoScrollBtn) {
    autoScrollBtn.addEventListener('click', () => {
      autoScrollActive = !autoScrollActive;
      if (autoScrollActive) {
        autoScrollBtn.classList.remove('paused');
        autoScrollBtn.classList.add('active');
        autoScrollLabel.textContent = 'Auto-scroll: ON';
        showToast('▶ Auto-scroll resumed');
      } else {
        autoScrollBtn.classList.add('paused');
        autoScrollBtn.classList.remove('active');
        autoScrollLabel.textContent = 'Auto-scroll: OFF';
        showToast('⏸ Auto-scroll paused');
      }
    });
  }

  // Speed Controls (1x, 2x)
  speedButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      speedButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      speedMultiplier = parseFloat(btn.getAttribute('data-speed')) || 1;
      showToast(`Speed set to ${btn.textContent}`);
    });
  });

  // ==========================================
  // 4. Video Autoplay Timelines & Kinetic Captions
  // ==========================================
  const progressMap = {};
  videosData.forEach((v, idx) => {
    progressMap[v.id] = {
      val: (idx * 25) % 100,
      speed: 0.3 + (idx * 0.05)
    };
  });

  setInterval(() => {
    Object.keys(progressMap).forEach(id => {
      const item = progressMap[id];
      item.val += item.speed;
      if (item.val > 100) item.val = 0;

      document.querySelectorAll(`#timeline-${id}`).forEach(bar => {
        bar.style.width = `${item.val}%`;
      });
    });
  }, 50);

  // Cycle Captions for each video that has kineticCaptions
  videosData.forEach(video => {
    if (video.kineticCaptions && video.kineticCaptions.length > 1) {
      let capIdx = 0;
      setInterval(() => {
        capIdx = (capIdx + 1) % video.kineticCaptions.length;
        document.querySelectorAll(`#caption-${video.id}`).forEach(el => {
          el.innerHTML = `<span class="caption-text kinetic-pop">${video.kineticCaptions[capIdx]}</span>`;
        });
      }, 2900 + (Math.random() * 600));
    }
  });

  // Real-time ticking timecode for camcorder HUDs
  let camTick = 76;
  setInterval(() => {
    camTick++;
    const m = Math.floor(camTick / 60).toString().padStart(2, '0');
    const s = (camTick % 60).toString().padStart(2, '0');
    document.querySelectorAll('[id^="camcorder-timecode-"]').forEach(el => {
      el.textContent = `CAMERA PLAY ▶ 00:${m}:${s}`;
    });
  }, 1000);

  // ==========================================
  // 5. Filter Chips
  // ==========================================
  const filterChips = document.querySelectorAll('.filter-chip');

  filterChips.forEach(chip => {
    chip.addEventListener('click', () => {
      filterChips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');

      const filter = chip.getAttribute('data-filter');
      const allCards = document.querySelectorAll('.reel-item');

      allCards.forEach(card => {
        const cat = card.getAttribute('data-category') || '';
        if (filter === 'all' || cat.includes(filter)) {
          card.style.display = 'block';
          card.style.opacity = '1';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // ==========================================
  // 6. Video Modal / Case Study Drawer
  // ==========================================
  const videoModal = document.getElementById('video-modal');
  const modalCloseBtn = document.getElementById('modal-close-btn');
  const modalImg = document.getElementById('modal-reel-img');
  const modalBadge = document.getElementById('modal-client-badge');
  const modalMetrics = document.getElementById('modal-metrics-text');
  const modalTitle = document.getElementById('modal-title');
  const modalSubtitle = document.getElementById('modal-subtitle');
  const modalHook = document.getElementById('modal-hook-text');
  const modalOutcome = document.getElementById('modal-outcome-text');
  const modalM1 = document.getElementById('modal-metric-1');
  const modalM2 = document.getElementById('modal-metric-2');
  const modalM3 = document.getElementById('modal-metric-3');

  const simPlayBtn = document.getElementById('sim-play-btn');
  const simPlayIcon = document.getElementById('sim-play-icon');
  const simProgressBar = document.getElementById('sim-progress-bar');
  const simTimeText = document.getElementById('sim-time-text');
  let isPlaying = true;
  let modalProgress = 35;
  let modalInterval = null;

  function startModalPlayback() {
    isPlaying = true;
    updateModalPlayIcon();
    if (modalInterval) clearInterval(modalInterval);
    modalInterval = setInterval(() => {
      if (!isPlaying) return;
      modalProgress += 0.8;
      if (modalProgress > 100) modalProgress = 0;
      simProgressBar.style.width = `${modalProgress}%`;
      const curSec = Math.floor((modalProgress / 100) * 42);
      simTimeText.textContent = `0:${curSec.toString().padStart(2, '0')} / 0:42`;
    }, 100);
  }

  function pauseModalPlayback() {
    isPlaying = false;
    updateModalPlayIcon();
    if (modalInterval) clearInterval(modalInterval);
  }

  function updateModalPlayIcon() {
    if (isPlaying) {
      simPlayIcon.innerHTML = '<path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>';
    } else {
      simPlayIcon.innerHTML = '<path d="M8 5v14l11-7z"/>';
    }
  }

  if (simPlayBtn) {
    simPlayBtn.addEventListener('click', () => {
      if (isPlaying) pauseModalPlayback();
      else startModalPlayback();
    });
  }

  // Delegated click listener on reelsFeed for both original and cloned cards
  if (reelsFeed) {
    reelsFeed.addEventListener('click', (e) => {
      const card = e.target.closest('.reel-item');
      if (!card) return;

      const reelId = card.getAttribute('data-reel-id');
      const data = caseStudies[reelId] || caseStudies.tiggle;

      modalTitle.textContent = data.title;
      modalSubtitle.textContent = data.subtitle;
      modalBadge.textContent = data.badge;
      modalMetrics.textContent = data.metricsText;
      modalHook.textContent = data.hook;
      modalOutcome.textContent = data.outcome;
      modalM1.textContent = data.m1;
      modalM2.textContent = data.m2;
      modalM3.textContent = data.m3;
      const modalScreen = document.getElementById('modal-screen');
      if (data.driveId && modalScreen) {
        modalScreen.innerHTML = `
          <iframe src="https://drive.google.com/file/d/${data.driveId}/preview" allow="autoplay; fullscreen" style="width: 100%; height: 100%; border: none; border-radius: 24px; position: absolute; inset: 0;" loading="lazy"></iframe>
        `;
      } else if (modalScreen) {
        modalScreen.innerHTML = `
          <img id="modal-reel-img" src="${data.img}" alt="Reel preview" style="width: 100%; height: 100%; object-fit: cover;">
          <div class="simulated-controls">
            <button class="sim-play-pause-btn" id="sim-play-btn">
              <svg id="sim-play-icon" viewBox="0 0 24 24" fill="currentColor" width="22" height="22">
                <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
              </svg>
            </button>
            <div class="sim-progress-track">
              <div class="sim-progress-fill" id="sim-progress-bar"></div>
            </div>
            <span class="sim-time" id="sim-time-text">0:14 / 0:42</span>
          </div>
          <div class="sound-wave-bars">
            <span></span><span></span><span></span><span></span>
          </div>
        `;
      }

      videoModal.classList.add('active');
      isUserHovering = true;
      modalProgress = 15;
      startModalPlayback();
    });
  }

  function closeModal(modal) {
    modal.classList.remove('active');
    isUserHovering = false;
    if (modalInterval) clearInterval(modalInterval);
  }

  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', () => closeModal(videoModal));
  }

  // ==========================================
  // 7. Agency Modal
  // ==========================================
  const agencyModal = document.getElementById('agency-modal');
  const openAgencyBtn = document.getElementById('open-agency-btn');
  const agencyCloseBtn = document.getElementById('agency-close-btn');
  const agencyContactBtn = document.getElementById('agency-contact-btn');

  if (openAgencyBtn) {
    openAgencyBtn.addEventListener('click', (e) => {
      e.preventDefault();
      agencyModal.classList.add('active');
      isUserHovering = true;
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
  // 8. Polaroid 3D Tilt & Easter Egg
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

  // ==========================================
  // 9. Email Copy Pill
  // ==========================================
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
