/**
 * Portfolio Interactive Scripts
 * Author: Davin Aryyaguna Ahsan
 * Engine: Native JS + Web Audio API + Lucide Icons
 */

// 1. Initialize Lucide Icons & Lightweight Interactivity on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  if (window.lucide) {
    window.lucide.createIcons();
  }
  initWaveformBars();
  initScrollAndSpotlight();
  initWarungFlashlight();
  initUISoundDelegation();
  initRhythmBestScore();
});

// 2. Project Tab Switcher & Active Media State
let currentKingTab = 'gameplay';
let currentWarungTab = 'atm';
let warungFlashlightOn = false;

function switchProjectTab(project, tab) {
  if (project === 'warung') {
    currentWarungTab = tab;
    if (tab === 'trailer' && warungFlashlightOn) {
      setWarungFlashlight(false);
    }
    const tabs = ['atm', 'mechanics', 'audio', 'trailer'];
    tabs.forEach(t => {
      const btn = document.getElementById(`btn-warung-${t}`);
      const media = document.getElementById(`media-warung-${t}`);
      if (t === tab) {
        btn.className = "px-3 py-1.5 rounded-md font-medium bg-blue-600 text-white transition-all";
        media.classList.remove('hidden');
        media.classList.add('flex');
      } else {
        btn.className = "px-3 py-1.5 rounded-md font-medium text-slate-400 hover:text-slate-200 transition-all";
        media.classList.add('hidden');
        media.classList.remove('flex');
      }
    });
  } else if (project === 'king') {
    currentKingTab = tab;
    const tabs = ['gameplay', 'traps', 'level'];
    tabs.forEach(t => {
      const btn = document.getElementById(`btn-king-${t}`);
      const media = document.getElementById(`media-king-${t}`);
      if (t === tab) {
        btn.className = "px-3 py-1.5 rounded-md font-medium bg-blue-600 text-white transition-all";
        media.classList.remove('hidden');
        media.classList.add('flex');
      } else {
        btn.className = "px-3 py-1.5 rounded-md font-medium text-slate-400 hover:text-slate-200 transition-all";
        media.classList.add('hidden');
        media.classList.remove('flex');
      }
    });
  }
}

function openProjectLightbox(project, forceOpen = false) {
  if (project === 'king') {
    if (currentKingTab === 'traps') {
      openLightbox('My Dumb King Do Not: Trap Architecture', 'Engine mechanics & dynamic collision triggers', 'assets/gifs/king_traps.gif');
    } else if (currentKingTab === 'level') {
      openLightbox('My Dumb King Do Not: Multi-Tier Level Pacing', 'Obstacle progression, companion interactions & platforming flow', 'assets/gifs/king_level.gif');
    } else {
      openLightbox('My Dumb King Do Not: Gameplay Loop', '3D Side-scrolling platformer with comedic hazard interactions', 'assets/gifs/king_gameplay.gif');
    }
  } else if (project === 'warung') {
    if (!forceOpen && warungFlashlightOn) return;
    if (currentWarungTab === 'trailer') {
      openLightbox('Warung Mbok Inah: Trailer', 'Folklore psychological horror game trailer', 'https://www.youtube.com/embed/J00Y0hXkpRU?autoplay=1');
    } else if (currentWarungTab === 'mechanics') {
      openLightbox('Warung Mbok Inah: Gameplay Mechanics', 'Item grab interactions & toggleable flashlight', 'assets/gifs/warung_mechanics.gif');
    } else if (currentWarungTab === 'audio') {
      openLightbox('Warung Mbok Inah: Audio Spatialization', '3D distance rolloff & dynamic low-pass occlusion', 'assets/gifs/warung_audio.gif');
    } else {
      openLightbox('Warung Mbok Inah: Atmosphere Preview', 'Psychological Indonesian folklore exploration', 'assets/gifs/warung_atm.gif');
    }
  }
}

// 3. Web Audio API Engine & Assets Configuration
let audioCtx = null;

