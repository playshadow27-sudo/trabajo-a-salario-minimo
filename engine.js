/* =====================================================
   TRABAJO A SALARIO MINIMO
   Core Engine
   Creado por Aidan
   ===================================================== */

// Este archivo es el NUCLEO del proyecto.
// No contiene terror visual ni narrativa directa.
// Solo estado, control y comunicación entre módulos.

// ------------------ NAMESPACE GLOBAL ------------------
const TSM = {};

// ------------------ CONFIGURACION GLOBAL ------------------
TSM.config = {
  startHour: 0,
  endHour: 6,
  tickRate: 1000,        // 1 minuto del juego = 1 segundo real
  powerDrainRate: 0.35,  // consumo base de energía
  glitchChance: 0.08
};

// ------------------ ESTADO GLOBAL ------------------
TSM.state = {
  hour: 0,
  minute: 0,
  power: 100,
  alive: true,
  locked: false,
  initialized: false
};

// ------------------ SISTEMA DE EVENTOS ------------------
TSM.events = {
  listeners: {},

  on(event, callback) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);
  },

  emit(event, data = null) {
    if (!this.listeners[event]) return;
    this.listeners[event].forEach(cb => cb(data));
  }
};

// ------------------ UTILIDADES ------------------
TSM.utils = {
  clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  },

  formatTime(h, m) {
    return `${h}:${m.toString().padStart(2, '0')}`;
  }
};

// ------------------ CICLO PRINCIPAL ------------------
TSM.loop = {
  interval: null,

  start() {
    if (this.interval) return;
    this.interval = setInterval(() => {
      TSM.events.emit('tick');
    }, TSM.config.tickRate);
  },

  stop() {
    clearInterval(this.interval);
    this.interval = null;
  }
};

// ------------------ CONTROL DE VIDA ------------------
TSM.control = {
  kill(reason = 'DESCONOCIDO') {
    if (!TSM.state.alive) return;
    TSM.state.alive = false;
    TSM.loop.stop();
    TSM.events.emit('death', reason);
  },

  finishShift() {
    TSM.state.alive = false;
    TSM.loop.stop();
    TSM.events.emit('shift_end');
  }
};

// ------------------ INICIALIZACION ------------------
TSM.init = function () {
  if (TSM.state.initialized) return;

  TSM.state.initialized = true;
  TSM.events.emit('init');
  TSM.loop.start();
};

// ------------------ EXPOSICION GLOBAL ------------------
window.TSM = TSM;

// ------------------ ARRANQUE AUTOMATICO ------------------
document.addEventListener('DOMContentLoaded', () => {
  TSM.init();
});
