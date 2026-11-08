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

// 2. Project Tab Switcher
function switchProjectTab(project, tab) {
  if (project === 'warung') {
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

// 3. Web Audio API Engine
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

// 4. Horror Audio Synthesizer (Warung Mboh Inah)
function playHorrorAudio(type) {
  const ctx = getAudioContext();
  const now = ctx.currentTime;

  if (type === 'ambient') {
    // Sub-bass drone with dissonant frequency beating
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain = ctx.createGain();

    osc1.type = 'sawtooth';
    osc1.frequency.setValueAtTime(55, now); // A1 note
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(58.5, now); // Slightly detuned

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
    // Rapid pitch stinger with harsh harmonics
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

  } else if (type === 'sanity') {
    // Frequency modulation wobble
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(220, now);
    osc.frequency.linearRampToValueAtTime(180, now + 0.4);
    osc.frequency.linearRampToValueAtTime(240, now + 0.8);
    osc.frequency.linearRampToValueAtTime(160, now + 1.4);

    gain.gain.setValueAtTime(0.18, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 1.5);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 1.55);
  }
}

// 5. Tactile SFX Sampler (Beat Carlboo)
function playSFX(type) {
  const ctx = getAudioContext();
  const now = ctx.currentTime;

  if (type === 'perfect') {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, now); // A5
    osc.frequency.exponentialRampToValueAtTime(1760, now + 0.15); // A6
    
    gain.gain.setValueAtTime(0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.22);

  } else if (type === 'combo') {
    const chord = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
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
    const arpeggio = [440, 554.37, 659.25, 880]; // A Major
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
  }
}

// 6. Waveform Generator & Soundtrack Demo Player
const waveformContainer = document.getElementById('waveform-container');
const BAR_COUNT = 36;

function initWaveformBars() {
  if (!waveformContainer) return;
  waveformContainer.innerHTML = '';
  for (let i = 0; i < BAR_COUNT; i++) {
    const bar = document.createElement('div');
    bar.className = 'w-1.5 rounded-full bg-slate-700 transition-all';
    bar.style.height = `${Math.floor(Math.random() * 50) + 15}%`;
    waveformContainer.appendChild(bar);
  }
}

let currentPlayingTrack = null;
let trackTimerInterval = null;

function playTrack(trackNumber, trackTitle) {
  const ctx = getAudioContext();
  const titleEl = document.getElementById('player-active-title');
  const timeEl = document.getElementById('player-active-time');
  const bars = waveformContainer ? waveformContainer.children : [];

  // Reset track play buttons
  [1, 2, 3].forEach(num => {
    const btn = document.getElementById(`play-btn-${num}`);
    if (btn) {
      btn.innerHTML = '<i data-lucide="play" class="w-4 h-4 ml-0.5"></i>';
      btn.className = "w-9 h-9 rounded-full bg-surface-card hover:bg-surface-hover border border-surface-border text-slate-300 hover:text-white flex items-center justify-center shrink-0 shadow-sm transition-transform active:scale-95";
    }
  });

  // Toggle off if clicking the currently active track
  if (currentPlayingTrack === trackNumber) {
    currentPlayingTrack = null;
    titleEl.textContent = "Select a track to audition";
    timeEl.textContent = "0:00 / 0:15";
    clearInterval(trackTimerInterval);
    for (let b of bars) {
      b.classList.remove('bar-anim', 'bg-blue-500');
      b.classList.add('bg-slate-700');
    }
    if (window.lucide) window.lucide.createIcons();
    return;
  }

  // Activate new track
  currentPlayingTrack = trackNumber;
  const activeBtn = document.getElementById(`play-btn-${trackNumber}`);
  if (activeBtn) {
    activeBtn.innerHTML = '<i data-lucide="square" class="w-4 h-4 text-white"></i>';
    activeBtn.className = "w-9 h-9 rounded-full bg-blue-600 hover:bg-blue-500 text-white flex items-center justify-center shrink-0 shadow-sm transition-transform active:scale-95";
  }

  titleEl.textContent = `Auditioning: ${trackTitle}`;

  // Start visual bar animation
  for (let b of bars) {
    b.classList.add('bar-anim', 'bg-blue-500');
    b.classList.remove('bg-slate-700');
    b.style.animationDelay = `${(Math.random() * 0.8).toFixed(2)}s`;
  }

  // Synthesize musical groove sequence
  const now = ctx.currentTime;
  const baseFreq = trackNumber === 1 ? 261.63 : trackNumber === 2 ? 329.63 : 220.00;
  [0, 0.2, 0.4, 0.6, 0.8].forEach((timeOffset, i) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = trackNumber === 2 ? 'sawtooth' : 'triangle';
    osc.frequency.setValueAtTime(baseFreq * (1 + (i % 3) * 0.25), now + timeOffset);
    gain.gain.setValueAtTime(0.12, now + timeOffset);
    gain.gain.exponentialRampToValueAtTime(0.001, now + timeOffset + 0.18);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now + timeOffset);
    osc.stop(now + timeOffset + 0.2);
  });

  // Track timer countdown simulation (15s sample)
  let seconds = 0;
  clearInterval(trackTimerInterval);
  trackTimerInterval = setInterval(() => {
    seconds++;
    timeEl.textContent = `0:${seconds < 10 ? '0' : ''}${seconds} / 0:15`;
    if (seconds >= 15) {
      playTrack(trackNumber, trackTitle);
    }
  }, 1000);

  if (window.lucide) window.lucide.createIcons();
}

// 7. Lightbox Modal Handlers
function openLightbox(title, subtitle) {
  document.getElementById('lightbox-title').textContent = title;
  document.getElementById('lightbox-subtitle').textContent = subtitle;
  const modal = document.getElementById('lightbox-modal');
  modal.classList.remove('hidden');
  modal.classList.add('flex');
}

function closeLightbox() {
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