function getAudioContext() {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    audioCtx = new AudioContextClass();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

// Audio Assets Registry
const AUDIO_ASSETS = {
  tracks: {
    1: { title: 'Beat Carlboo: Main Menu & Results', file: 'assets/audio/music/bcb_mainmenu.wav', bpm: 95 },
    2: { title: 'Beat Carlboo: Official Trailer OST', file: 'assets/audio/music/bcb_trailer.wav', bpm: 132 },
    3: { title: 'Stage 01: Neon Pulse', file: 'assets/audio/music/bcb_song1.mp3', bpm: 128 },
    4: { title: 'Stage 02: Boss Rush Tempo', file: 'assets/audio/music/bcb_song2.mp3', bpm: 145 },
    5: { title: 'Stage 03: Velocity Shift', file: 'assets/audio/music/bcb_song3.mp3', bpm: 135 },
    6: { title: 'Stage 04: Cybernetic Groove', file: 'assets/audio/music/bcb_song4.mp3', bpm: 130 },
    7: { title: 'Stage 05: Midnight Overdrive', file: 'assets/audio/music/bcb_song5.mp3', bpm: 140 },
    8: { title: 'Stage 06: Final Ascent', file: 'assets/audio/music/bcb_song6.mp3', bpm: 150 }
  },
  horror: {
    ambient: { title: 'Menu & Ambience', file: 'assets/audio/music/horror_menu.mp3' },
    jumpscare: { title: 'Jumpscare Sting', file: 'assets/audio/sfx/jumpscare.mp3' },
    chase: { title: 'Entity Chase Theme', file: 'assets/audio/music/chase_music.mp3' }
  },
  sfx: {
    combo: 'assets/audio/sfx/combo.mp3',
    miss: 'assets/audio/sfx/miss.mp3',
    clear: 'assets/audio/sfx/clear.mp3',
    perfect: 'assets/audio/sfx/dialog_sound 1.wav',
    dialog1: 'assets/audio/sfx/dialog_sound 1.wav',
    dialog2: 'assets/audio/sfx/dialog_sound 2.wav'
  }
};

// 4. Horror Audio Engine (Warung Mboh Inah)
let currentHorrorAudio = null;
let currentHorrorType = null;

function stopHorrorAudio() {
  if (currentHorrorAudio) {
    currentHorrorAudio.pause();
    currentHorrorAudio.currentTime = 0;
    currentHorrorAudio = null;
  }
  ['ambient', 'jumpscare', 'chase'].forEach(t => {
    const icon = document.getElementById(`icon-horror-${t}`);
    if (icon) {
      icon.setAttribute('data-lucide', 'play');
    }
  });
  currentHorrorType = null;
  if (window.lucide) window.lucide.createIcons();
}

function playHorrorAudio(type) {
  // If the same ambient or chase track is currently playing, toggle off
  if (currentHorrorType === type && type !== 'jumpscare') {
    stopHorrorAudio();
    return;
  }

  // Stop soundtrack player to avoid audio clashing
  stopTrackPlayback();

  // Stop any previous horror audio
  stopHorrorAudio();

  const horrorData = AUDIO_ASSETS.horror[type] || AUDIO_ASSETS.horror.ambient;
  currentHorrorType = type;

  const audio = new Audio(horrorData.file);
  audio.volume = type === 'jumpscare' ? 0.9 : 0.75;
  currentHorrorAudio = audio;

  const icon = document.getElementById(`icon-horror-${type}`);
  if (icon) {
    icon.setAttribute('data-lucide', 'square');
    if (window.lucide) window.lucide.createIcons();
  }

  audio.onended = () => {
    if (currentHorrorAudio === audio) {
      stopHorrorAudio();
    }
  };

  audio.play().catch(err => {
    console.warn('Horror audio playback blocked or file error:', err);
    stopHorrorAudio();
    playHorrorSynthFallback(type);
  });
}

// Fallback Horror Synthesizer
function playHorrorSynthFallback(type) {
  const ctx = getAudioContext();
  const now = ctx.currentTime;

  if (type === 'ambient') {
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain = ctx.createGain();
    osc1.type = 'sawtooth';
    osc1.frequency.setValueAtTime(55, now);
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(58.5, now);
    gain.gain.setValueAtTime(0.01, now);
    gain.gain.linearRampToValueAtTime(0.2, now + 0.5);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 3.0);
    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(ctx.destination);
    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + 3.1);
    osc2.stop(now + 3.1);
  } else if (type === 'jumpscare') {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(800, now);
    osc.frequency.exponentialRampToValueAtTime(140, now + 0.8);
    gain.gain.setValueAtTime(0.4, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.9);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.95);
  } else {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(220, now);
    osc.frequency.linearRampToValueAtTime(180, now + 0.4);
    osc.frequency.linearRampToValueAtTime(240, now + 0.8);
    gain.gain.setValueAtTime(0.18, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 1.5);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 1.55);
  }
}

// 5. Tactile SFX Sampler (Beat Carlboo & Dialogue + Combo Engine)
let sfxCombo = 0;

const SFX_LABELS = {
  combo: { text: 'COMBO +1', color: 'text-emerald-400' },
  miss: { text: 'COMBO LOST!', color: 'text-red-400' },
  clear: { text: 'STAGE CLEAR!', color: 'text-amber-300' },
  perfect: { text: 'PERFECT!', color: 'text-blue-300' },
  dialog1: { text: 'BLIP!', color: 'text-indigo-300' },
  dialog2: { text: 'BLIP!', color: 'text-purple-300' }
};

function playSFX(type, triggerEl) {
  const filePath = AUDIO_ASSETS.sfx[type];
  if (filePath) {
    const sfx = new Audio(filePath);
    sfx.volume = 0.85;
    sfx.play().catch(err => {
      console.warn('SFX audio play failed, running fallback synth:', err);
      playSFXSynthFallback(type);
    });
  } else {
    playSFXSynthFallback(type);
  }

  // Update arcade combo feedback on sampler buttons
  const padEl = triggerEl || document.querySelector(`[data-sfx="${type}"]`);
  const comboEl = document.getElementById('sfx-combo-count');
  const pillEl = document.getElementById('sfx-combo-pill');

  if (type === 'miss') {
    sfxCombo = 0;
  } else if (SFX_LABELS[type]) {
    sfxCombo++;
  }

  if (comboEl) comboEl.textContent = sfxCombo;
  if (pillEl) {
    pillEl.className = sfxCombo > 0
      ? 'px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/40 text-[11px] font-mono text-emerald-400 scale-110 transition-transform'
      : 'px-2 py-0.5 rounded bg-surface-base border border-surface-border text-[11px] font-mono text-slate-400 transition-transform';
    setTimeout(() => pillEl.classList.remove('scale-110'), 140);
  }

  if (padEl && SFX_LABELS[type]) {
    const label = sfxCombo > 1 && type !== 'miss' ? `${SFX_LABELS[type].text} (${sfxCombo}x)` : SFX_LABELS[type].text;
    spawnFloatingTag(padEl, label, SFX_LABELS[type].color);
  }
}

