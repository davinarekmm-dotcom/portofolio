/**
 * Portfolio Interactive Scripts
 * Author: Davin Aryyaguna Ahsan
 * Engine: Native JS + Web Audio API + Lucide Icons
 */

// 1. Initialize Lucide Icons on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  if (window.lucide) {
    window.lucide.createIcons();
  }
  initWaveformBars();
});

// 2. Project Tab Switcher & Active Media State
let currentKingTab = 'gameplay';
let currentWarungTab = 'atm';

function switchProjectTab(project, tab) {
  if (project === 'warung') {
    currentWarungTab = tab;
    const tabs = ['atm', 'mechanics', 'audio'];
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

function openProjectLightbox(project) {
  if (project === 'king') {
    if (currentKingTab === 'traps') {
      openLightbox('My Dumb King Do Not: Trap Architecture', 'Engine mechanics & dynamic collision triggers', 'assets/gifs/king_traps.gif');
    } else if (currentKingTab === 'level') {
      openLightbox('My Dumb King Do Not: Multi-Tier Level Pacing', 'Obstacle progression, companion interactions & platforming flow', 'assets/gifs/king_level.gif');
    } else {
      openLightbox('My Dumb King Do Not: Gameplay Loop', '3D Side-scrolling platformer with comedic hazard interactions', 'assets/gifs/king_gameplay.gif');
    }
  } else if (project === 'warung') {
    if (currentWarungTab === 'mechanics') {
      openLightbox('Warung Mboh Inah: Gameplay Mechanics', 'Item grab interactions & toggleable flashlight', 'assets/gifs/warung_mechanics.gif');
    } else if (currentWarungTab === 'audio') {
      openLightbox('Warung Mboh Inah: Audio Spatialization', '3D distance rolloff & dynamic low-pass occlusion', 'assets/gifs/warung_audio.gif');
    } else {
      openLightbox('Warung Mboh Inah: Atmosphere Preview', 'Psychological Indonesian folklore exploration', 'assets/gifs/warung_atm.gif');
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
    1: { title: 'Beat Carlboo: Main Menu & Results', file: 'assets/audio/music/bcb_mainmenu.wav' },
    2: { title: 'Beat Carlboo: Official Trailer OST', file: 'assets/audio/music/bcb_trailer.wav' },
    3: { title: 'Stage 01: Neon Pulse', file: 'assets/audio/music/bcb_song1.mp3' },
    4: { title: 'Stage 02: Boss Rush Tempo', file: 'assets/audio/music/bcb_song2.mp3' },
    5: { title: 'Stage 03: Velocity Shift', file: 'assets/audio/music/bcb_song3.mp3' },
    6: { title: 'Stage 04: Cybernetic Groove', file: 'assets/audio/music/bcb_song4.mp3' },
    7: { title: 'Stage 05: Midnight Overdrive', file: 'assets/audio/music/bcb_song5.mp3' },
    8: { title: 'Stage 06: Final Ascent', file: 'assets/audio/music/bcb_song6.mp3' }
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

// 5. Tactile SFX Sampler (Beat Carlboo & Dialogue)
function playSFX(type) {
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
    bar.className = 'w-1.5 rounded-full bg-slate-700 transition-all';
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
  const bars = waveformContainer ? waveformContainer.children : [];

  if (titleEl) titleEl.textContent = "Select a track to audition";
  if (timeEl) timeEl.textContent = "0:00 / 0:00";

  for (let b of bars) {
    b.classList.remove('bar-anim', 'bg-blue-500');
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

  for (let b of bars) {
    b.classList.add('bar-anim', 'bg-blue-500');
    b.classList.remove('bg-slate-700');
    b.style.animationDelay = `${(Math.random() * 0.8).toFixed(2)}s`;
  }

  if (trackInfo && trackInfo.file) {
    const audio = new Audio(trackInfo.file);
    audio.volume = 0.8;
    currentTrackAudio = audio;

    audio.ontimeupdate = () => {
      if (timeEl && audio) {
        const cur = formatAudioTime(audio.currentTime);
        const dur = formatAudioTime(audio.duration);
        timeEl.textContent = `${cur} / ${dur}`;
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
  const placeholderEl = document.getElementById('lightbox-placeholder');

  if (mediaSrc) {
    if (imgEl) {
      imgEl.src = mediaSrc;
      imgEl.classList.remove('hidden');
      imgEl.onerror = () => {
        imgEl.classList.add('hidden');
        if (placeholderEl) placeholderEl.classList.remove('hidden');
      };
    }
    if (placeholderEl) placeholderEl.classList.add('hidden');
  } else {
    if (imgEl) {
      imgEl.src = '';
      imgEl.classList.add('hidden');
    }
    if (placeholderEl) placeholderEl.classList.remove('hidden');
  }

  const modal = document.getElementById('lightbox-modal');
  modal.classList.remove('hidden');
  modal.classList.add('flex');
}

function closeLightbox() {
  const imgEl = document.getElementById('lightbox-img');
  if (imgEl) {
    imgEl.src = '';
    imgEl.classList.add('hidden');
  }
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

// Global Escape Key Listener for Modals
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeLightbox();
    closeCaseStudyModal();
  }
});