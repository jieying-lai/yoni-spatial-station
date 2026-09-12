/**
 * 迎屿 · Yoni | 空间治愈生活站主程序 (Spatial 3D World & Frosted Glass Life Station)
 */

document.addEventListener("DOMContentLoaded", () => {
  // =========================================================================
  // 1. 本地响应式数据状态 (State Management)
  // =========================================================================
  const defaultState = {
    user: {
      name: "April",
      birthday: "2000-09-06",
      theme: "theme-creamy-yellow",
      companion: "koala",
      streakDays: 5,
      totalFocusMinutes: 145,
      bloomedFlowersCount: 3,
      unlockedFlowers: {
        daisy: 2,
        tulip: 1,
        cactus: 1,
        succulent: 0,
        bellflower: 0,
        fern: 0
      }
    },
    plant: {
      level: 1,
      exp: 35,
      waterCount: 3,
      todayFocusMinutes: 45
    },
    expenses: [
      { id: 1, type: "expense", category: "餐饮美食", icon: "🍵", item: "焦糖热燕麦拿铁", amount: 26.00, remark: "早晨唤醒心流", time: "08:30" },
      { id: 2, type: "expense", category: "学习提升", icon: "📚", item: "自习备考真题集", amount: 48.50, remark: "下周考试加油", time: "14:15" },
      { id: 3, type: "income", category: "兼职收入", icon: "💼", item: "设计稿劳务费", amount: 600.00, remark: "努力的果实", time: "17:00" }
    ],
    journals: {
      "2026-09-05": {
        text: "傍晚微风吹过窗台，大树叶子沙沙作响。整理好了复习大纲，心情很踏实。",
        photo: null,
        moodLabel: "平静宁和",
        moodColor: "#DFF9FB",
        weather: "🌤️ 微风",
        summaryReply: "能踏实地走好每一步，就是最棒的充实感呀~",
        time: "昨日 21:30"
      },
      "2026-09-06": {
        text: "阳光洒进书桌，新添了垂耳兔和小狗玩偶，感觉被温柔包裹着。今天也要静心努力！",
        photo: null,
        moodLabel: "焦糖温甜",
        moodColor: "#FBE79E",
        weather: "☀️ 晴朗",
        summaryReply: "桌上的每个可爱摆件都在为你默默加油哦，深呼吸，慢慢来！",
        time: "今日 10:20"
      }
    },
    todos: [
      { id: 1, text: "整理下周二学校考试的重点笔记", done: false, timeTag: "下周二 18:00" },
      { id: 2, text: "给窗台的郁金香与雏菊浇温水", done: true, timeTag: "今日" },
      { id: 3, text: "午后专注 45 分钟完成数独微风关卡", done: false, timeTag: "下午" }
    ],
    room: {
      lampYellowOn: true,
      ceilingWhiteOn: true,
      skyMode: "afternoon",
      girlPose: "study" // 'study', 'bed', 'sleep', 'mirror'
    }
  };

  let state = defaultState;
  try {
    const saved = localStorage.getItem("yoni_spatial_state_v1");
    if (saved) {
      const parsed = JSON.parse(saved);
      state = Object.assign({}, defaultState, parsed);
      state.user = Object.assign({}, defaultState.user, parsed.user);
      state.plant = Object.assign({}, defaultState.plant, parsed.plant);
      state.room = Object.assign({}, defaultState.room, parsed.room);
    }
    if (state.user && state.user.name) {
      state.user.name = state.user.name.replace(/[🌸🌺🌼🌷🌻]/g, '').trim();
      if (!state.user.name) state.user.name = "April";
    }
  } catch (e) {
    console.warn("Storage parse error, fallback to default", e);
  }

  function saveState() {
    try {
      localStorage.setItem("yoni_spatial_state_v1", JSON.stringify(state));
    } catch (e) {}
  }

  // =========================================================================
  // 2. 主题系统 & 顶部时钟同步
  // =========================================================================
  function applyTheme(themeName) {
    document.body.className = themeName;
    document.querySelectorAll(".palette-dot").forEach(dot => {
      dot.classList.toggle("active", dot.dataset.theme === themeName);
    });
  }

  document.querySelectorAll(".palette-dot").forEach(dot => {
    dot.addEventListener("click", () => {
      const theme = dot.dataset.theme;
      state.user.theme = theme;
      saveState();
      applyTheme(theme);
    });
  });
  applyTheme(state.user.theme || "theme-creamy-yellow");

  // 顶部走字时钟与日期
  function updateLiveTimeHeader() {
    const now = new Date();
    const h = String(now.getHours()).padStart(2, '0');
    const m = String(now.getMinutes()).padStart(2, '0');
    const s = String(now.getSeconds()).padStart(2, '0');
    const timeStr = `${h}:${m}:${s}`;

    const liveTimeEl = document.getElementById("headerLiveTimeStr");
    if (liveTimeEl) liveTimeEl.textContent = timeStr;

    const hudTimeEl = document.getElementById("hudDigitalTime");
    if (hudTimeEl) hudTimeEl.textContent = timeStr;

    const turntableLed = document.getElementById("turntableLedTime");
    if (turntableLed) turntableLed.textContent = `${h}:${m}`;

    const weekDays = ["日", "一", "二", "三", "四", "五", "六"];
    const month = now.getMonth() + 1;
    const day = now.getDate();
    const dateStr = `${month}月${day}日 星期${weekDays[now.getDay()]}`;

    const dateEl = document.getElementById("currentDateStr");
    if (dateEl) dateEl.textContent = dateStr;

    const hudDateEl = document.getElementById("hudDigitalDate");
    if (hudDateEl) hudDateEl.textContent = `${now.getFullYear()}年${month}月${day}日 星期${weekDays[now.getDay()]}`;

    // 每日时光进度百分比
    const passedSeconds = now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();
    const percent = Math.round((passedSeconds / 86400) * 100);
    const dayProgPercent = document.getElementById("dayProgressPercent");
    if (dayProgPercent) dayProgPercent.textContent = `${percent}%`;
    const dayProgBar = document.getElementById("dayProgressBar");
    if (dayProgBar) dayProgBar.style.width = `${percent}%`;


  }
  setInterval(updateLiveTimeHeader, 1000);
  updateLiveTimeHeader();

  // 连续打卡与姓名
  const streakEl = document.getElementById("streakDaysCount");
  if (streakEl) streakEl.textContent = state.user.streakDays || 5;
  const nameLabel = document.getElementById("userNameLabel");
  if (nameLabel) nameLabel.textContent = state.user.name || "April";

  // =========================================================================
  // 3. 抽屉与弹窗开关系统 (Frosted Glass Drawer Manager)
  // =========================================================================
  const allDrawers = document.querySelectorAll(".frosted-glass-drawer");
  let activeDrawerId = null;

  function openDrawer(drawerId) {
    allDrawers.forEach(d => {
      if (d.id === drawerId) {
        d.classList.add("open");
        activeDrawerId = drawerId;
      } else {
        d.classList.remove("open");
      }
    });

    document.body.classList.add("drawer-open");

    if (drawerId === "modal-tablet-games") {
      setTimeout(initDoodleCanvas, 80);
      if (!isSudokuInited) initSudokuGame();
    }
    if (drawerId === "modal-scrapbook-journal") {
      renderScrapbookPage();
    }
    if (drawerId === "modal-shark-ledger") {
      renderSharkCategories();
      renderSharkExpenses();
    }
  }

  function closeDrawer(drawerId) {
    const d = document.getElementById(drawerId);
    if (d) d.classList.remove("open");
    if (activeDrawerId === drawerId) activeDrawerId = null;

    const anyOpen = Array.from(allDrawers).some(drawer => drawer.classList.contains("open"));
    if (!anyOpen) {
      document.body.classList.remove("drawer-open");
    }
  }

  // 绑定关闭按钮
  document.querySelectorAll(".drawer-close-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const target = btn.dataset.close;
      if (target) closeDrawer(target);
    });
  });

  // 键盘 ESC 快捷关闭抽屉
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && activeDrawerId) {
      closeDrawer(activeDrawerId);
    }
  });

  // 底部导览坞点击
  document.querySelectorAll(".dock-item-pill").forEach(pill => {
    pill.addEventListener("click", () => {
      const target = pill.dataset.target;
      if (activeDrawerId === target) {
        closeDrawer(target);
      } else {
        openDrawer(target);
      }
    });
  });

  // 顶部时钟打开 HUD
  const openClockHudBtn = document.getElementById("openClockHudBtn");
  if (openClockHudBtn) {
    openClockHudBtn.addEventListener("click", () => {
      openDrawer("modal-clock-hud");
    });
  }

  // =========================================================================
  // 视图模式管理：🖼️ 2D 插画模式 (默认) vs 🧊 3D 空间模式
  // =========================================================================
  const viewMode2dBtn = document.getElementById("viewMode2dBtn") || document.getElementById("viewModePhotoBtn");
  const viewMode3dBtn = document.getElementById("viewMode3dBtn");
  const spatialPhotoStage = document.getElementById("spatialPhotoStage");
  const spatial3dStage = document.getElementById("spatial3dStage");
  let currentViewMode = "2d";

  function setViewMode(mode) {
    currentViewMode = mode;
    if (mode === "2d" || mode === "photo") {
      if (spatialPhotoStage) spatialPhotoStage.style.display = "flex";
      if (spatial3dStage) spatial3dStage.style.display = "none";
      if (viewMode2dBtn) viewMode2dBtn.classList.add("active");
      if (viewMode3dBtn) viewMode3dBtn.classList.remove("active");
    } else {
      if (spatialPhotoStage) spatialPhotoStage.style.display = "none";
      if (spatial3dStage) spatial3dStage.style.display = "block";
      if (viewMode2dBtn) viewMode2dBtn.classList.remove("active");
      if (viewMode3dBtn) viewMode3dBtn.classList.add("active");
      // 触发一次 Three.js 尺寸校正
      setTimeout(() => {
        if (typeof onWindowResize === "function") onWindowResize();
      }, 60);
    }
  }

  if (viewMode2dBtn) {
    viewMode2dBtn.addEventListener("click", () => setViewMode("2d"));
  }
  if (viewMode3dBtn) {
    viewMode3dBtn.addEventListener("click", () => setViewMode("3d"));
  }
  // 默认使用 2D 模式
  setViewMode("2d");

  // 统一热区动作执行器 (支持抽屉开关、台灯切换、问候互动)
  function handleHotspotAction(target, action) {
    if (target) {
      if (activeDrawerId === target) {
        closeDrawer(target);
      } else {
        openDrawer(target);
      }
    } else if (action === "toggle-lamp") {
      state.room.lampYellowOn = !state.room.lampYellowOn;
      const overlay = document.getElementById("lampGlowOverlay");
      if (overlay) overlay.classList.toggle("off", !state.room.lampYellowOn);
      const lampBtn = document.getElementById("toggleLampLightBtn");
      if (lampBtn) lampBtn.classList.toggle("active", state.room.lampYellowOn);
      if (typeof rilakkumaLampLight !== "undefined" && rilakkumaLampLight) {
        rilakkumaLampLight.visible = state.room.lampYellowOn;
      }
      showNotificationToast(state.room.lampYellowOn ? "已开启暖黄台灯 💡" : "已关闭台灯");
      saveState();
    } else if (action === "girl-greet") {
      showNotificationToast("April 正在温润的书桌前专注自习呢～ ✨");
    }
  }

  // 绑定原生热区按钮点击与悬浮气泡
  document.querySelectorAll(".room-hotspot, .photo-hotspot").forEach(spot => {
    spot.addEventListener("mouseenter", (e) => {
      const label = spot.dataset.label;
      const tooltip = document.getElementById("roomObjectTooltip");
      const tooltipText = document.getElementById("tooltipText");
      if (label && tooltip && tooltipText) {
        tooltipText.textContent = label;
        tooltip.style.left = `${e.clientX}px`;
        tooltip.style.top = `${e.clientY}px`;
        tooltip.style.display = "flex";
      }
    });

    spot.addEventListener("mousemove", (e) => {
      const tooltip = document.getElementById("roomObjectTooltip");
      if (tooltip) {
        tooltip.style.left = `${e.clientX}px`;
        tooltip.style.top = `${e.clientY}px`;
      }
    });

    spot.addEventListener("mouseleave", () => {
      const tooltip = document.getElementById("roomObjectTooltip");
      if (tooltip) tooltip.style.display = "none";
    });

    spot.addEventListener("click", (e) => {
      e.stopPropagation();
      const target = spot.dataset.target;
      const action = spot.dataset.action;
      handleHotspotAction(target, action);
    });
  });

  // 坐标保底点击监听：点击 2D 插画任何区域均可精准触发对应功能
  const cozyPhotoFrame = document.getElementById("cozyPhotoFrame");
  if (cozyPhotoFrame) {
    cozyPhotoFrame.addEventListener("click", (e) => {
      if (e.target.closest(".room-hotspot, .photo-hotspot")) return;
      const rect = cozyPhotoFrame.getBoundingClientRect();
      const xPct = ((e.clientX - rect.left) / rect.width) * 100;
      const yPct = ((e.clientY - rect.top) / rect.height) * 100;

      // 💻 电脑屏幕 / iMac (数独 / 涂鸦)
      if (xPct >= 23 && xPct <= 41 && yPct >= 54 && yPct <= 80) {
        handleHotspotAction("modal-tablet-games", null);
      }
      // 💡 暖心台灯 (开关)
      else if (xPct >= 34 && xPct <= 46 && yPct >= 52 && yPct <= 76) {
        handleHotspotAction(null, "toggle-lamp");
      }
      // 🕒 墙上圆形挂钟 (时钟)
      else if (xPct >= 38 && xPct <= 50 && yPct >= 34 && yPct <= 50) {
        handleHotspotAction("modal-clock-hud", null);
      }
      // 🪴 窗台与花盆 (专注番茄钟)
      else if (xPct >= 47 && xPct <= 68 && yPct >= 45 && yPct <= 78) {
        handleHotspotAction("modal-pomodoro-garden", null);
      }
      // 📻 复古黑胶机 (音乐)
      else if (xPct >= 54 && xPct <= 70 && yPct >= 74 && yPct <= 94) {
        handleHotspotAction("modal-music-spotify", null);
      }
      // ☕ 咖啡杯 (记账)
      else if (xPct >= 20 && xPct <= 30 && yPct >= 74 && yPct <= 88) {
        handleHotspotAction("modal-shark-ledger", null);
      }
      // 📖 桌面手账 (日记)
      else if (xPct >= 29 && xPct <= 42 && yPct >= 75 && yPct <= 88) {
        handleHotspotAction("modal-scrapbook-journal", null);
      }
      // 👧 女生形象 April
      else if (xPct >= 39 && xPct <= 56 && yPct >= 68 && yPct <= 95) {
        handleHotspotAction(null, "girl-greet");
      }
      // 🧸 玩偶收纳架 (粉色企鹅/萌宠伙伴)
      else if (xPct >= 17 && xPct <= 39 && yPct >= 35 && yPct <= 56) {
        const modal = document.getElementById("animalPickerModal");
        if (modal) modal.classList.add("open");
      }
    });
  }

  // =========================================================================
  // 4. 音频系统 (Lofi, Jazz, 雨声, 壁炉柴火, Spotify)
  // =========================================================================
  const AmbientAudio = {
    ctx: null,
    rainNode: null,
    fireNode: null,
    musicTimer: null,
    currentTrack: null, // 'lofi', 'jazz', null
    isRainOn: false,
    isFireOn: false,

    getCtx() {
      if (!this.ctx) {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        this.ctx = new AudioCtx();
      }
      if (this.ctx.state === "suspended") {
        this.ctx.resume();
      }
      return this.ctx;
    },

    playLofi() {
      const ctx = this.getCtx();
      if (this.currentTrack === "lofi") {
        this.stopMusic();
        return false;
      }
      this.stopMusic();
      this.currentTrack = "lofi";

      const chords = [
        [261.63, 329.63, 392.00, 493.88], // Cmaj7
        [220.00, 261.63, 329.63, 392.00], // Am7
        [293.66, 349.23, 440.00, 523.25], // Dm7
        [196.00, 246.94, 293.66, 349.23], // G7
        [349.23, 440.00, 523.25, 659.25]  // Fmaj7
      ];
      let idx = 0;

      const loop = () => {
        if (this.currentTrack !== "lofi") return;
        const c = chords[idx % chords.length];
        idx++;
        c.forEach((freq, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = "sine";
          osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.05);

          gain.gain.setValueAtTime(0.001, ctx.currentTime);
          gain.gain.linearRampToValueAtTime(0.045, ctx.currentTime + i * 0.05 + 0.2);
          gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 3.5);

          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(ctx.currentTime + i * 0.05);
          osc.stop(ctx.currentTime + 3.6);
        });
        this.musicTimer = setTimeout(loop, 3600);
      };
      loop();
      return true;
    },

    playJazz() {
      const ctx = this.getCtx();
      if (this.currentTrack === "jazz") {
        this.stopMusic();
        return false;
      }
      this.stopMusic();
      this.currentTrack = "jazz";

      // 温暖爵士和弦走向 (Dm9 -> G13 -> Cmaj9 -> A7b13)
      const jazzChords = [
        [293.66, 349.23, 440.00, 523.25, 659.25],
        [196.00, 246.94, 329.63, 440.00, 587.33],
        [261.63, 329.63, 392.00, 493.88, 587.33],
        [220.00, 277.18, 329.63, 415.30, 523.25]
      ];
      let idx = 0;

      const loop = () => {
        if (this.currentTrack !== "jazz") return;
        const c = jazzChords[idx % jazzChords.length];
        idx++;
        c.forEach((freq, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = "triangle";
          osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.08);

          gain.gain.setValueAtTime(0.001, ctx.currentTime);
          gain.gain.linearRampToValueAtTime(0.038, ctx.currentTime + i * 0.08 + 0.25);
          gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 4.2);

          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(ctx.currentTime + i * 0.08);
          osc.stop(ctx.currentTime + 4.4);
        });
        this.musicTimer = setTimeout(loop, 4400);
      };
      loop();
      return true;
    },

    stopMusic() {
      this.currentTrack = null;
      if (this.musicTimer) clearTimeout(this.musicTimer);
    },

    toggleRain() {
      const ctx = this.getCtx();
      if (!this.isRainOn) {
        const bufferSize = ctx.sampleRate * 2;
        const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        let b0 = 0, b1 = 0, b2 = 0;
        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          b0 = 0.99 * b0 + white * 0.05;
          b1 = 0.95 * b1 + white * 0.1;
          b2 = 0.85 * b2 + white * 0.25;
          output[i] = (b0 + b1 + b2) * 0.12;
        }

        const rainSource = ctx.createBufferSource();
        rainSource.buffer = noiseBuffer;
        rainSource.loop = true;

        const filter = ctx.createBiquadFilter();
        filter.type = "lowpass";
        filter.frequency.setValueAtTime(800, ctx.currentTime);

        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0.01, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.28, ctx.currentTime + 1.0);

        rainSource.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);
        rainSource.start();

        this.rainNode = { source: rainSource, gain: gain };
        this.isRainOn = true;
        return true;
      } else {
        if (this.rainNode) {
          try {
            this.rainNode.gain.gain.linearRampToValueAtTime(0.001, ctx.currentTime + 0.5);
            setTimeout(() => { try { this.rainNode.source.stop(); } catch(e){} }, 550);
          } catch(e){}
        }
        this.isRainOn = false;
        return false;
      }
    },

    toggleFire() {
      const ctx = this.getCtx();
      if (!this.isFireOn) {
        const bufferSize = ctx.sampleRate * 2;
        const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          const crackle = Math.random() < 0.003 ? (Math.random() * 2 - 1) * 2.8 : (Math.random() * 2 - 1) * 0.1;
          output[i] = crackle;
        }
        const fireSource = ctx.createBufferSource();
        fireSource.buffer = noiseBuffer;
        fireSource.loop = true;

        const filter = ctx.createBiquadFilter();
        filter.type = "bandpass";
        filter.frequency.setValueAtTime(1100, ctx.currentTime);
        filter.Q.setValueAtTime(1.5, ctx.currentTime);

        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0.01, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.22, ctx.currentTime + 1.0);

        fireSource.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);
        fireSource.start();

        this.fireNode = { source: fireSource, gain: gain };
        this.isFireOn = true;
        return true;
      } else {
        if (this.fireNode) {
          try {
            this.fireNode.gain.gain.linearRampToValueAtTime(0.001, ctx.currentTime + 0.5);
            setTimeout(() => { try { this.fireNode.source.stop(); } catch(e){} }, 550);
          } catch(e){}
        }
        this.isFireOn = false;
        return false;
      }
    }
  };

  // 绑定黑胶机界面的音效开关
  const playMusicBtn = document.getElementById("playMusicBtn");
  const playJazzBtn = document.getElementById("playJazzBtn");
  const rainSoundBtn = document.getElementById("rainSoundBtn");
  const fireSoundBtn = document.getElementById("fireSoundBtn");
  const modalVinylDisc = document.getElementById("modalVinylDisc");

  function setDiscSpinning(isPlaying) {
    if (modalVinylDisc) {
      modalVinylDisc.classList.toggle("playing", isPlaying);
    }
    const tonearm = document.querySelector(".tonearm-assembly");
    if (tonearm) {
      tonearm.classList.toggle("playing", isPlaying);
    }
  }

  if (playMusicBtn) {
    playMusicBtn.addEventListener("click", () => {
      const on = AmbientAudio.playLofi();
      playMusicBtn.classList.toggle("active", on);
      if (playJazzBtn) playJazzBtn.classList.remove("active");
      setDiscSpinning(on);
    });
  }

  if (playJazzBtn) {
    playJazzBtn.addEventListener("click", () => {
      const on = AmbientAudio.playJazz();
      playJazzBtn.classList.toggle("active", on);
      if (playMusicBtn) playMusicBtn.classList.remove("active");
      setDiscSpinning(on);
    });
  }

  if (rainSoundBtn) {
    rainSoundBtn.addEventListener("click", () => {
      const on = AmbientAudio.toggleRain();
      rainSoundBtn.classList.toggle("active", on);
    });
  }

  if (fireSoundBtn) {
    fireSoundBtn.addEventListener("click", () => {
      const on = AmbientAudio.toggleFire();
      fireSoundBtn.classList.toggle("active", on);
    });
  }

  // =========================================================================
  // 5. 3D 治愈书房核心引擎 (Three.js Spatial Engine)
  // =========================================================================
  const canvas = document.getElementById("webglRoomCanvas");
  const viewportContainer = document.getElementById("spatialViewportContainer");

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0xF5ECE1);

  const width = viewportContainer.clientWidth || window.innerWidth;
  const height = viewportContainer.clientHeight || window.innerHeight;
  const aspect = width / height;

  const d = 6.4;
  const camera = new THREE.OrthographicCamera(-d * aspect, d * aspect, d, -d, 1, 1000);

  let cameraAngleX = 0.785;
  let cameraAngleY = 0.56;
  let cameraDistance = 22;

  function updateCamera() {
    camera.position.x = cameraDistance * Math.sin(cameraAngleX) * Math.cos(cameraAngleY);
    camera.position.y = cameraDistance * Math.sin(cameraAngleY) + 3.2;
    camera.position.z = cameraDistance * Math.cos(cameraAngleX) * Math.cos(cameraAngleY);
    camera.lookAt(0, 2.2, 0);
  }
  updateCamera();

  const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.1;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.outputEncoding = THREE.sRGBEncoding;

  // 柔和光影体系
  const ambientWarmLight = new THREE.AmbientLight(0xFFF7EE, 0.95);
  scene.add(ambientWarmLight);

  const sunLight = new THREE.DirectionalLight(0xFFE8D0, 1.35);
  sunLight.position.set(7, 13, -7);
  sunLight.castShadow = true;
  sunLight.shadow.mapSize.width = 2048;
  sunLight.shadow.mapSize.height = 2048;
  sunLight.shadow.camera.near = 0.5;
  sunLight.shadow.camera.far = 35;
  sunLight.shadow.camera.left = -7.5;
  sunLight.shadow.camera.right = 7.5;
  sunLight.shadow.camera.top = 7.5;
  sunLight.shadow.camera.bottom = -7.5;
  sunLight.shadow.bias = -0.0002;
  sunLight.shadow.normalBias = 0.03;
  sunLight.shadow.radius = 2.5;
  scene.add(sunLight);

  const ceilingWhiteLight = new THREE.DirectionalLight(0xFFFFFF, 0.35);
  ceilingWhiteLight.position.set(-6, 12, 8);
  scene.add(ceilingWhiteLight);

  const rilakkumaLampLight = new THREE.PointLight(0xFFA834, 1.25, 7.5, 1.6);
  rilakkumaLampLight.position.set(-1.8, 3.2, -1.8);
  rilakkumaLampLight.castShadow = true;
  scene.add(rilakkumaLampLight);

  // 灯光控制
  const toggleLampLightBtn = document.getElementById("toggleLampLightBtn");
  const toggleCeilingLightBtn = document.getElementById("toggleCeilingLightBtn");

  function updateLampState() {
    if (rilakkumaLampLight) rilakkumaLampLight.visible = state.room.lampYellowOn;
    const overlay = document.getElementById("lampGlowOverlay");
    if (overlay) overlay.classList.toggle("off", !state.room.lampYellowOn);
    if (toggleLampLightBtn) toggleLampLightBtn.classList.toggle("active", state.room.lampYellowOn);
  }
  updateLampState();

  if (toggleLampLightBtn) {
    toggleLampLightBtn.addEventListener("click", () => {
      state.room.lampYellowOn = !state.room.lampYellowOn;
      updateLampState();
      saveState();
    });
  }

  if (toggleCeilingLightBtn) {
    toggleCeilingLightBtn.addEventListener("click", () => {
      state.room.ceilingWhiteOn = !state.room.ceilingWhiteOn;
      ceilingWhiteLight.intensity = state.room.ceilingWhiteOn ? 0.35 : 0.08;
      ambientWarmLight.intensity = state.room.ceilingWhiteOn ? 0.95 : 0.45;
      toggleCeilingLightBtn.classList.toggle("active", state.room.ceilingWhiteOn);
      saveState();
    });
  }

  // 材质库
  const mats = {
    basePlinth: new THREE.MeshStandardMaterial({ color: 0xF7F2EB, roughness: 0.8, metalness: 0.05 }),
    floorWood: new THREE.MeshStandardMaterial({ color: 0xEEBA7B, roughness: 0.55, metalness: 0.06 }),
    floorLine: new THREE.MeshBasicMaterial({ color: 0xDDA464 }),
    wallCream: new THREE.MeshStandardMaterial({ color: 0xFCF8F2, roughness: 0.85, metalness: 0.02 }),
    wallTrim: new THREE.MeshStandardMaterial({ color: 0xECE2D3, roughness: 0.75, metalness: 0.05 }),
    baseboard: new THREE.MeshStandardMaterial({ color: 0xD4B086, roughness: 0.7, metalness: 0.05 }),
    windowWood: new THREE.MeshStandardMaterial({ color: 0xC8935D, roughness: 0.65, metalness: 0.05 }),
    sunGlow: new THREE.MeshBasicMaterial({ color: 0xFFD885 }),
    curtainSheer: new THREE.MeshStandardMaterial({ color: 0xFFFFFF, roughness: 0.9, transparent: true, opacity: 0.85 }),
    whiteClean: new THREE.MeshStandardMaterial({ color: 0xFFFFFF, roughness: 0.7, metalness: 0.02 }),
    woodLight: new THREE.MeshStandardMaterial({ color: 0xF3DFC7, roughness: 0.65, metalness: 0.05 }),
    woodWarm: new THREE.MeshStandardMaterial({ color: 0xB58253, roughness: 0.7, metalness: 0.05 }),
    bedBlue: new THREE.MeshStandardMaterial({ color: 0xA3D6F5, roughness: 0.75, metalness: 0.02 }),
    pillowMint: new THREE.MeshStandardMaterial({ color: 0xA2D7BA, roughness: 0.8, metalness: 0.02 }),
    pillowBlue: new THREE.MeshStandardMaterial({ color: 0x98CEEE, roughness: 0.8, metalness: 0.02 }),
    pillowCream: new THREE.MeshStandardMaterial({ color: 0xFDF4E5, roughness: 0.85, metalness: 0.02 }),
    rugPurple: new THREE.MeshStandardMaterial({ color: 0xC6B5E2, roughness: 0.95, metalness: 0.0 }),
    chairCushion: new THREE.MeshStandardMaterial({ color: 0xD2965E, roughness: 0.9, metalness: 0.02 }),
    rilakkumaMuzzle: new THREE.MeshStandardMaterial({ color: 0xFFF7EC, roughness: 0.85, metalness: 0.02 }),
    metalChrome: new THREE.MeshStandardMaterial({ color: 0xCCCCCC, roughness: 0.2, metalness: 0.9 }),
    metalBlack: new THREE.MeshStandardMaterial({ color: 0x2A2A2A, roughness: 0.4, metalness: 0.4 }),
    screenGlow: new THREE.MeshBasicMaterial({ color: 0x5C80BC }),
    goldMetal: new THREE.MeshStandardMaterial({ color: 0xF5BA42, roughness: 0.3, metalness: 0.7 }),
    clayPot: new THREE.MeshStandardMaterial({ color: 0xE59772, roughness: 0.75, metalness: 0.05 }),
    plantGreen: new THREE.MeshStandardMaterial({ color: 0x6DBF65, roughness: 0.7, metalness: 0.05 }),
    flowerPink: new THREE.MeshStandardMaterial({ color: 0xF7B3C6, roughness: 0.6, metalness: 0.05 }),
    flowerYellow: new THREE.MeshStandardMaterial({ color: 0xFDD843, roughness: 0.6, metalness: 0.05 }),
    plushPuppyBrown: new THREE.MeshStandardMaterial({ color: 0xC68648, roughness: 0.9, metalness: 0.0 }),
    plushBunnyBeige: new THREE.MeshStandardMaterial({ color: 0xEFE5D4, roughness: 0.9, metalness: 0.0 }),
    clayGirlSkin: new THREE.MeshStandardMaterial({ color: 0xFDE7D6, roughness: 0.65, metalness: 0.02 }),
    clayGirlHair: new THREE.MeshStandardMaterial({ color: 0x563826, roughness: 0.7, metalness: 0.05 }),
    clayGirlTee: new THREE.MeshStandardMaterial({ color: 0xFFFAF5, roughness: 0.8, metalness: 0.02 }),
    clayGirlShorts: new THREE.MeshStandardMaterial({ color: 0xD8CAEB, roughness: 0.8, metalness: 0.02 }),
    turntablePink: new THREE.MeshStandardMaterial({ color: 0xF8B6A2, roughness: 0.5, metalness: 0.05 }),
    vinylBlack: new THREE.MeshStandardMaterial({ color: 0x1A1A1A, roughness: 0.3, metalness: 0.6 })
  };

  // -------------------------------------------------------------------------
  // 5.1 紧凑饱满的微缩手办盒 (8.8x8.8)
  // -------------------------------------------------------------------------
  const roomGroup = new THREE.Group();
  scene.add(roomGroup);

  // 1) 实体白奶油厚底座
  const plinthBase = new THREE.Mesh(new THREE.BoxGeometry(9.4, 0.45, 9.4), mats.basePlinth);
  plinthBase.position.y = -0.225;
  plinthBase.receiveShadow = true;
  roomGroup.add(plinthBase);

  // 2) 拼木实木地板 (木板条纹单向平行铺设，非卫生间方块瓷砖)
  const floorMesh = new THREE.Mesh(new THREE.BoxGeometry(9.0, 0.1, 9.0), mats.floorWood);
  floorMesh.position.y = 0.05;
  floorMesh.receiveShadow = true;
  roomGroup.add(floorMesh);

  // 木板平行拼接缝 (平行于 Z 轴)
  const floorGrooves = new THREE.Group();
  for (let i = -3.6; i <= 3.6; i += 1.2) {
    const plankSeam = new THREE.Mesh(new THREE.PlaneGeometry(0.02, 8.9), mats.floorLine);
    plankSeam.rotation.x = -Math.PI / 2;
    plankSeam.position.set(i, 0.105, 0);
    floorGrooves.add(plankSeam);
  }
  roomGroup.add(floorGrooves);

  // 3) 后墙 (Back Wall)
  const backWall = new THREE.Mesh(new THREE.BoxGeometry(9.0, 6.8, 0.4), mats.wallCream);
  backWall.position.set(0, 3.4, -4.5);
  backWall.receiveShadow = true;
  roomGroup.add(backWall);

  const backCrown = new THREE.Mesh(new THREE.BoxGeometry(9.4, 0.35, 0.6), mats.wallTrim);
  backCrown.position.set(0, 6.8, -4.5);
  backCrown.castShadow = true;
  roomGroup.add(backCrown);

  const backBaseboard = new THREE.Mesh(new THREE.BoxGeometry(9.0, 0.3, 0.08), mats.baseboard);
  backBaseboard.position.set(0, 0.25, -4.26);
  roomGroup.add(backBaseboard);

  // 4) 左墙 (Left Wall)
  const leftWall = new THREE.Mesh(new THREE.BoxGeometry(0.4, 6.8, 9.0), mats.wallCream);
  leftWall.position.set(-4.5, 3.4, 0);
  leftWall.receiveShadow = true;
  roomGroup.add(leftWall);

  const leftCrown = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.35, 9.4), mats.wallTrim);
  leftCrown.position.set(-4.5, 6.8, 0);
  leftCrown.castShadow = true;
  roomGroup.add(leftCrown);

  const leftBaseboard = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.3, 9.0), mats.baseboard);
  leftBaseboard.position.set(-4.26, 0.25, 0);
  roomGroup.add(leftBaseboard);

  // -------------------------------------------------------------------------
  // 5.2 优雅实木暖阳大窗 (拱形暖木窗格，柔美自然)
  // -------------------------------------------------------------------------
  const windowGroup = new THREE.Group();
  windowGroup.position.set(1.8, 3.9, -4.28);

  // 窗户外木框
  const winOuterFrame = new THREE.Mesh(new THREE.BoxGeometry(3.2, 3.4, 0.15), mats.windowWood);
  const winInnerGlass = new THREE.Mesh(new THREE.PlaneGeometry(2.8, 3.0), mats.sunGlow);
  winInnerGlass.position.z = 0.02;
  windowGroup.add(winOuterFrame, winInnerGlass);

  // 细实木十字窗格
  const winCrossH = new THREE.Mesh(new THREE.BoxGeometry(2.8, 0.08, 0.08), mats.windowWood);
  winCrossH.position.z = 0.05;
  const winCrossV = new THREE.Mesh(new THREE.BoxGeometry(0.08, 3.0, 0.08), mats.windowWood);
  winCrossV.position.z = 0.05;
  windowGroup.add(winCrossH, winCrossV);

  // 飘逸白色窗帘
  const curL = new THREE.Mesh(new THREE.BoxGeometry(0.55, 3.2, 0.1), mats.curtainSheer);
  curL.position.set(-1.3, 0, 0.1);
  const curR = new THREE.Mesh(new THREE.BoxGeometry(0.55, 3.2, 0.1), mats.curtainSheer);
  curR.position.set(1.3, 0, 0.1);
  windowGroup.add(curL, curR);

  // 睡眠时的遮光窗帘
  const sleepCurtain = new THREE.Mesh(new THREE.PlaneGeometry(2.85, 3.05), new THREE.MeshStandardMaterial({ color: 0xFDF8EE, roughness: 0.9 }));
  sleepCurtain.position.z = 0.08;
  sleepCurtain.visible = false;
  windowGroup.add(sleepCurtain);

  roomGroup.add(windowGroup);

  // -------------------------------------------------------------------------
  // 5.3 温馨浅蓝大床组 (比例饱满温馨)
  // -------------------------------------------------------------------------
  const bedGroup = new THREE.Group();
  bedGroup.position.set(1.8, 0, -2.0);

  const bedBase = new THREE.Mesh(new THREE.BoxGeometry(3.6, 0.5, 4.4), mats.whiteClean);
  bedBase.position.y = 0.35;
  bedBase.castShadow = true;
  bedBase.receiveShadow = true;
  bedGroup.add(bedBase);

  const mattress = new THREE.Mesh(new THREE.BoxGeometry(3.4, 0.5, 4.2), mats.whiteClean);
  mattress.position.y = 0.8;
  mattress.receiveShadow = true;
  bedGroup.add(mattress);

  // 浅粉蓝羽绒被
  const duvet = new THREE.Mesh(new THREE.BoxGeometry(3.45, 0.3, 2.8), mats.bedBlue);
  duvet.position.set(0, 1.05, 0.6);
  duvet.castShadow = true;
  bedGroup.add(duvet);

  const duvetFold = new THREE.Mesh(new THREE.BoxGeometry(3.46, 0.31, 0.7), mats.whiteClean);
  duvetFold.position.set(0, 1.06, -0.9);
  bedGroup.add(duvetFold);

  // 蓬松双枕
  const pillow1 = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.28, 0.9), mats.pillowBlue);
  pillow1.position.set(-0.8, 1.05, -1.5);
  pillow1.rotation.x = 0.15;
  const pillow2 = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.28, 0.9), mats.pillowMint);
  pillow2.position.set(0.8, 1.05, -1.5);
  pillow2.rotation.x = 0.15;
  bedGroup.add(pillow1, pillow2);

  // 🐶 床上玩偶 1：下垂耳小狗
  const puppyDoll = new THREE.Group();
  puppyDoll.position.set(-0.8, 1.15, -0.4);
  const puppyBody = new THREE.Mesh(new THREE.SphereGeometry(0.35, 16, 16), mats.whiteClean);
  const puppyHead = new THREE.Mesh(new THREE.SphereGeometry(0.32, 16, 16), mats.plushPuppyBrown);
  puppyHead.position.set(0, 0.18, 0.05);
  puppyHead.scale.set(1.02, 0.7, 0.95);
  const earL = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.45, 0.25), mats.plushPuppyBrown);
  earL.position.set(-0.35, 0.15, 0);
  earL.rotation.z = 0.3;
  const earR = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.45, 0.25), mats.plushPuppyBrown);
  earR.position.set(0.35, 0.15, 0);
  earR.rotation.z = -0.3;
  puppyDoll.add(puppyBody, puppyHead, earL, earR);
  bedGroup.add(puppyDoll);

  // 🐰 床上玩偶 2：长耳垂耳兔
  const bunnyDoll = new THREE.Group();
  bunnyDoll.position.set(0.7, 1.15, -0.4);
  const bunnyBody = new THREE.Mesh(new THREE.SphereGeometry(0.32, 16, 16), mats.plushBunnyBeige);
  const bEarL = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.55, 0.2), mats.plushBunnyBeige);
  bEarL.position.set(-0.25, 0.1, 0.05);
  bEarL.rotation.z = 0.2;
  const bEarR = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.55, 0.2), mats.plushBunnyBeige);
  bEarR.position.set(0.25, 0.1, 0.05);
  bEarR.rotation.z = -0.2;
  bunnyDoll.add(bunnyBody, bEarL, bEarR);
  bedGroup.add(bunnyDoll);

  roomGroup.add(bedGroup);

  // 白色双层床头柜
  const nightstandGroup = new THREE.Group();
  nightstandGroup.position.set(3.8, 0, 1.2);
  const nsBase = new THREE.Mesh(new THREE.BoxGeometry(1.0, 1.4, 1.4), mats.whiteClean);
  nsBase.position.y = 0.7;
  nsBase.castShadow = true;
  nightstandGroup.add(nsBase);
  roomGroup.add(nightstandGroup);

  // -------------------------------------------------------------------------
  // 5.4 书桌、椅子与紫色圆地毯
  // -------------------------------------------------------------------------
  const rugPurple = new THREE.Mesh(new THREE.CylinderGeometry(2.0, 2.1, 0.04, 32), mats.rugPurple);
  rugPurple.position.set(-0.8, 0.12, 0.6);
  rugPurple.receiveShadow = true;
  roomGroup.add(rugPurple);

  const deskGroup = new THREE.Group();
  deskGroup.position.set(-2.4, 0, -1.8);

  const deskTop = new THREE.Mesh(new THREE.BoxGeometry(3.6, 0.18, 2.2), mats.whiteClean);
  deskTop.position.set(0, 2.2, 0);
  deskTop.castShadow = true;
  deskTop.receiveShadow = true;
  deskGroup.add(deskTop);

  const legGeo = new THREE.CylinderGeometry(0.08, 0.08, 2.1, 12);
  [[-1.6, 1.05, -0.9], [1.6, 1.05, -0.9], [-1.6, 1.05, 0.9], [1.6, 1.05, 0.9]].forEach(([x, y, z]) => {
    const l = new THREE.Mesh(legGeo, mats.woodLight);
    l.position.set(x, y, z);
    l.castShadow = true;
    deskGroup.add(l);
  });

  // 椅子配轻松熊坐垫
  const chairGroup = new THREE.Group();
  chairGroup.position.set(-1.0, 0, 0.2);

  const chairPole = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 1.0, 12), mats.metalChrome);
  chairPole.position.y = 0.5;
  const chairWheel = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.8, 0.06, 16), mats.metalChrome);
  chairWheel.position.y = 0.15;
  chairGroup.add(chairPole, chairWheel);

  const chairCushionSeat = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.3, 1.4), mats.chairCushion);
  chairCushionSeat.position.set(0, 1.15, 0);
  chairCushionSeat.castShadow = true;
  const chairCushionBack = new THREE.Mesh(new THREE.BoxGeometry(1.4, 1.2, 0.25), mats.chairCushion);
  chairCushionBack.position.set(0, 1.75, 0.6);

  const rEarL = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.08, 16), mats.chairCushion);
  rEarL.rotation.x = Math.PI / 2;
  rEarL.position.set(-0.5, 2.35, 0.6);
  const rEarR = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.08, 16), mats.chairCushion);
  rEarR.rotation.x = Math.PI / 2;
  rEarR.position.set(0.5, 2.35, 0.6);
  chairGroup.add(chairCushionSeat, chairCushionBack, rEarL, rEarR);
  roomGroup.add(chairGroup);

  // -------------------------------------------------------------------------
  // 5.5 桌面精致道具与全部交互拾取 (简洁优雅标签)
  // -------------------------------------------------------------------------
  const interactiveObjects = [];

  // 1) 电脑一体机
  const monitorGroup = new THREE.Group();
  monitorGroup.position.set(0, 2.3, -0.4);
  const monStand = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.06, 0.6), mats.metalChrome);
  const monPole = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.6, 12), mats.metalChrome);
  monPole.position.y = 0.3;
  const monScreen = new THREE.Mesh(new THREE.BoxGeometry(2.4, 1.5, 0.08), mats.whiteClean);
  monScreen.position.y = 1.0;
  const monDisplay = new THREE.Mesh(new THREE.PlaneGeometry(2.25, 1.35), mats.screenGlow);
  monDisplay.position.set(0, 1.0, 0.05);
  monitorGroup.add(monStand, monPole, monScreen, monDisplay);
  deskGroup.add(monitorGroup);

  const keyboard = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.03, 0.45), mats.whiteClean);
  keyboard.position.set(0, 2.31, 0.45);
  const mousepad = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.25, 0.02, 16), mats.pillowBlue);
  mousepad.position.set(0.9, 2.31, 0.45);
  deskGroup.add(keyboard, mousepad);

  // 2) 轻松熊桌上台灯
  const deskLampGroup = new THREE.Group();
  deskLampGroup.position.set(-1.4, 2.3, -0.5);
  deskLampGroup.name = "interactive_lamp";
  const lampBase = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.3, 0.06, 12), mats.woodLight);
  const lampPole = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 1.1, 12), mats.goldMetal);
  lampPole.position.y = 0.55;
  const lampShade = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.5, 0.55, 16), mats.chairCushion);
  lampShade.position.set(0, 1.2, 0);
  deskLampGroup.add(lampBase, lampPole, lampShade);
  deskGroup.add(deskLampGroup);
  interactiveObjects.push({ mesh: deskLampGroup, type: "lamp", label: "台灯" });

  // 3) 拿铁咖啡杯
  const coffeeMugGroup = new THREE.Group();
  coffeeMugGroup.position.set(1.4, 2.3, 0.4);
  coffeeMugGroup.name = "interactive_mug";
  const mugBody = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.18, 0.45, 12), mats.whiteClean);
  mugBody.position.y = 0.225;
  const coffeeLiquid = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 0.03, 12), new THREE.MeshStandardMaterial({ color: 0x5C3A21, roughness: 0.3 }));
  coffeeLiquid.position.y = 0.4;
  coffeeMugGroup.add(mugBody, coffeeLiquid);
  deskGroup.add(coffeeMugGroup);
  interactiveObjects.push({ mesh: coffeeMugGroup, type: "mug", label: "记账" });

  // 4) 触控平板
  const tabletMesh = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.04, 1.2), mats.whiteClean);
  tabletMesh.position.set(-1.1, 2.31, 0.3);
  tabletMesh.rotation.y = 0.2;
  deskGroup.add(tabletMesh);
  interactiveObjects.push({ mesh: tabletMesh, type: "tablet", label: "数独 / 涂鸦" });

  // 5) 智能手机
  const phoneMesh = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.03, 0.8), mats.metalBlack);
  phoneMesh.position.set(-0.5, 2.31, 0.7);
  phoneMesh.rotation.y = -0.15;
  deskGroup.add(phoneMesh);
  interactiveObjects.push({ mesh: phoneMesh, type: "phone", label: "记账" });

  // 6) 手账本
  const notebookMesh = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.06, 1.2), mats.pillowCream);
  notebookMesh.position.set(0.6, 2.31, 0.5);
  notebookMesh.rotation.y = 0.1;
  deskGroup.add(notebookMesh);
  interactiveObjects.push({ mesh: notebookMesh, type: "notebook", label: "手账日记" });

  // 7) 迷你台历
  const calGroup = new THREE.Group();
  calGroup.position.set(-1.4, 2.31, 0.45);
  const calCard = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.42, 0.04), mats.whiteClean);
  calCard.rotation.x = -0.3;
  calGroup.add(calCard);
  deskGroup.add(calGroup);
  interactiveObjects.push({ mesh: calGroup, type: "calendar", label: "日程待办" });

  // 8) 微型复古黑胶机
  const turntable3DGroup = new THREE.Group();
  turntable3DGroup.position.set(1.4, 2.31, -0.4);
  turntable3DGroup.name = "interactive_turntable";
  const ttBase = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.18, 0.9), mats.turntablePink);
  ttBase.position.y = 0.09;
  const vinylDisc3D = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.35, 0.03, 20), mats.vinylBlack);
  vinylDisc3D.position.set(-0.1, 0.2, 0);
  const ttArm = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.04, 0.4), mats.metalBlack);
  ttArm.position.set(0.3, 0.23, 0.1);
  ttArm.rotation.y = 0.4;
  turntable3DGroup.add(ttBase, vinylDisc3D, ttArm);
  deskGroup.add(turntable3DGroup);
  interactiveObjects.push({ mesh: turntable3DGroup, type: "turntable", label: "音乐播放" });

  // 9) 桌上 5 只微型玩偶
  const dollsMiniGroup = new THREE.Group();
  dollsMiniGroup.position.set(0, 2.31, -0.85);
  const d1 = new THREE.Mesh(new THREE.SphereGeometry(0.12, 10, 10), mats.whiteClean);
  d1.position.x = -0.8;
  const d2 = new THREE.Mesh(new THREE.SphereGeometry(0.13, 10, 10), mats.flowerPink);
  d2.position.x = -0.4;
  const d3 = new THREE.Mesh(new THREE.SphereGeometry(0.13, 10, 10), mats.plushPuppyBrown);
  d3.position.x = 0;
  const d4 = new THREE.Mesh(new THREE.SphereGeometry(0.13, 10, 10), mats.woodWarm);
  d4.position.x = 0.4;
  const d5 = new THREE.Mesh(new THREE.SphereGeometry(0.12, 10, 10), mats.flowerYellow);
  d5.position.x = 0.8;
  dollsMiniGroup.add(d1, d2, d3, d4, d5);
  deskGroup.add(dollsMiniGroup);

  roomGroup.add(deskGroup);

  // -------------------------------------------------------------------------
  // 5.6 窗台花盆、挂钟与穿衣立镜
  // -------------------------------------------------------------------------
  const windowPlantGroup = new THREE.Group();
  windowPlantGroup.position.set(3.4, 2.3, -4.2);
  windowPlantGroup.name = "interactive_plant";
  const winPot = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.25, 0.45, 12), mats.clayPot);
  winPot.position.y = 0.225;
  const winPlant = new THREE.Mesh(new THREE.SphereGeometry(0.32, 12, 12), mats.plantGreen);
  winPlant.position.y = 0.55;
  winPlant.scale.set(1, 1.3, 1);
  const winFlower = new THREE.Mesh(new THREE.SphereGeometry(0.16, 12, 12), mats.flowerPink);
  winFlower.position.y = 0.95;
  windowPlantGroup.add(winPot, winPlant, winFlower);
  roomGroup.add(windowPlantGroup);
  interactiveObjects.push({ mesh: windowPlantGroup, type: "plant", label: "专注花盆" });

  // 墙面挂钟
  const wallClockGroup = new THREE.Group();
  wallClockGroup.position.set(-2.4, 5.0, -4.26);
  wallClockGroup.name = "interactive_clock";
  const clockFrame = new THREE.Mesh(new THREE.CylinderGeometry(0.7, 0.7, 0.1, 24), mats.woodWarm);
  clockFrame.rotation.x = Math.PI / 2;
  const clockDial = new THREE.Mesh(new THREE.CircleGeometry(0.62, 24), mats.whiteClean);
  clockDial.position.z = 0.06;
  const hourHand = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.32, 0.02), mats.metalBlack);
  hourHand.position.set(0, 0.16, 0.08);
  const minHand = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.48, 0.02), mats.metalBlack);
  minHand.position.set(0, 0.24, 0.09);
  const secHand = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.54, 0.02), new THREE.MeshBasicMaterial({ color: 0xE74C3C }));
  secHand.position.set(0, 0.26, 0.1);
  wallClockGroup.add(clockFrame, clockDial, hourHand, minHand, secHand);
  roomGroup.add(wallClockGroup);
  interactiveObjects.push({ mesh: wallClockGroup, type: "clock", label: "时钟" });

  // 优雅拱形落地立镜 (有支架有造型，不再是单薄木板)
  const mirrorGroup = new THREE.Group();
  mirrorGroup.position.set(3.8, 0, 3.2);
  mirrorGroup.rotation.y = -Math.PI / 4;
  mirrorGroup.name = "interactive_mirror";
  const mirrorFrame = new THREE.Mesh(new THREE.BoxGeometry(1.2, 3.4, 0.12), mats.woodWarm);
  mirrorFrame.position.y = 1.8;
  const mirrorGlass = new THREE.Mesh(new THREE.PlaneGeometry(1.0, 3.1), new THREE.MeshStandardMaterial({ color: 0xE8F0FE, roughness: 0.1, metalness: 0.9 }));
  mirrorGlass.position.set(0, 1.8, 0.07);
  // 后方三角支撑架
  const easelLeg = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 2.4, 8), mats.woodWarm);
  easelLeg.position.set(0, 1.1, -0.6);
  easelLeg.rotation.x = -0.4;
  mirrorGroup.add(mirrorFrame, mirrorGlass, easelLeg);
  roomGroup.add(mirrorGroup);

  // 左墙原木书架
  const shelf = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.1, 2.6), mats.woodLight);
  shelf.position.set(-4.26, 4.4, -1.8);
  const sBook1 = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.55, 0.35), mats.bedBlue);
  sBook1.position.set(-4.2, 4.75, -2.4);
  const sBook2 = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.5, 0.3), mats.flowerPink);
  sBook2.position.set(-4.2, 4.72, -2.0);
  const sBook3 = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.52, 0.3), mats.flowerYellow);
  sBook3.position.set(-4.2, 4.73, -1.6);
  roomGroup.add(shelf, sBook1, sBook2, sBook3);

  // -------------------------------------------------------------------------
  // 5.7 3D 女孩手办重构 (轻盈可爱造型，杜绝树桩怪异感；支持一键隐藏)
  // -------------------------------------------------------------------------
  const girlCharacter = new THREE.Group();
  girlCharacter.name = "interactive_girl";

  // 轻巧圆润上半身 (乳白色舒适上衣)
  const girlTorso = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.32, 0.75, 14), mats.clayGirlTee);
  girlTorso.position.y = 1.35;
  girlTorso.castShadow = true;

  const girlShorts = new THREE.Mesh(new THREE.CylinderGeometry(0.33, 0.35, 0.32, 14), mats.clayGirlShorts);
  girlShorts.position.y = 0.95;

  // 秀气小巧面庞
  const girlHead = new THREE.Mesh(new THREE.SphereGeometry(0.35, 16, 16), mats.clayGirlSkin);
  girlHead.position.y = 1.95;

  // 秀丽栗色波波头与刘海 (不再用巨型圆柱体覆盖全身)
  const hairBob = new THREE.Mesh(new THREE.SphereGeometry(0.38, 16, 16), mats.clayGirlHair);
  hairBob.position.set(0, 1.98, -0.05);
  hairBob.scale.set(1.02, 1.0, 0.95);

  const hairBangs = new THREE.Mesh(new THREE.SphereGeometry(0.36, 14, 14), mats.clayGirlHair);
  hairBangs.position.set(0, 2.05, 0.08);
  hairBangs.scale.set(1.02, 0.65, 0.95);

  // 白色小耳机
  const hpBand = new THREE.Mesh(new THREE.TorusGeometry(0.38, 0.03, 8, 18, Math.PI), mats.whiteClean);
  hpBand.position.set(0, 2.05, 0);
  hpBand.rotation.z = Math.PI;
  const hpL = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.08, 12), mats.whiteClean);
  hpL.position.set(-0.36, 1.95, 0);
  hpL.rotation.z = Math.PI / 2;
  const hpR = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.08, 12), mats.whiteClean);
  hpR.position.set(0.36, 1.95, 0);
  hpR.rotation.z = Math.PI / 2;

  // 纤细圆框眼镜
  const glassesGroup = new THREE.Group();
  glassesGroup.position.set(0, 1.98, 0.32);
  const gL = new THREE.Mesh(new THREE.TorusGeometry(0.08, 0.012, 8, 12), mats.goldMetal);
  gL.position.x = -0.11;
  const gR = new THREE.Mesh(new THREE.TorusGeometry(0.08, 0.012, 8, 12), mats.goldMetal);
  gR.position.x = 0.11;
  glassesGroup.add(gL, gR);

  // 秀气手臂与双腿
  const legL = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.08, 0.75, 10), mats.clayGirlSkin);
  legL.position.set(-0.15, 0.55, 0.2);
  const legR = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.08, 0.75, 10), mats.clayGirlSkin);
  legR.position.set(0.15, 0.55, 0.2);
  const armL = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.06, 0.6, 10), mats.clayGirlSkin);
  armL.position.set(-0.36, 1.3, 0.18);
  armL.rotation.x = 0.4;
  const armR = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.06, 0.6, 10), mats.clayGirlSkin);
  armR.position.set(0.36, 1.3, 0.18);
  armR.rotation.x = 0.4;

  girlCharacter.add(
    girlTorso, girlShorts, girlHead,
    hairBob, hairBangs,
    hpBand, hpL, hpR, glassesGroup,
    legL, legR, armL, armR
  );

  girlCharacter.position.set(-1.0, 0.15, 0.2);
  roomGroup.add(girlCharacter);
  interactiveObjects.push({ mesh: girlCharacter, type: "girl", label: "人物" });

  // 女生姿态与隐藏切换
  function applyGirlPose(poseName) {
    state.room.girlPose = poseName;
    saveState();

    const poseLabelEl = document.getElementById("currentPoseLabel");
    document.querySelectorAll(".pose-option-item").forEach(item => {
      item.classList.toggle("active", item.dataset.pose === poseName);
    });

    if (poseName === "hide") {
      if (poseLabelEl) poseLabelEl.textContent = "隐藏人物";
      girlCharacter.visible = false;
      sleepCurtain.visible = false;
      return;
    }

    girlCharacter.visible = true;

    if (poseName === "study") {
      if (poseLabelEl) poseLabelEl.textContent = "自习状态";
      girlCharacter.position.set(-1.0, 0.15, 0.2);
      girlCharacter.rotation.set(0, 0, 0);
      girlTorso.visible = true;
      girlShorts.visible = true;
      legL.visible = true;
      legR.visible = true;
      glassesGroup.visible = true;
      sleepCurtain.visible = false;
    } else if (poseName === "bed") {
      if (poseLabelEl) poseLabelEl.textContent = "床边小憩";
      girlCharacter.position.set(1.6, 1.05, -1.8);
      girlCharacter.rotation.set(0, -Math.PI / 4, 0);
      girlTorso.visible = true;
      girlShorts.visible = true;
      legL.visible = true;
      legR.visible = true;
      glassesGroup.visible = true;
      sleepCurtain.visible = false;
    } else if (poseName === "sleep") {
      if (poseLabelEl) poseLabelEl.textContent = "睡眠状态";
      girlCharacter.position.set(1.0, 0.95, -3.2);
      girlCharacter.rotation.set(0, -Math.PI / 2, 0);
      glassesGroup.visible = false;
      sleepCurtain.visible = true;
    }
  }

  const toggleGirlPoseBtn = document.getElementById("toggleGirlPoseBtn");
  const poseOptionsMenu = document.getElementById("poseOptionsMenu");

  if (toggleGirlPoseBtn && poseOptionsMenu) {
    toggleGirlPoseBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      poseOptionsMenu.classList.toggle("show");
    });
    document.addEventListener("click", () => {
      poseOptionsMenu.classList.remove("show");
    });
    document.querySelectorAll(".pose-option-item").forEach(opt => {
      opt.addEventListener("click", () => {
        applyGirlPose(opt.dataset.pose);
        poseOptionsMenu.classList.remove("show");
      });
    });
  }
  applyGirlPose(state.room.girlPose || "study");

  // -------------------------------------------------------------------------
  // 5.8 GLB / Trellis / Meshy 3D 模型动态加载与高级平滑优化系统
  // -------------------------------------------------------------------------
  let customGlbPivot = new THREE.Group();
  scene.add(customGlbPivot);
  let customGlbGroup = null;
  let customGlbPlinth = null;
  let isModelWireframe = false;
  let currentModelYaw = 0;
  let currentModelScale = 1.0;
  const glbLoader = (typeof THREE.GLTFLoader !== "undefined") ? new THREE.GLTFLoader() : null;

  // 创建艺术展示微缩底座 (让 AI 导出的房间悬空网格拥有实木/奶白高级陈列底台)
  function ensurePlinth() {
    if (!customGlbPlinth) {
      const plinthGeo = new THREE.BoxGeometry(9.6, 0.45, 9.6);
      const plinthMat = new THREE.MeshStandardMaterial({
        color: 0xF7F2EB,
        roughness: 0.72,
        metalness: 0.04
      });
      customGlbPlinth = new THREE.Mesh(plinthGeo, plinthMat);
      customGlbPlinth.position.y = -0.225;
      customGlbPlinth.receiveShadow = true;
      scene.add(customGlbPlinth);
    }
  }

  function applyGlbScene(gltf, displayName = "room.glb") {
    if (customGlbGroup) {
      customGlbPivot.remove(customGlbGroup);
      customGlbGroup = null;
    }

    const model = gltf.scene || gltf.scenes[0];

    // 核心平滑优化：Trellis 等导出的原始网格未包含顶点法线，导致生硬凹凸面片感
    // 此处遍历几何体重新平滑计算法线，并开启各向异性过滤与双面温润微光
    model.traverse((node) => {
      if (node.isMesh) {
        if (node.geometry) {
          node.geometry.deleteAttribute('normal');
          node.geometry.computeVertexNormals();
          node.geometry.normalizeNormals();
        }
        node.castShadow = true;
        node.receiveShadow = true;
        if (node.material) {
          const mats = Array.isArray(node.material) ? node.material : [node.material];
          mats.forEach((m) => {
            m.side = THREE.DoubleSide;
            m.shadowSide = THREE.DoubleSide;
            if (m.map) {
              m.map.encoding = THREE.sRGBEncoding;
              m.map.generateMipmaps = true;
              m.map.minFilter = THREE.LinearMipmapLinearFilter;
              m.map.magFilter = THREE.LinearFilter;
              if (renderer && renderer.capabilities) {
                m.map.anisotropy = renderer.capabilities.getMaxAnisotropy();
              }
            }
            // 细腻丝滑微光质感 (告别 1.0 惨白干涩反光与粗糙泥塑感)
            m.roughness = 0.50;
            m.metalness = 0.04;
            m.wireframe = isModelWireframe;
            m.needsUpdate = true;
          });
        }
      }
    });

    // 自动居中与规范化缩放至视口手办盒黄金尺寸
    const box = new THREE.Box3().setFromObject(model);
    const size = new THREE.Vector3();
    box.getSize(size);
    const center = new THREE.Vector3();
    box.getCenter(center);

    const maxDim = Math.max(size.x, size.y, size.z);
    const targetScale = 8.6 / (maxDim || 1);
    model.scale.set(targetScale, targetScale, targetScale);

    box.setFromObject(model);
    box.getCenter(center);
    model.position.x -= center.x;
    model.position.y -= box.min.y;
    model.position.z -= center.z;

    customGlbGroup = model;
    customGlbPivot.add(customGlbGroup);
    customGlbPivot.visible = true;

    // 载入展示底座
    ensurePlinth();
    if (customGlbPlinth) customGlbPlinth.visible = true;

    // 隐藏默认的拼接几何体房间
    roomGroup.visible = false;

    const modeLabel = document.getElementById("currentModelModeLabel");
    if (modeLabel) modeLabel.textContent = displayName;

    showNotificationToast(`已载入并平滑优化：${displayName}`);
  }

  function loadGlbModelBuffer(buffer, fileName = "custom.glb") {
    if (!glbLoader) {
      alert("GLTFLoader 尚未就绪，请稍候重试！");
      return;
    }
    glbLoader.parse(buffer, "", (gltf) => {
      applyGlbScene(gltf, fileName);
    }, (err) => {
      console.error("GLB 加载失败：", err);
      alert("无法解析该模型文件，请确保格式有效！");
    });
  }

  function loadGlbModelUrl(url = "room.glb", displayName = "Trellis AI 高清 3D 模型 (room.glb)") {
    if (!glbLoader) return;
    glbLoader.load(url, (gltf) => {
      applyGlbScene(gltf, displayName);
    }, undefined, (err) => {
      console.log("未检测到预设模型或加载跳过：", err);
      const modeLabel = document.getElementById("currentModelModeLabel");
      if (modeLabel) modeLabel.textContent = "默认几何空间";
    });
  }

  // 页面启动时自动检测并载入项目中的 room.glb (来自 Trellis AI)
  if (glbLoader) {
    loadGlbModelUrl("room.glb", "Trellis AI 高清 3D 模型 (room.glb)");
  }

  const glbFileInput = document.getElementById("glbFileInput");
  const selectGlbFileBtn = document.getElementById("selectGlbFileBtn");
  const glbDropZone = document.getElementById("glbDropZone");
  const resetToDefaultRoomBtn = document.getElementById("resetToDefaultRoomBtn");
  const loadTrellisRoomBtn = document.getElementById("loadTrellisRoomBtn");
  const toggleModelWireframeBtn = document.getElementById("toggleModelWireframeBtn");
  const rotateModelLeftBtn = document.getElementById("rotateModelLeftBtn");
  const rotateModelRightBtn = document.getElementById("rotateModelRightBtn");
  const scaleModelUpBtn = document.getElementById("scaleModelUpBtn");
  const scaleModelDownBtn = document.getElementById("scaleModelDownBtn");
  const togglePlinthBtn = document.getElementById("togglePlinthBtn");
  const openGlbModalBtn = document.getElementById("openGlbModalBtn");

  if (openGlbModalBtn) {
    openGlbModalBtn.addEventListener("click", () => {
      openDrawer("modal-glb-loader");
    });
  }

  if (loadTrellisRoomBtn) {
    loadTrellisRoomBtn.addEventListener("click", () => {
      loadGlbModelUrl("room.glb", "Trellis AI 高清 3D 模型 (room.glb)");
    });
  }

  // 旋转与缩放微调
  if (rotateModelLeftBtn) {
    rotateModelLeftBtn.addEventListener("click", () => {
      currentModelYaw -= Math.PI / 4;
      customGlbPivot.rotation.y = currentModelYaw;
    });
  }
  if (rotateModelRightBtn) {
    rotateModelRightBtn.addEventListener("click", () => {
      currentModelYaw += Math.PI / 4;
      customGlbPivot.rotation.y = currentModelYaw;
    });
  }
  if (scaleModelUpBtn) {
    scaleModelUpBtn.addEventListener("click", () => {
      currentModelScale = Math.min(1.8, currentModelScale * 1.1);
      customGlbPivot.scale.setScalar(currentModelScale);
    });
  }
  if (scaleModelDownBtn) {
    scaleModelDownBtn.addEventListener("click", () => {
      currentModelScale = Math.max(0.4, currentModelScale * 0.9);
      customGlbPivot.scale.setScalar(currentModelScale);
    });
  }
  if (togglePlinthBtn) {
    togglePlinthBtn.addEventListener("click", () => {
      if (customGlbPlinth) {
        customGlbPlinth.visible = !customGlbPlinth.visible;
        showNotificationToast(customGlbPlinth.visible ? "已显示艺术底座" : "已隐藏底座");
      }
    });
  }

  if (toggleModelWireframeBtn) {
    toggleModelWireframeBtn.addEventListener("click", () => {
      isModelWireframe = !isModelWireframe;
      const target = customGlbGroup || roomGroup;
      target.traverse((node) => {
        if (node.isMesh && node.material) {
          const mats = Array.isArray(node.material) ? node.material : [node.material];
          mats.forEach(m => { m.wireframe = isModelWireframe; });
        }
      });
      toggleModelWireframeBtn.classList.toggle("active", isModelWireframe);
      showNotificationToast(isModelWireframe ? "已开启线框模式" : "已切回实体着色");
    });
  }

  if (selectGlbFileBtn && glbFileInput) {
    selectGlbFileBtn.addEventListener("click", () => {
      glbFileInput.click();
    });
  }

  if (glbFileInput) {
    glbFileInput.addEventListener("change", (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (re) => {
          loadGlbModelBuffer(re.target.result, file.name);
        };
        reader.readAsArrayBuffer(file);
      }
    });
  }

  if (glbDropZone) {
    ["dragenter", "dragover"].forEach(evt => {
      glbDropZone.addEventListener(evt, (e) => {
        e.preventDefault();
        glbDropZone.classList.add("dragover");
      });
    });
    ["dragleave", "drop"].forEach(evt => {
      glbDropZone.addEventListener(evt, (e) => {
        e.preventDefault();
        glbDropZone.classList.remove("dragover");
      });
    });
    glbDropZone.addEventListener("drop", (e) => {
      const file = e.dataTransfer.files[0];
      if (file && (file.name.endsWith(".glb") || file.name.endsWith(".gltf"))) {
        const reader = new FileReader();
        reader.onload = (re) => {
          loadGlbModelBuffer(re.target.result, file.name);
        };
        reader.readAsArrayBuffer(file);
      } else {
        alert("请拖入 .glb 或 .gltf 格式的 3D 模型文件！");
      }
    });
  }

  if (resetToDefaultRoomBtn) {
    resetToDefaultRoomBtn.addEventListener("click", () => {
      if (customGlbGroup) {
        customGlbPivot.remove(customGlbGroup);
        customGlbGroup = null;
      }
      customGlbPivot.visible = false;
      if (customGlbPlinth) customGlbPlinth.visible = false;
      roomGroup.visible = true;
      const modeLabel = document.getElementById("currentModelModeLabel");
      if (modeLabel) modeLabel.textContent = "默认几何空间";
      showNotificationToast("已切回默认场景");
    });
  }

  // -------------------------------------------------------------------------
  // 5.9 光线投射拾取与极简 Hover Tooltip (简洁明确，无冗余说明)
  // -------------------------------------------------------------------------
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();
  const tooltip = document.getElementById("roomObjectTooltip");
  const tooltipText = document.getElementById("tooltipText");
  let hoveredItem = null;

  function findParentInteractive(obj) {
    while (obj) {
      const match = interactiveObjects.find(item => item.mesh === obj);
      if (match) return match;
      obj = obj.parent;
    }
    return null;
  }

  function onPointerMove(e) {
    const rect = canvas.getBoundingClientRect();
    mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(roomGroup.children, true);

    if (intersects.length > 0) {
      const found = findParentInteractive(intersects[0].object);
      if (found) {
        hoveredItem = found;
        if (tooltip && tooltipText) {
          tooltipText.textContent = found.label;
          tooltip.style.left = `${e.clientX}px`;
          tooltip.style.top = `${e.clientY}px`;
          tooltip.style.display = "flex";
        }
        canvas.style.cursor = "pointer";
        return;
      }
    }
    hoveredItem = null;
    if (tooltip) tooltip.style.display = "none";
    canvas.style.cursor = "default";
  }

  function onPointerClick(e) {
    if (!hoveredItem) return;

    if (isTimerRunning) {
      if (hoveredItem.type === "tablet" || hoveredItem.type === "phone") {
        showFocusLockAlert();
        return;
      }
    }

    switch (hoveredItem.type) {
      case "plant":
        openDrawer("modal-pomodoro-garden");
        break;
      case "notebook":
        openDrawer("modal-scrapbook-journal");
        break;
      case "mug":
        openDrawer("modal-shark-ledger");
        selectSharkCategory("餐饮美食");
        break;
      case "phone":
        openDrawer("modal-shark-ledger");
        break;
      case "turntable":
        openDrawer("modal-music-spotify");
        const on = AmbientAudio.playLofi();
        if (playMusicBtn) playMusicBtn.classList.toggle("active", on);
        setDiscSpinning(on);
        break;
      case "tablet":
        openDrawer("modal-tablet-games");
        break;
      case "calendar":
        openDrawer("modal-calendar-todo");
        break;
      case "clock":
        openDrawer("modal-clock-hud");
        break;
      case "lamp":
        state.room.lampYellowOn = !state.room.lampYellowOn;
        rilakkumaLampLight.visible = state.room.lampYellowOn;
        if (toggleLampLightBtn) toggleLampLightBtn.classList.toggle("active", state.room.lampYellowOn);
        saveState();
        break;
      case "girl":
        const poses = ["study", "bed", "sleep", "hide"];
        const nextPose = poses[(poses.indexOf(state.room.girlPose) + 1) % poses.length];
        applyGirlPose(nextPose);
        break;
    }
  }

  canvas.addEventListener("mousemove", onPointerMove);
  canvas.addEventListener("click", onPointerClick);

  // 视角拖拽旋转
  let isMouseDown = false;
  let prevMousePos = { x: 0, y: 0 };

  canvas.addEventListener("mousedown", (e) => {
    isMouseDown = true;
    prevMousePos = { x: e.clientX, y: e.clientY };
  });

  window.addEventListener("mouseup", () => { isMouseDown = false; });

  canvas.addEventListener("mousemove", (e) => {
    if (!isMouseDown) return;
    const deltaX = e.clientX - prevMousePos.x;
    const deltaY = e.clientY - prevMousePos.y;
    prevMousePos = { x: e.clientX, y: e.clientY };

    cameraAngleX -= deltaX * 0.008;
    cameraAngleY = Math.max(0.2, Math.min(1.1, cameraAngleY + deltaY * 0.008));
    updateCamera();
  });

  // 滚轮缩放
  canvas.addEventListener("wheel", (e) => {
    e.preventDefault();
    cameraDistance = Math.max(14, Math.min(32, cameraDistance + e.deltaY * 0.02));
    updateCamera();
  }, { passive: false });

  // 重置视角
  const resetCameraBtn = document.getElementById("resetCameraBtn");
  if (resetCameraBtn) {
    resetCameraBtn.addEventListener("click", () => {
      cameraAngleX = 0.785;
      cameraAngleY = 0.56;
      cameraDistance = 22;
      updateCamera();
    });
  }

  // -------------------------------------------------------------------------
  // 5.10 渲染循环 (时钟同步走动)
  // -------------------------------------------------------------------------
  const clock = new THREE.Clock();

  function animateRoom() {
    requestAnimationFrame(animateRoom);
    const elapsed = clock.getElapsedTime();

    const now = new Date();
    const s = now.getSeconds() + now.getMilliseconds() / 1000;
    const m = now.getMinutes() + s / 60;
    const h = (now.getHours() % 12) + m / 60;

    secHand.rotation.z = -s * (Math.PI / 30);
    minHand.rotation.z = -m * (Math.PI / 30);
    hourHand.rotation.z = -h * (Math.PI / 6);

    if (girlCharacter.visible) {
      if (state.room.girlPose === "study") {
        legL.rotation.x = Math.sin(elapsed * 2.0) * 0.12 + 0.2;
        legR.rotation.x = -Math.sin(elapsed * 2.0) * 0.12 + 0.2;
      }
    }

    if (AmbientAudio.currentTrack) {
      vinylDisc3D.rotation.y += 0.05;
    }

    renderer.render(scene, camera);
  }
  animateRoom();

  // 窗口尺寸自适应
  window.addEventListener("resize", () => {
    const w = viewportContainer.clientWidth || window.innerWidth;
    const h = viewportContainer.clientHeight || window.innerHeight;
    const asp = w / h;
    camera.left = -d * asp;
    camera.right = d * asp;
    camera.top = d;
    camera.bottom = -d;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  });

  // =========================================================================
  // 6. 番茄钟专注与花卉标本库 (Pomodoro & Greenhouse)
  // =========================================================================
  let timerDuration = 1500;
  let timeLeft = timerDuration;
  let timerInterval = null;
  let isTimerRunning = false;

  const timerDisplay = document.getElementById("timerDisplay");
  const startTimerBtn = document.getElementById("startTimerBtn");
  const timerBtnText = document.getElementById("timerBtnText");
  const resetTimerBtn = document.getElementById("resetTimerBtn");
  const focusLockBanner = document.getElementById("focusLockBanner");

  function showFocusLockAlert() {
    alert("🔒 深度心流专注中！手机和休闲游戏已锁定，请静心专注，倒计时结束后再来放松哦～ ✨");
  }

  function formatTimeMS(sec) {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  }

  document.querySelectorAll(".mode-pill").forEach(pill => {
    pill.addEventListener("click", () => {
      if (isTimerRunning) return;
      document.querySelectorAll(".mode-pill").forEach(p => p.classList.remove("active"));
      pill.classList.add("active");
      timerDuration = parseInt(pill.dataset.time, 10);
      timeLeft = timerDuration;
      if (timerDisplay) timerDisplay.textContent = formatTimeMS(timeLeft);
    });
  });

  if (startTimerBtn) {
    startTimerBtn.addEventListener("click", () => {
      if (!isTimerRunning) {
        // 开始专注
        isTimerRunning = true;
        if (timerBtnText) timerBtnText.textContent = "暂停专注";
        startTimerBtn.classList.add("paused-mode");
        if (focusLockBanner) focusLockBanner.style.display = "flex";

        // 女生自动切换为自习姿态
        applyGirlPose("study");

        const wateringCan = document.getElementById("wateringCan");
        if (wateringCan) wateringCan.classList.add("active");

        timerInterval = setInterval(() => {
          timeLeft--;
          if (timerDisplay) timerDisplay.textContent = formatTimeMS(timeLeft);

          if (timeLeft <= 0) {
            clearInterval(timerInterval);
            isTimerRunning = false;
            if (timerBtnText) timerBtnText.textContent = "开始专注浇花";
            if (focusLockBanner) focusLockBanner.style.display = "none";
            if (wateringCan) wateringCan.classList.remove("active");

            handlePomodoroFinish();
          }
        }, 1000);
      } else {
        // 暂停
        clearInterval(timerInterval);
        isTimerRunning = false;
        if (timerBtnText) timerBtnText.textContent = "继续专注";
        startTimerBtn.classList.remove("paused-mode");
        if (focusLockBanner) focusLockBanner.style.display = "none";

        const wateringCan = document.getElementById("wateringCan");
        if (wateringCan) wateringCan.classList.remove("active");
      }
    });
  }

  if (resetTimerBtn) {
    resetTimerBtn.addEventListener("click", () => {
      clearInterval(timerInterval);
      isTimerRunning = false;
      timeLeft = timerDuration;
      if (timerDisplay) timerDisplay.textContent = formatTimeMS(timeLeft);
      if (timerBtnText) timerBtnText.textContent = "开始专注浇花";
      if (focusLockBanner) focusLockBanner.style.display = "none";
      const wateringCan = document.getElementById("wateringCan");
      if (wateringCan) wateringCan.classList.remove("active");
    });
  }

  function handlePomodoroFinish() {
    state.plant.waterCount++;
    const addedMinutes = Math.round(timerDuration / 60) || 1;
    state.plant.todayFocusMinutes += addedMinutes;
    state.user.totalFocusMinutes += addedMinutes;
    state.plant.exp += 25;

    // 每专注满1小时（或积累经验）随机培育盛开新花卉
    const flowerKeys = ["daisy", "tulip", "cactus", "succulent", "bellflower", "fern"];
    const luckyKey = flowerKeys[Math.floor(Math.random() * flowerKeys.length)];
    state.user.unlockedFlowers[luckyKey] = (state.user.unlockedFlowers[luckyKey] || 0) + 1;

    saveState();
    refreshPlantUI();

    alert(`🎉 专注完成！已成功给窗台浇花，经验值 +25 EXP，并且盛开了一朵新的花卉已收入标本库！`);
  }

  function refreshPlantUI() {
    const waterEl = document.getElementById("waterCountText");
    if (waterEl) waterEl.textContent = state.plant.waterCount;
    const focusEl = document.getElementById("todayFocusTimeText");
    if (focusEl) focusEl.textContent = state.plant.todayFocusMinutes;

    const progBar = document.getElementById("growthProgressBar");
    if (progBar) progBar.style.width = `${state.plant.exp % 100}%`;
    const expText = document.getElementById("growthExpText");
    if (expText) expText.textContent = `${state.plant.exp % 100} / 100 EXP`;

    // 标本库卡片更新
    const flowerNames = {
      daisy: "纯白雏菊", tulip: "朱红郁金香", cactus: "圆润仙人球",
      succulent: "翡翠多肉", bellflower: "风铃草", fern: "翠羽小蕨草"
    };
    let unlockedCount = 0;
    Object.keys(flowerNames).forEach(k => {
      const card = document.querySelector(`.species-card[data-flower="${k}"]`);
      const count = state.user.unlockedFlowers[k] || 0;
      if (count > 0) {
        unlockedCount++;
        if (card) {
          card.classList.add("unlocked");
          const countEl = card.querySelector(".species-count");
          if (countEl) countEl.textContent = `x${count} 盛开`;
        }
      }
    });
    const badge = document.getElementById("herbariumUnlockedBadge");
    if (badge) badge.textContent = `已盛开 ${unlockedCount}/6 种`;
  }
  refreshPlantUI();

  // =========================================================================
  // 7. 拍立得照片网格手账本 (Scrapbook Journal, 参考图 5)
  // =========================================================================
  let currentViewingDate = "2026-09-06";
  let selectedPhotoBase64 = null;

  const triggerPhotoUploadBtn = document.getElementById("triggerPhotoUploadBtn");
  const journalPhotoInput = document.getElementById("journalPhotoInput");
  const journalPhotoPreviewWrap = document.getElementById("journalPhotoPreviewWrap");
  const removePhotoBtn = document.getElementById("removePhotoBtn");
  const scrapbookDisplayPhoto = document.getElementById("scrapbookDisplayPhoto");
  const photoPlaceholderWrap = document.getElementById("photoPlaceholderWrap");
  const saveJournalBtn = document.getElementById("saveJournalBtn");
  const journalInput = document.getElementById("journalInput");

  if (triggerPhotoUploadBtn && journalPhotoInput) {
    triggerPhotoUploadBtn.addEventListener("click", () => {
      journalPhotoInput.click();
    });
  }

  if (journalPhotoInput) {
    journalPhotoInput.addEventListener("change", function() {
      const file = this.files && this.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = function(e) {
        selectedPhotoBase64 = e.target.result;
        if (scrapbookDisplayPhoto) {
          scrapbookDisplayPhoto.src = selectedPhotoBase64;
          scrapbookDisplayPhoto.style.display = "block";
        }
        if (photoPlaceholderWrap) photoPlaceholderWrap.style.display = "none";
        if (journalPhotoPreviewWrap) journalPhotoPreviewWrap.style.display = "inline-flex";
      };
      reader.readAsDataURL(file);
    });
  }

  if (removePhotoBtn) {
    removePhotoBtn.addEventListener("click", () => {
      selectedPhotoBase64 = null;
      if (journalPhotoInput) journalPhotoInput.value = "";
      if (scrapbookDisplayPhoto) scrapbookDisplayPhoto.style.display = "none";
      if (photoPlaceholderWrap) photoPlaceholderWrap.style.display = "flex";
      if (journalPhotoPreviewWrap) journalPhotoPreviewWrap.style.display = "none";
    });
  }

  if (saveJournalBtn) {
    saveJournalBtn.addEventListener("click", async () => {
      const text = journalInput.value.trim();
      if (!text && !selectedPhotoBase64) {
        alert("请先写下一句心情或贴入一张拍立得照片哦～");
        return;
      }

      saveJournalBtn.disabled = true;
      saveJournalBtn.textContent = "正在盖印装裱中...";

      try {
        const result = await CozyAI.analyzeJournalEntry(text || "今日留影纪念");
        const now = new Date();
        const timeStr = `${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}`;

        state.journals[currentViewingDate] = {
          text: text,
          photo: selectedPhotoBase64,
          moodLabel: result.moodLabel,
          moodColor: result.moodColor,
          weather: result.weather,
          summaryReply: result.summaryReply,
          time: `今日 ${timeStr}`
        };
        saveState();

        renderScrapbookPage();
        alert("✨ 今日手账已成功收录归档！");
      } catch (e) {
        console.error(e);
      } finally {
        saveJournalBtn.disabled = false;
        saveJournalBtn.textContent = "盖印保存手账 ✨";
      }
    });
  }

  function renderScrapbookPage() {
    const record = state.journals[currentViewingDate];
    const ind = document.getElementById("scrapbookPageIndicator");
    if (ind) ind.textContent = currentViewingDate;

    if (record) {
      if (journalInput) journalInput.value = record.text || "";
      if (record.photo) {
        if (scrapbookDisplayPhoto) {
          scrapbookDisplayPhoto.src = record.photo;
          scrapbookDisplayPhoto.style.display = "block";
        }
        if (photoPlaceholderWrap) photoPlaceholderWrap.style.display = "none";
      } else {
        if (scrapbookDisplayPhoto) scrapbookDisplayPhoto.style.display = "none";
        if (photoPlaceholderWrap) photoPlaceholderWrap.style.display = "flex";
      }

      // AI 信封显示
      const env = document.getElementById("aiFeedbackEnvelope");
      if (env) {
        env.style.display = "block";
        document.getElementById("aiMoodStamp").textContent = record.moodLabel;
        document.getElementById("aiMoodStamp").style.backgroundColor = record.moodColor;
        document.getElementById("aiWeatherStamp").textContent = record.weather;
        document.getElementById("aiSummaryText").textContent = `“${record.summaryReply}”`;
        document.getElementById("aiFeedbackTime").textContent = record.time;
      }
    } else {
      if (journalInput) journalInput.value = "";
      if (scrapbookDisplayPhoto) scrapbookDisplayPhoto.style.display = "none";
      if (photoPlaceholderWrap) photoPlaceholderWrap.style.display = "flex";
      const env = document.getElementById("aiFeedbackEnvelope");
      if (env) env.style.display = "none";
    }

    renderMiniCalGrid();
    renderMoodGrid();
  }

  // 迷你小网格日历 (左页)
  function renderMiniCalGrid() {
    const grid = document.getElementById("scrapbookMiniCalGrid");
    if (!grid) return;
    grid.innerHTML = "";
    for (let day = 1; day <= 30; day++) {
      const cell = document.createElement("div");
      cell.className = "mini-cal-cell";
      cell.textContent = day;
      const dayKey = `2026-09-${String(day).padStart(2,'0')}`;
      if (state.journals[dayKey]) {
        cell.style.backgroundColor = state.journals[dayKey].moodColor;
        cell.style.fontWeight = "bold";
      }
      if (day === 6) cell.classList.add("today");
      cell.addEventListener("click", () => {
        currentViewingDate = dayKey;
        renderScrapbookPage();
      });
      grid.appendChild(cell);
    }
  }

  // 右下角心情地毯网格
  function renderMoodGrid() {
    const grid = document.getElementById("moodGridContainer");
    if (!grid) return;
    grid.innerHTML = "";
    for (let day = 1; day <= 30; day++) {
      const dayKey = `2026-09-${String(day).padStart(2,'0')}`;
      const rec = state.journals[dayKey];
      const px = document.createElement("div");
      px.className = "mood-pixel";
      px.textContent = day;
      if (rec) {
        px.style.backgroundColor = rec.moodColor;
        px.title = `${dayKey} · ${rec.moodLabel}`;
        px.addEventListener("click", () => {
          openMemoryModal(dayKey, rec);
        });
      }
      grid.appendChild(px);
    }
  }

  // 手账翻页
  const prevBtn = document.getElementById("scrapbookPrevPageBtn");
  const nextBtn = document.getElementById("scrapbookNextPageBtn");
  const todayBtn = document.getElementById("scrapbookTodayBtn");

  if (prevBtn) {
    prevBtn.addEventListener("click", () => {
      const parts = currentViewingDate.split("-");
      let d = parseInt(parts[2], 10) - 1;
      if (d < 1) d = 30;
      currentViewingDate = `${parts[0]}-${parts[1]}-${String(d).padStart(2,'0')}`;
      renderScrapbookPage();
    });
  }
  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      const parts = currentViewingDate.split("-");
      let d = parseInt(parts[2], 10) + 1;
      if (d > 30) d = 1;
      currentViewingDate = `${parts[0]}-${parts[1]}-${String(d).padStart(2,'0')}`;
      renderScrapbookPage();
    });
  }
  if (todayBtn) {
    todayBtn.addEventListener("click", () => {
      currentViewingDate = "2026-09-06";
      renderScrapbookPage();
    });
  }

  function openMemoryModal(dateKey, record) {
    const memModal = document.getElementById("memoryModal");
    if (!memModal) return;
    document.getElementById("memoryDateTitle").textContent = `📅 ${dateKey} · 迎屿手账`;
    const moodBadge = document.getElementById("memoryMoodBadge");
    moodBadge.textContent = `${record.weather} · ${record.moodLabel}`;
    moodBadge.style.backgroundColor = record.moodColor;
    document.getElementById("memoryContentText").textContent = record.text || "（记录了拍立得生活留影）";
    document.getElementById("memoryAiQuote").textContent = `陪伴：“${record.summaryReply}”`;

    const photoContainer = document.getElementById("memoryPhotoContainer");
    const photoImg = document.getElementById("memoryPhotoImg");
    if (photoContainer && photoImg) {
      if (record.photo) {
        photoImg.src = record.photo;
        photoContainer.style.display = "block";
      } else {
        photoContainer.style.display = "none";
      }
    }
    memModal.classList.add("open");
  }

  // =========================================================================
  // 8. 日常记账 APP 原生面板 (Daily Ledger)
  // =========================================================================
  let sharkActiveType = "expense"; // 'expense' or 'income'
  let currentSelectedCategory = { name: "餐饮美食", icon: "🍵" };
  let currentKeypadInput = "0.00";

  const sharkCategories = {
    expense: [
      { name: "餐饮美食", icon: "🍵" }, { name: "日常购物", icon: "🛍️" },
      { name: "日用百货", icon: "🧻" }, { name: "交通出行", icon: "🚇" },
      { name: "新鲜水果", icon: "🍎" }, { name: "零食甜点", icon: "🍪" },
      { name: "学习提升", icon: "📚" }, { name: "休闲娱乐", icon: "🎮" },
      { name: "通讯网络", icon: "📱" }, { name: "服饰装扮", icon: "👗" },
      { name: "美容护肤", icon: "💄" }, { name: "住房房租", icon: "🏠" },
      { name: "居家生活", icon: "🛋️" }, { name: "朋友社交", icon: "🍻" },
      { name: "旅行度假", icon: "✈️" }, { name: "萌宠猫狗", icon: "🐱" },
      { name: "医疗健康", icon: "💊" }, { name: "数码硬件", icon: "💻" }
    ],
    income: [
      { name: "工作薪资", icon: "💰" }, { name: "兼职外快", icon: "💼" },
      { name: "理财收益", icon: "📈" }, { name: "长辈红包", icon: "🧧" },
      { name: "其他收入", icon: "🪙" }
    ]
  };

  const sharkExpenseTabBtn = document.getElementById("sharkExpenseTabBtn");
  const sharkIncomeTabBtn = document.getElementById("sharkIncomeTabBtn");
  const sharkAmountDisplay = document.getElementById("sharkAmountDisplay");
  const sharkSelectedCatIcon = document.getElementById("sharkSelectedCatIcon");
  const sharkSelectedCatName = document.getElementById("sharkSelectedCatName");
  const sharkRemarkInput = document.getElementById("sharkRemarkInput");
  const sharkSubmitBtn = document.getElementById("sharkSubmitExpenseBtn");

  if (sharkExpenseTabBtn && sharkIncomeTabBtn) {
    sharkExpenseTabBtn.addEventListener("click", () => {
      sharkActiveType = "expense";
      sharkExpenseTabBtn.classList.add("active");
      sharkIncomeTabBtn.classList.remove("active");
      currentSelectedCategory = sharkCategories.expense[0];
      renderSharkCategories();
    });

    sharkIncomeTabBtn.addEventListener("click", () => {
      sharkActiveType = "income";
      sharkIncomeTabBtn.classList.add("active");
      sharkExpenseTabBtn.classList.remove("active");
      currentSelectedCategory = sharkCategories.income[0];
      renderSharkCategories();
    });
  }

  function selectSharkCategory(name) {
    const list = sharkCategories[sharkActiveType];
    const match = list.find(c => c.name.includes(name) || name.includes(c.name));
    if (match) {
      currentSelectedCategory = match;
      if (sharkSelectedCatIcon) sharkSelectedCatIcon.textContent = match.icon;
      if (sharkSelectedCatName) sharkSelectedCatName.textContent = match.name;
      renderSharkCategories();
    }
  }

  function renderSharkCategories() {
    const grid = document.getElementById("sharkCategoryGrid");
    if (!grid) return;
    grid.innerHTML = "";

    const list = sharkCategories[sharkActiveType] || [];
    list.forEach(cat => {
      const item = document.createElement("div");
      item.className = "shark-cat-item";
      if (cat.name === currentSelectedCategory.name) item.classList.add("active");

      item.innerHTML = `
        <div class="shark-cat-icon-circle">${cat.icon}</div>
        <span class="shark-cat-label">${cat.name}</span>
      `;

      item.addEventListener("click", () => {
        currentSelectedCategory = cat;
        if (sharkSelectedCatIcon) sharkSelectedCatIcon.textContent = cat.icon;
        if (sharkSelectedCatName) sharkSelectedCatName.textContent = cat.name;
        renderSharkCategories();
      });

      grid.appendChild(item);
    });
  }

  // 键盘点击逻辑
  document.querySelectorAll(".shark-key").forEach(k => {
    k.addEventListener("click", () => {
      const num = k.dataset.num;
      if (!num) return;

      if (num === "C") {
        currentKeypadInput = "0.00";
      } else if (num === "DEL") {
        if (currentKeypadInput.length <= 1 || currentKeypadInput === "0.00") {
          currentKeypadInput = "0.00";
        } else {
          currentKeypadInput = currentKeypadInput.slice(0, -1);
        }
      } else {
        if (currentKeypadInput === "0.00" || currentKeypadInput === "0") {
          currentKeypadInput = num === "." ? "0." : num;
        } else {
          currentKeypadInput += num;
        }
      }
      if (sharkAmountDisplay) sharkAmountDisplay.textContent = currentKeypadInput;
    });
  });

  if (sharkSubmitBtn) {
    sharkSubmitBtn.addEventListener("click", () => {
      let val = parseFloat(currentKeypadInput);
      if (isNaN(val) || val <= 0) {
        alert("请输入有效的金额哦～");
        return;
      }

      const now = new Date();
      const timeStr = `${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`;

      const newRecord = {
        id: Date.now(),
        type: sharkActiveType,
        category: currentSelectedCategory.name,
        icon: currentSelectedCategory.icon,
        item: currentSelectedCategory.name,
        amount: val,
        remark: sharkRemarkInput.value.trim() || "随手记录",
        time: timeStr
      };

      state.expenses.unshift(newRecord);
      saveState();

      currentKeypadInput = "0.00";
      if (sharkAmountDisplay) sharkAmountDisplay.textContent = "0.00";
      if (sharkRemarkInput) sharkRemarkInput.value = "";

      renderSharkExpenses();
      alert("✨ 记下一笔！生活账单已同步更新");
    });
  }

  function renderSharkExpenses() {
    const list = document.getElementById("sharkExpenseList");
    if (!list) return;
    list.innerHTML = "";

    let totalExp = 0;
    let totalInc = 0;

    state.expenses.forEach(exp => {
      if (exp.type === "income") totalInc += exp.amount;
      else totalExp += exp.amount;

      const li = document.createElement("li");
      li.className = "shark-item-card";

      const sign = exp.type === "income" ? "+¥" : "-¥";
      const cls = exp.type === "income" ? "inc" : "exp";

      li.innerHTML = `
        <div class="item-left">
          <div class="item-icon-circle">${exp.icon}</div>
          <div class="item-info">
            <span class="item-name">${exp.item}</span>
            <span class="item-remark">${exp.remark} · ${exp.time}</span>
          </div>
        </div>
        <div class="item-right">
          <span class="item-amount ${cls}">${sign}${exp.amount.toFixed(2)}</span>
          <button class="item-delete-btn" title="删除记录">✕</button>
        </div>
      `;

      li.querySelector(".item-delete-btn").addEventListener("click", () => {
        state.expenses = state.expenses.filter(x => x.id !== exp.id);
        saveState();
        renderSharkExpenses();
      });

      list.appendChild(li);
    });

    const expNum = document.getElementById("sharkTotalExpenseNum");
    if (expNum) expNum.textContent = totalExp.toFixed(2);
    const incNum = document.getElementById("sharkTotalIncomeNum");
    if (incNum) incNum.textContent = totalInc.toFixed(2);
  }

  // =========================================================================
  // 9. 触控平板休闲双游戏 (Sudoku & Doodle)
  // =========================================================================
  const tabSudokuBtn = document.getElementById("tabSudokuBtn");
  const tabDoodleBtn = document.getElementById("tabDoodleBtn");
  const viewSudoku = document.getElementById("viewSudokuGame");
  const viewDoodle = document.getElementById("viewDoodleGame");

  if (tabSudokuBtn && tabDoodleBtn) {
    tabSudokuBtn.addEventListener("click", () => {
      tabSudokuBtn.classList.add("active");
      tabDoodleBtn.classList.remove("active");
      if (viewSudoku) viewSudoku.style.display = "block";
      if (viewDoodle) viewDoodle.style.display = "none";
    });

    tabDoodleBtn.addEventListener("click", () => {
      tabDoodleBtn.classList.add("active");
      tabSudokuBtn.classList.remove("active");
      if (viewSudoku) viewSudoku.style.display = "none";
      if (viewDoodle) viewDoodle.style.display = "block";
      setTimeout(initDoodleCanvas, 50);
    });
  }

  // 极简数独核心算法
  let isSudokuInited = false;
  let currentSudokuCell = null;
  let sudokuGridData = [];

  const sudokuPuzzles = {
    easy: [
      "530070000600195000098000060800060003400803001700020006060000280000419005000080079",
      "003020600900305001001806400008102900700000008006708200002609500800203009005010300"
    ],
    medium: [
      "200080300060070084030500209000105408000000000402706000301007040720040060004010003"
    ],
    hard: [
      "000000000000003085001020000000507000004000100090000000500000073002010000000040009"
    ]
  };

  function initSudokuGame(diff = "easy") {
    isSudokuInited = true;
    const board = document.getElementById("sudokuBoard");
    if (!board) return;
    board.innerHTML = "";

    const list = sudokuPuzzles[diff] || sudokuPuzzles.easy;
    const puzzleStr = list[Math.floor(Math.random() * list.length)];

    sudokuGridData = [];
    currentSudokuCell = null;

    for (let i = 0; i < 81; i++) {
      const val = parseInt(puzzleStr[i], 10);
      const cell = document.createElement("div");
      cell.className = "sudoku-cell";
      const row = Math.floor(i / 9);
      if (row === 2 || row === 5) cell.classList.add("row-split");

      if (val !== 0) {
        cell.textContent = val;
        cell.classList.add("fixed");
        sudokuGridData[i] = { val: val, fixed: true, el: cell };
      } else {
        cell.textContent = "";
        sudokuGridData[i] = { val: 0, fixed: false, el: cell };
        cell.addEventListener("click", () => {
          document.querySelectorAll(".sudoku-cell").forEach(c => c.classList.remove("selected"));
          cell.classList.add("selected");
          currentSudokuCell = i;
        });
      }
      board.appendChild(cell);
    }
  }

  // 绑定数独数字键盘
  document.querySelectorAll(".sudoku-key").forEach(k => {
    k.addEventListener("click", () => {
      if (currentSudokuCell === null) return;
      const target = sudokuGridData[currentSudokuCell];
      if (!target || target.fixed) return;

      const num = k.dataset.val;
      if (num) {
        target.val = parseInt(num, 10);
        target.el.textContent = num;
      }
    });
  });

  const sudokuEraseBtn = document.getElementById("sudokuEraseBtn");
  if (sudokuEraseBtn) {
    sudokuEraseBtn.addEventListener("click", () => {
      if (currentSudokuCell === null) return;
      const target = sudokuGridData[currentSudokuCell];
      if (!target || target.fixed) return;
      target.val = 0;
      target.el.textContent = "";
    });
  }

  const newSudokuBtn = document.getElementById("newSudokuGameBtn");
  if (newSudokuBtn) {
    newSudokuBtn.addEventListener("click", () => {
      const activePill = document.querySelector(".diff-pill.active");
      initSudokuGame(activePill ? activePill.dataset.diff : "easy");
    });
  }

  document.querySelectorAll(".diff-pill").forEach(p => {
    p.addEventListener("click", () => {
      document.querySelectorAll(".diff-pill").forEach(x => x.classList.remove("active"));
      p.classList.add("active");
      initSudokuGame(p.dataset.diff);
    });
  });

  // 涂鸦小画板
  let isCanvasReady = false;
  function initDoodleCanvas() {
    if (isCanvasReady) return;
    const doodleCanvas = document.getElementById("doodleCanvas");
    if (!doodleCanvas) return;

    const ctx = doodleCanvas.getContext("2d");
    let isDrawing = false;
    ctx.lineWidth = 3;
    ctx.lineCap = "round";
    ctx.strokeStyle = "#6E5B4B";

    function getPos(e) {
      const rect = doodleCanvas.getBoundingClientRect();
      const scaleX = doodleCanvas.width / rect.width;
      const scaleY = doodleCanvas.height / rect.height;
      const clientX = e.clientX || (e.touches && e.touches[0].clientX);
      const clientY = e.clientY || (e.touches && e.touches[0].clientY);
      return { x: (clientX - rect.left) * scaleX, y: (clientY - rect.top) * scaleY };
    }

    function startDraw(e) {
      isDrawing = true;
      const pos = getPos(e);
      ctx.beginPath();
      ctx.moveTo(pos.x, pos.y);
    }
    function draw(e) {
      if (!isDrawing) return;
      const pos = getPos(e);
      ctx.lineTo(pos.x, pos.y);
      ctx.stroke();
    }
    function endDraw() { isDrawing = false; }

    doodleCanvas.addEventListener("mousedown", startDraw);
    doodleCanvas.addEventListener("mousemove", draw);
    window.addEventListener("mouseup", endDraw);

    const clearBtn = document.getElementById("clearCanvasBtn");
    if (clearBtn) {
      clearBtn.addEventListener("click", () => {
        ctx.clearRect(0, 0, doodleCanvas.width, doodleCanvas.height);
      });
    }

    const randomPromptBtn = document.getElementById("randomPromptBtn");
    const promptText = document.getElementById("doodlePromptText");
    const prompts = [
      "画一朵戴着草帽的向日葵 🌻", "画一只坐在咖啡杯里发呆的小猫咪 ☕🐱",
      "画一间飘着棉花糖浮云的树顶小屋 🌲", "画一张带着暖阳微笑的荷包蛋吐司 🍞🍳",
      "画一只在被窝里看星星的考拉 🐨✨"
    ];
    if (randomPromptBtn && promptText) {
      randomPromptBtn.addEventListener("click", () => {
        promptText.textContent = prompts[Math.floor(Math.random() * prompts.length)];
      });
    }
    isCanvasReady = true;
  }

  // =========================================================================
  // 10. 行程小秘书与出门前打扮逻辑 (Schedule & 1hr Pre-Event Routine)
  // =========================================================================
  const assistantPromptInput = document.getElementById("assistantPromptInput");
  const sendToAssistantBtn = document.getElementById("sendToAssistantBtn");
  const aiConfirmCard = document.getElementById("aiScheduleConfirmCard");

  if (sendToAssistantBtn && assistantPromptInput) {
    sendToAssistantBtn.addEventListener("click", handleScheduleParse);
    assistantPromptInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") handleScheduleParse();
    });
  }

  let tempParsedSchedule = null;

  async function handleScheduleParse() {
    const text = assistantPromptInput.value.trim();
    if (!text) return;

    sendToAssistantBtn.disabled = true;
    sendToAssistantBtn.textContent = "正在提炼...";

    try {
      const parsed = CozyAI.parseScheduleIntent(text);
      tempParsedSchedule = parsed;

      document.getElementById("parsedDateVal").textContent = parsed.date;
      document.getElementById("parsedTimeVal").textContent = parsed.time;
      document.getElementById("parsedEventVal").textContent = parsed.event;

      if (aiConfirmCard) aiConfirmCard.style.display = "block";
    } catch (e) {
      console.error(e);
    } finally {
      sendToAssistantBtn.disabled = false;
      sendToAssistantBtn.textContent = "告诉小助手";
    }
  }

  const confirmAddScheduleBtn = document.getElementById("confirmAddScheduleBtn");
  const dismissCardBtn = document.getElementById("dismissCardBtn");
  const rejectAddScheduleBtn = document.getElementById("rejectAddScheduleBtn");
  const modifyScheduleBox = document.getElementById("modifyScheduleBox");

  if (confirmAddScheduleBtn) {
    confirmAddScheduleBtn.addEventListener("click", () => {
      if (!tempParsedSchedule) return;
      state.todos.unshift({
        id: Date.now(),
        text: `${tempParsedSchedule.event} (${tempParsedSchedule.time})`,
        done: false,
        timeTag: tempParsedSchedule.date
      });
      saveState();
      renderTodoList();

      if (aiConfirmCard) aiConfirmCard.style.display = "none";
      assistantPromptInput.value = "";
      alert("✨ 盈盈已帮您把日程同步录入待办清单！");
    });
  }

  if (dismissCardBtn) {
    dismissCardBtn.addEventListener("click", () => {
      if (aiConfirmCard) aiConfirmCard.style.display = "none";
    });
  }

  if (rejectAddScheduleBtn) {
    rejectAddScheduleBtn.addEventListener("click", () => {
      if (modifyScheduleBox) modifyScheduleBox.style.display = "block";
    });
  }

  // 待办清单渲染
  function renderTodoList() {
    const list = document.getElementById("todoList");
    if (!list) return;
    list.innerHTML = "";

    let doneCount = 0;
    state.todos.forEach(item => {
      if (item.done) doneCount++;
      const li = document.createElement("li");
      li.className = "todo-item" + (item.done ? " done" : "");

      li.innerHTML = `
        <input type="checkbox" ${item.done ? "checked" : ""}>
        <span class="todo-text">${item.text}</span>
        <button class="item-delete-btn" style="margin-left:auto;">✕</button>
      `;

      li.querySelector("input").addEventListener("change", (e) => {
        item.done = e.target.checked;
        saveState();
        renderTodoList();
      });

      li.querySelector(".item-delete-btn").addEventListener("click", () => {
        state.todos = state.todos.filter(x => x.id !== item.id);
        saveState();
        renderTodoList();
      });

      list.appendChild(li);
    });

    const pill = document.getElementById("todoProgressPill");
    if (pill) pill.textContent = `已完成 ${doneCount}/${state.todos.length}`;
  }
  renderTodoList();

  const addTodoBtn = document.getElementById("addTodoBtn");
  const newTodoInput = document.getElementById("newTodoInput");
  if (addTodoBtn && newTodoInput) {
    addTodoBtn.addEventListener("click", () => {
      const val = newTodoInput.value.trim();
      if (!val) return;
      state.todos.unshift({ id: Date.now(), text: val, done: false, timeTag: "今日" });
      newTodoInput.value = "";
      saveState();
      renderTodoList();
    });
  }



  // =========================================================================
  // 11. 独立 Modal (动物选择与个人中心)
  // =========================================================================
  const profileModal = document.getElementById("profileModal");
  const memoryModal = document.getElementById("memoryModal");
  const animalPickerModal = document.getElementById("animalPickerModal");

  const openProfileBtn = document.getElementById("openProfileBtn");
  if (openProfileBtn) {
    openProfileBtn.addEventListener("click", () => {
      document.getElementById("userBirthdayInput").value = state.user.birthday || "2000-09-06";
      document.getElementById("userNameInput").value = state.user.name || "April";
      profileModal.classList.add("open");
    });
  }

  document.querySelectorAll(".modal-close-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      if (profileModal) profileModal.classList.remove("open");
      if (memoryModal) memoryModal.classList.remove("open");
      if (animalPickerModal) animalPickerModal.classList.remove("open");
    });
  });

  const saveProfileBtn = document.getElementById("saveProfileBtn");
  if (saveProfileBtn) {
    saveProfileBtn.addEventListener("click", () => {
      state.user.birthday = document.getElementById("userBirthdayInput").value;
      const rawName = document.getElementById("userNameInput").value || "April";
      state.user.name = rawName.replace(/[🌸🌺🌼🌷🌻]/g, '').trim() || "April";
      saveState();

      const nameLabel = document.getElementById("userNameLabel");
      if (nameLabel) nameLabel.textContent = state.user.name;

      profileModal.classList.remove("open");
      alert("✨ 个人中心设置保存成功！");
    });
  }
});