// Fallback SFX Synthesizer
function playSFXSynthFallback(type) {
  const ctx = getAudioContext();
  const now = ctx.currentTime;

  if (type === 'combo') {
    const chord = [523.25, 659.25, 783.99, 1046.50];
    chord.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + idx * 0.05);
      gain.gain.setValueAtTime(0.15, now + idx * 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.05 + 0.18);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + idx * 0.05);
      osc.stop(now + idx * 0.05 + 0.2);
    });
  } else if (type === 'miss') {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(150, now);
    osc.frequency.linearRampToValueAtTime(80, now + 0.25);
    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.3);
  } else if (type === 'clear') {
    const arpeggio = [440, 554.37, 659.25, 880];
    arpeggio.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.08);
      gain.gain.setValueAtTime(0.18, now + idx * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.4);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + idx * 0.08);
      osc.stop(now + idx * 0.08 + 0.45);
    });
  } else {
    // Perfect / Dialogue Hit
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, now);
    osc.frequency.exponentialRampToValueAtTime(1760, now + 0.15);
    gain.gain.setValueAtTime(0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.22);
  }
}

// 6. Waveform Generator & Soundtrack Player Engine
const waveformContainer = document.getElementById('waveform-container');
const BAR_COUNT = 36;

function initWaveformBars() {
  if (!waveformContainer) return;
  waveformContainer.innerHTML = '';
  for (let i = 0; i < BAR_COUNT; i++) {
    const bar = document.createElement('div');
    bar.className = 'w-1.5 flex-1 rounded-full bg-slate-700 transition-colors';
    bar.style.height = `${Math.floor(Math.random() * 40) + 15}%`;
    waveformContainer.appendChild(bar);
  }
}

let currentPlayingTrack = null;
let currentTrackAudio = null;

function stopTrackPlayback() {
  if (currentTrackAudio) {
    currentTrackAudio.pause();
    currentTrackAudio.currentTime = 0;
    currentTrackAudio = null;
  }

  const titleEl = document.getElementById('player-active-title');
  const timeEl = document.getElementById('player-active-time');
  const fillEl = document.getElementById('player-progress-fill');
  const discEl = document.getElementById('player-disc-icon');
  const bars = waveformContainer ? waveformContainer.children : [];

  if (titleEl) titleEl.textContent = "Select a track to audition";
  if (timeEl) timeEl.textContent = "0:00 / 0:00";
  if (fillEl) fillEl.style.width = "0%";
  if (discEl) discEl.style.animationDuration = "8s";

  for (let b of bars) {
    b.classList.remove('bar-anim', 'bg-blue-400', 'bg-blue-500/40', 'bg-blue-500');
    b.classList.add('bg-slate-700');
    b.style.height = `${Math.floor(Math.random() * 40) + 15}%`;
  }

  // Reset all 8 track play button styles
  for (let num = 1; num <= 8; num++) {
    const btn = document.getElementById(`play-btn-${num}`);
    if (btn) {
      btn.innerHTML = '<i data-lucide="play" class="w-4 h-4 ml-0.5"></i>';
      btn.className = "w-9 h-9 rounded-full bg-surface-card hover:bg-surface-hover border border-surface-border text-slate-300 hover:text-white flex items-center justify-center shrink-0 shadow-sm transition-transform active:scale-95";
    }
  }

  currentPlayingTrack = null;
  if (window.lucide) window.lucide.createIcons();
}

function seekTrackFromWaveform(event) {
  if (!currentTrackAudio || !currentTrackAudio.duration || !isFinite(currentTrackAudio.duration)) return;
  const target = event.currentTarget;
  const rect = target.getBoundingClientRect();
  if (!rect.width) return;
  const ratio = Math.min(1, Math.max(0, (event.clientX - rect.left) / rect.width));
  currentTrackAudio.currentTime = ratio * currentTrackAudio.duration;
}

function formatAudioTime(seconds) {
  if (isNaN(seconds) || seconds < 0) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s < 10 ? '0' : ''}${s}`;
}

function playTrack(trackNumber, trackTitle) {
  const trackInfo = AUDIO_ASSETS.tracks[trackNumber];
  const titleToDisplay = trackTitle || (trackInfo ? trackInfo.title : `Track ${trackNumber}`);
  const titleEl = document.getElementById('player-active-title');
  const timeEl = document.getElementById('player-active-time');
  const fillEl = document.getElementById('player-progress-fill');
  const discEl = document.getElementById('player-disc-icon');
  const bars = waveformContainer ? waveformContainer.children : [];

  // Toggle off if currently playing
  if (currentPlayingTrack === trackNumber) {
    stopTrackPlayback();
    return;
  }

  // Stop horror audio to prevent clash
  stopHorrorAudio();

  // Reset any other track playing
  stopTrackPlayback();

  currentPlayingTrack = trackNumber;

  const activeBtn = document.getElementById(`play-btn-${trackNumber}`);
  if (activeBtn) {
    activeBtn.innerHTML = '<i data-lucide="square" class="w-4 h-4 text-white"></i>';
    activeBtn.className = "w-9 h-9 rounded-full bg-blue-600 hover:bg-blue-500 text-white flex items-center justify-center shrink-0 shadow-sm transition-transform active:scale-95";
  }

  if (titleEl) titleEl.textContent = `Auditioning: ${titleToDisplay}`;
  const bpm = (trackInfo && trackInfo.bpm) || 120;
  const beatDurationSec = (60 / bpm);
  if (discEl) discEl.style.animationDuration = `${(beatDurationSec * 4).toFixed(2)}s`;

  for (let i = 0; i < bars.length; i++) {
    const b = bars[i];
    b.classList.add('bar-anim', 'bg-blue-500/40');
    b.classList.remove('bg-slate-700');
    b.style.animationDuration = `${(beatDurationSec * (0.9 + (i % 3) * 0.25)).toFixed(2)}s`;
    b.style.animationDelay = `${((i % 6) * 0.08).toFixed(2)}s`;
  }

  if (trackInfo && trackInfo.file) {
    const audio = new Audio(trackInfo.file);
    audio.volume = 0.8;
    currentTrackAudio = audio;

    audio.ontimeupdate = () => {
      if (!audio) return;
      const dur = audio.duration;
      if (timeEl) {
        timeEl.textContent = `${formatAudioTime(audio.currentTime)} / ${formatAudioTime(dur)}`;
      }
      if (dur && isFinite(dur)) {
        const pct = Math.min(100, (audio.currentTime / dur) * 100);
        if (fillEl) fillEl.style.width = `${pct.toFixed(1)}%`;
        const activeBars = Math.round((pct / 100) * bars.length);
        for (let i = 0; i < bars.length; i++) {
          if (i < activeBars) {
            bars[i].classList.add('bg-blue-400');
            bars[i].classList.remove('bg-blue-500/40');
          } else {
            bars[i].classList.add('bg-blue-500/40');
            bars[i].classList.remove('bg-blue-400');
          }
        }
      }
    };

    audio.onended = () => {
      stopTrackPlayback();
    };

    audio.play().catch(err => {
      console.warn("Track playback failed, falling back to synth:", err);
      playSynthGrooveFallback(trackNumber);
    });
  }

  if (window.lucide) window.lucide.createIcons();
}

function playSynthGrooveFallback(trackNumber) {
  const ctx = getAudioContext();
  const now = ctx.currentTime;
  const baseFreq = trackNumber === 1 ? 261.63 : trackNumber === 2 ? 329.63 : 220.00;
  [0, 0.2, 0.4, 0.6, 0.8].forEach((timeOffset, i) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = trackNumber % 2 === 0 ? 'sawtooth' : 'triangle';
    osc.frequency.setValueAtTime(baseFreq * (1 + (i % 3) * 0.25), now + timeOffset);
    gain.gain.setValueAtTime(0.12, now + timeOffset);
    gain.gain.exponentialRampToValueAtTime(0.001, now + timeOffset + 0.18);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now + timeOffset);
    osc.stop(now + timeOffset + 0.2);
  });
}

// 7. Lightbox Modal Handlers
function openLightbox(title, subtitle, mediaSrc) {
  document.getElementById('lightbox-title').textContent = title;
  document.getElementById('lightbox-subtitle').textContent = subtitle;
  const imgEl = document.getElementById('lightbox-img');
  const videoEl = document.getElementById('lightbox-video');
  const iframeEl = document.getElementById('lightbox-iframe');
  const placeholderEl = document.getElementById('lightbox-placeholder');

  // Reset elements
  if (imgEl) { imgEl.src = ''; imgEl.classList.add('hidden'); }
  if (videoEl) { videoEl.pause(); videoEl.src = ''; videoEl.classList.add('hidden'); }
  if (iframeEl) { iframeEl.src = ''; iframeEl.classList.add('hidden'); }
  if (placeholderEl) placeholderEl.classList.add('hidden');

  if (mediaSrc) {
    if (mediaSrc.includes('youtube.com') || mediaSrc.includes('youtu.be')) {
      if (window.location.protocol === 'file:') {
        // file:// strips Referer header, triggering YouTube Error 153. Direct to YouTube video.
        const vidMatch = mediaSrc.match(/(?:embed\/|v=|\/)([a-zA-Z0-9_-]{11})/);
        const ytid = vidMatch ? vidMatch[1] : '';
        window.open(ytid ? `https://www.youtube.com/watch?v=${ytid}` : mediaSrc, '_blank');
        return;
      }
      if (iframeEl) {
        iframeEl.src = mediaSrc;
        iframeEl.classList.remove('hidden');
      }
    } else if (mediaSrc.endsWith('.mp4') || mediaSrc.endsWith('.webm')) {
      if (videoEl) {
        videoEl.src = mediaSrc;
        videoEl.classList.remove('hidden');
        videoEl.play().catch(() => {});
      }
    } else if (imgEl) {
      imgEl.src = mediaSrc;
      imgEl.classList.remove('hidden');
      imgEl.onerror = () => {
        imgEl.classList.add('hidden');
        if (placeholderEl) placeholderEl.classList.remove('hidden');
      };
    }
  } else {
    if (placeholderEl) placeholderEl.classList.remove('hidden');
  }

  const modal = document.getElementById('lightbox-modal');
  modal.classList.remove('hidden');
  modal.classList.add('flex');
}

function closeLightbox() {
  const imgEl = document.getElementById('lightbox-img');
  const videoEl = document.getElementById('lightbox-video');
  const iframeEl = document.getElementById('lightbox-iframe');
  if (imgEl) { imgEl.src = ''; imgEl.classList.add('hidden'); }
  if (videoEl) { videoEl.pause(); videoEl.src = ''; videoEl.classList.add('hidden'); }
  if (iframeEl) { iframeEl.src = ''; iframeEl.classList.add('hidden'); }

  const modal = document.getElementById('lightbox-modal');
  modal.classList.add('hidden');
  modal.classList.remove('flex');
}

// 8. Technical Case Study Modal Handlers
function openCaseStudyModal(id) {
  const modal = document.getElementById('case-study-modal');
  modal.classList.remove('hidden');
  modal.classList.add('flex');
}

function closeCaseStudyModal() {
  const modal = document.getElementById('case-study-modal');
  modal.classList.add('hidden');
  modal.classList.remove('flex');
}

// 9. Multimedia Gallery Filter
function filterMultimedia(category) {
  const tabs = ['all', 'motion', 'poster'];
  tabs.forEach(tab => {
    const btn = document.getElementById(`mm-tab-${tab}`);
    if (!btn) return;
    if (tab === category) {
      btn.className = "px-3.5 py-1.5 rounded-lg bg-blue-600 text-white font-medium transition-all";
    } else {
      btn.className = "px-3.5 py-1.5 rounded-lg bg-surface-card hover:bg-surface-hover border border-surface-border text-slate-400 hover:text-white transition-all";
    }
  });

  const items = document.querySelectorAll('.mm-item');
  items.forEach(item => {
    if (category === 'all' || item.classList.contains(category)) {
      item.classList.remove('hidden');
    } else {
      item.classList.add('hidden');
    }
  });
}

// Global Keyboard Controls (Modals, SFX Keys 1-6, Mini Rhythm Spacebar)
document.addEventListener('keydown', (e) => {
  const tag = e.target && e.target.tagName;
  if (tag === 'INPUT' || tag === 'TEXTAREA' || e.ctrlKey || e.metaKey || e.altKey) return;

  if (e.key === 'Escape') {
    closeLightbox();
    closeCaseStudyModal();
    if (rhythmGameActive) stopRhythmGame();
    return;
  }

  // Trigger SFX Sampler pads with keys 1-6
  const keyMap = { '1': 'combo', '2': 'miss', '3': 'clear', '4': 'perfect', '5': 'dialog1', '6': 'dialog2' };
  if (keyMap[e.key]) {
    playSFX(keyMap[e.key]);
    return;
  }

  // Mini Rhythm Challenge Hit with Spacebar
  if (e.code === 'Space' && rhythmGameActive) {
    e.preventDefault();
    hitRhythmBeat();
  }
});

// 10. YouTube Lazy Embed / Facade Player
function playVideoFacade(el, videoId, title) {
  const container = el.parentElement;
  if (!container) return;

  // file:// protocol strips Referer and triggers YouTube Error 153.
  if (window.location.protocol === 'file:') {
    window.open(`https://www.youtube.com/watch?v=${videoId}`, '_blank');
    return;
  }

  container.innerHTML = `
    <iframe 
      class="w-full h-full" 
      src="https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0" 
      title="${title}" 
      frameborder="0" 
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
      referrerpolicy="strict-origin-when-cross-origin" 
      allowfullscreen>
    </iframe>
  `;
}

// 11. Shared Floating Arcade Popup Helper
function spawnFloatingTag(container, text, colorClass = 'text-white') {
  if (!container) return;
  const tag = document.createElement('span');
  tag.className = `arcade-float-tag ${colorClass}`;
  tag.textContent = text;
  container.appendChild(tag);
  const cleanup = () => tag.remove();
  tag.addEventListener('animationend', cleanup, { once: true });
  setTimeout(cleanup, 800);
}

// 12. Lightweight Scroll Progress, One-Shot Reveal & Hero Spotlight
function initScrollAndSpotlight() {
  const progressBar = document.getElementById('scroll-progress');
  if (progressBar) {
    window.addEventListener('scroll', () => {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const pct = docHeight > 0 ? (window.scrollY / docHeight) * 100 : 0;
      progressBar.style.width = `${Math.min(100, Math.max(0, pct))}%`;
    }, { passive: true });
  }

  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealEls.length) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal-visible');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08 });
    revealEls.forEach(el => observer.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('reveal-visible'));
  }

  const hero = document.getElementById('home');
  if (hero) {
    hero.addEventListener('mousemove', (e) => {
      const rect = hero.getBoundingClientRect();
      hero.style.setProperty('--mx', `${e.clientX - rect.left}px`);
      hero.style.setProperty('--my', `${e.clientY - rect.top}px`);
    }, { passive: true });
  }
}

// 13. Toggleable Zero-Asset Synthesized UI Sound Effects
let uiSfxEnabled = false;

function toggleUISound() {
  uiSfxEnabled = !uiSfxEnabled;
  const btn = document.getElementById('btn-ui-sfx');
  if (btn) {
    btn.className = uiSfxEnabled
      ? 'inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md border border-blue-500/50 bg-blue-600/15 hover:bg-blue-600/25 text-[11px] font-mono text-blue-300 transition-colors'
      : 'inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md border border-slate-700 bg-surface-card hover:bg-surface-hover text-[11px] font-mono text-slate-400 transition-colors';
    btn.innerHTML = uiSfxEnabled
      ? '<i data-lucide="volume-2" id="icon-ui-sfx" class="w-3.5 h-3.5 text-blue-400"></i><span id="label-ui-sfx" class="hidden sm:inline">SFX: ON</span>'
      : '<i data-lucide="volume-x" id="icon-ui-sfx" class="w-3.5 h-3.5 text-slate-500"></i><span id="label-ui-sfx" class="hidden sm:inline">SFX: OFF</span>';
    if (window.lucide) window.lucide.createIcons();
  }
  if (uiSfxEnabled) playUISound('toggleOn');
}

function playUISound(kind) {
  if (!uiSfxEnabled && kind !== 'flashlight') return;
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    if (kind === 'toggleOn') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(520, now);
      osc.frequency.exponentialRampToValueAtTime(780, now + 0.08);
      gain.gain.setValueAtTime(0.06, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
      osc.start(now);
      osc.stop(now + 0.11);
    } else if (kind === 'flashlight') {
      osc.type = 'square';
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.exponentialRampToValueAtTime(90, now + 0.035);
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.045);
      osc.start(now);
      osc.stop(now + 0.05);
    } else {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(kind === 'hover' ? 620 : 440, now);
      osc.frequency.exponentialRampToValueAtTime(kind === 'hover' ? 700 : 300, now + 0.025);
      gain.gain.setValueAtTime(0.028, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);
      osc.start(now);
      osc.stop(now + 0.035);
    }
  } catch (_) {}
}

function initUISoundDelegation() {
  let lastHoverEl = null;
  document.addEventListener('pointerover', (e) => {
    if (!uiSfxEnabled) return;
    const target = e.target.closest('button, nav a');
    if (target && target !== lastHoverEl && !target.disabled) {
      lastHoverEl = target;
      playUISound('hover');
    } else if (!target) {
      lastHoverEl = null;
    }
  }, { passive: true });
}

// 14. Warung Mbok Inah Interactive Flashlight Inspection
function setWarungFlashlight(state) {
  warungFlashlightOn = state;
  const overlay = document.getElementById('warung-flashlight-overlay');
  const hint = document.getElementById('warung-flashlight-hint');
  const btn = document.getElementById('btn-warung-flashlight');

  if (state && currentWarungTab === 'trailer') {
    switchProjectTab('warung', 'atm');
  }

  if (overlay) overlay.classList.toggle('hidden', !state);
  if (hint) hint.classList.toggle('hidden', !state);
  if (btn) {
    btn.className = state
      ? 'inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md border border-amber-400/60 bg-amber-500/20 text-[11px] font-mono text-amber-300 shadow-sm shadow-amber-500/20 transition-all'
      : 'inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md border border-surface-border bg-surface-base hover:bg-surface-hover text-[11px] font-mono text-amber-400 transition-all';
  }
}

function toggleWarungFlashlight() {
  playUISound('flashlight');
  setWarungFlashlight(!warungFlashlightOn);
}

function initWarungFlashlight() {
  const frame = document.getElementById('warung-media-frame');
  const overlay = document.getElementById('warung-flashlight-overlay');
  if (!frame || !overlay) return;

  const updateBeam = (clientX, clientY) => {
    if (!warungFlashlightOn) return;
    const rect = frame.getBoundingClientRect();
    const x = Math.min(rect.width, Math.max(0, clientX - rect.left));
    const y = Math.min(rect.height, Math.max(0, clientY - rect.top));
    overlay.style.setProperty('--fx', `${x}px`);
    overlay.style.setProperty('--fy', `${y}px`);
  };

  frame.addEventListener('mousemove', (e) => updateBeam(e.clientX, e.clientY), { passive: true });
  frame.addEventListener('touchmove', (e) => {
    if (e.touches && e.touches[0]) updateBeam(e.touches[0].clientX, e.touches[0].clientY);
  }, { passive: true });
}

// 15. My Dumb King Do Not Interactive Hazard Simulator
let kingHitCount = 0;

function triggerKingHazard(btnEl, type) {
  kingHitCount++;
  const countEl = document.getElementById('king-hit-count');
  const badgeEl = document.getElementById('king-casualties-badge');
  if (countEl) countEl.textContent = kingHitCount;
  if (badgeEl) {
    badgeEl.classList.add('scale-110');
    setTimeout(() => badgeEl.classList.remove('scale-110'), 140);
  }

  const config = {
    hole:  { anim: 'anim-hazard-fall',  tag: 'FELL!',    color: 'text-sky-300' },
    arrow: { anim: 'anim-hazard-pop',   tag: 'SNIPED!',  color: 'text-amber-300' },
    rock:  { anim: 'anim-hazard-shake', tag: 'SQUISHED!', color: 'text-orange-400' },
    spike: { anim: 'anim-hazard-pop',   tag: 'OUCH!',    color: 'text-red-400' }
  };
  const item = config[type] || config.spike;

  btnEl.classList.remove('anim-hazard-fall', 'anim-hazard-shake', 'anim-hazard-pop');
  void btnEl.offsetWidth; // Force reflow for snappy re-trigger
  btnEl.classList.add(item.anim);

  if (type === 'arrow') {
    const arrow = document.createElement('span');
    arrow.className = 'arrow-streak';
    btnEl.appendChild(arrow);
    setTimeout(() => arrow.remove(), 350);
  }

  spawnFloatingTag(btnEl, kingHitCount % 10 === 0 ? 'POOR KING!' : item.tag, item.color);
  playHazardSynth(type);
}

function playHazardSynth(type) {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    if (type === 'hole') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(520, now);
      osc.frequency.exponentialRampToValueAtTime(110, now + 0.35);
      gain.gain.setValueAtTime(0.14, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.36);
      osc.start(now);
      osc.stop(now + 0.38);
    } else if (type === 'arrow') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(980, now);
      osc.frequency.exponentialRampToValueAtTime(280, now + 0.14);
      gain.gain.setValueAtTime(0.14, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.16);
      osc.start(now);
      osc.stop(now + 0.17);
    } else if (type === 'rock') {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(115, now);
      osc.frequency.linearRampToValueAtTime(52, now + 0.28);
      gain.gain.setValueAtTime(0.16, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
      osc.start(now);
      osc.stop(now + 0.32);
    } else {
      osc.type = 'square';
      osc.frequency.setValueAtTime(660, now);
      osc.frequency.exponentialRampToValueAtTime(320, now + 0.12);
      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);
      osc.start(now);
      osc.stop(now + 0.15);
    }
  } catch (_) {}
}

// 16. Playable Mini Beat Sync Challenge (Beat Carlboo)
const RHYTHM_TARGET_PCT = 15;
const RHYTHM_TRAVEL_MS = 1400;
const RHYTHM_ROUND_MS = 20000;
const RHYTHM_COLORS = ['#3b82f6', '#a855f7', '#10b981', '#f59e0b'];

let rhythmGameActive = false;
let rhythmScore = 0;
let rhythmCombo = 0;
let rhythmBest = 0;
let rhythmNotes = [];
let rhythmRafId = null;
let rhythmStartTime = 0;
let rhythmLastSpawn = 0;

function initRhythmBestScore() {
  try {
    const saved = parseInt(localStorage.getItem('davin_rhythm_best') || '0', 10);
    if (!isNaN(saved) && saved > 0) {
      rhythmBest = saved;
      const bestEl = document.getElementById('rhythm-best');
      if (bestEl) bestEl.textContent = rhythmBest;
    }
  } catch (_) {}
}

function saveRhythmBestScore() {
  if (rhythmScore <= rhythmBest) return;
  rhythmBest = rhythmScore;
  const bestEl = document.getElementById('rhythm-best');
  if (bestEl) bestEl.textContent = rhythmBest;
  try {
    localStorage.setItem('davin_rhythm_best', String(rhythmBest));
  } catch (_) {}
}

function toggleRhythmGame() {
  if (rhythmGameActive) {
    stopRhythmGame();
  } else {
    startRhythmGame();
  }
}

function startRhythmGame() {
  rhythmGameActive = true;
  rhythmScore = 0;
  rhythmCombo = 0;
  rhythmNotes = [];

  const scoreEl = document.getElementById('rhythm-score');
  const overlayEl = document.getElementById('rhythm-status-overlay');
  const notesLayer = document.getElementById('rhythm-notes-layer');
  const hitBtn = document.getElementById('btn-rhythm-hit');
  const toggleBtn = document.getElementById('btn-rhythm-toggle');
  const dotEl = document.getElementById('rhythm-live-dot');

  if (scoreEl) scoreEl.textContent = '0';
  if (notesLayer) notesLayer.innerHTML = '';
  if (overlayEl) overlayEl.classList.add('hidden');
  if (hitBtn) hitBtn.disabled = false;
  if (dotEl) dotEl.classList.add('animate-ping');
  if (toggleBtn) {
    toggleBtn.className = 'px-3.5 py-2 rounded-lg bg-red-600/80 hover:bg-red-500 text-xs font-mono font-medium text-white flex items-center gap-1.5 transition-all active:scale-95';
    toggleBtn.innerHTML = '<i data-lucide="square" class="w-3.5 h-3.5"></i><span>Stop</span>';
    if (window.lucide) window.lucide.createIcons();
  }

  rhythmStartTime = performance.now();
  rhythmLastSpawn = rhythmStartTime - 600;
  rhythmRafId = requestAnimationFrame(rhythmGameLoop);
}

function stopRhythmGame(completed = false) {
  rhythmGameActive = false;
  if (rhythmRafId) {
    cancelAnimationFrame(rhythmRafId);
    rhythmRafId = null;
  }

  saveRhythmBestScore();

  const overlayEl = document.getElementById('rhythm-status-overlay');
  const notesLayer = document.getElementById('rhythm-notes-layer');
  const hitBtn = document.getElementById('btn-rhythm-hit');
  const toggleBtn = document.getElementById('btn-rhythm-toggle');
  const dotEl = document.getElementById('rhythm-live-dot');

  rhythmNotes = [];
  if (notesLayer) notesLayer.innerHTML = '';
  if (hitBtn) hitBtn.disabled = true;
  if (dotEl) dotEl.classList.remove('animate-ping');

  if (overlayEl) {
    overlayEl.classList.remove('hidden');
    overlayEl.textContent = completed
      ? `Round Complete! Score: ${rhythmScore} (Best: ${rhythmBest})`
      : 'Press Space or Hit Beat when notes align!';
  }
  if (toggleBtn) {
    toggleBtn.className = 'px-3.5 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-xs font-mono font-medium text-white flex items-center gap-1.5 transition-all active:scale-95';
    toggleBtn.innerHTML = '<i data-lucide="play" class="w-3.5 h-3.5"></i><span>Play Mini-Game</span>';
    if (window.lucide) window.lucide.createIcons();
  }

  if (completed && rhythmScore > 0) {
    playSFXSynthFallback('clear');
  }
}

function playRhythmTick() {
  // Play subtle Web Audio metronome tick only if no track is already playing
  if (currentTrackAudio && !currentTrackAudio.paused) return;
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(140, now);
    osc.frequency.exponentialRampToValueAtTime(48, now + 0.08);
    gain.gain.setValueAtTime(0.16, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.1);
  } catch (_) {}
}

function rhythmGameLoop(now) {
  if (!rhythmGameActive) return;

  const elapsed = now - rhythmStartTime;
  if (elapsed >= RHYTHM_ROUND_MS) {
    stopRhythmGame(true);
    return;
  }

  const activeTrack = currentPlayingTrack && AUDIO_ASSETS.tracks[currentPlayingTrack];
  const bpm = (activeTrack && activeTrack.bpm) ? activeTrack.bpm : 120;
  const beatInterval = 60000 / bpm;

  // Stop spawning notes in final 1.2s so remaining notes can reach target
  if (elapsed < RHYTHM_ROUND_MS - 1200 && now - rhythmLastSpawn >= beatInterval) {
    rhythmLastSpawn = now;
    spawnRhythmNote(now);
    playRhythmTick();
  }

  const notesLayer = document.getElementById('rhythm-notes-layer');
  for (let i = rhythmNotes.length - 1; i >= 0; i--) {
    const note = rhythmNotes[i];
    const progress = (now - note.spawnedAt) / RHYTHM_TRAVEL_MS;
    const xPct = 96 - progress * (96 - RHYTHM_TARGET_PCT + 14);
    note.x = xPct;
    note.el.style.left = `${xPct}%`;

    if (xPct < 3) {
      note.el.remove();
      rhythmNotes.splice(i, 1);
      rhythmCombo = 0;
      if (notesLayer) spawnFloatingTag(notesLayer.parentElement, 'MISS', 'text-red-400');
    }
  }

  rhythmRafId = requestAnimationFrame(rhythmGameLoop);
}

function spawnRhythmNote(now) {
  const notesLayer = document.getElementById('rhythm-notes-layer');
  if (!notesLayer) return;
  const el = document.createElement('div');
  const color = RHYTHM_COLORS[Math.floor(Math.random() * RHYTHM_COLORS.length)];
  el.className = 'rhythm-note';
  el.style.backgroundColor = color;
  el.style.color = color;
  el.style.left = '96%';
  notesLayer.appendChild(el);
  rhythmNotes.push({ spawnedAt: now, x: 96, el });
}

function hitRhythmBeat() {
  if (!rhythmGameActive) return;
  const lane = document.getElementById('rhythm-lane');
  const targetZone = document.getElementById('rhythm-target-zone');
  const scoreEl = document.getElementById('rhythm-score');

  let bestIdx = -1;
  let bestDist = Infinity;
  for (let i = 0; i < rhythmNotes.length; i++) {
    const dist = Math.abs(rhythmNotes[i].x - RHYTHM_TARGET_PCT);
    if (dist < bestDist) {
      bestDist = dist;
      bestIdx = i;
    }
  }

  if (targetZone) {
    targetZone.classList.add('scale-110', 'bg-blue-500/30');
    setTimeout(() => targetZone.classList.remove('scale-110', 'bg-blue-500/30'), 90);
  }

  if (bestIdx !== -1 && bestDist <= 11) {
    const hitNote = rhythmNotes[bestIdx];
    hitNote.el.remove();
    rhythmNotes.splice(bestIdx, 1);

    const isPerfect = bestDist <= 5.5;
    rhythmCombo++;
    const points = (isPerfect ? 100 : 50) + Math.min(50, rhythmCombo * 5);
    rhythmScore += points;
    if (scoreEl) scoreEl.textContent = rhythmScore;
    saveRhythmBestScore();

    if (lane) {
      const label = isPerfect ? `PERFECT! +${points}` : `GOOD +${points}`;
      spawnFloatingTag(lane, label, isPerfect ? 'text-emerald-300' : 'text-blue-300');
    }
    playSFXSynthFallback(isPerfect ? 'perfect' : 'combo');
  } else {
    rhythmCombo = 0;
    if (lane) spawnFloatingTag(lane, 'EARLY / MISS', 'text-red-400');
    playSFXSynthFallback('miss');
  }
}
