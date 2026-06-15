// ===== DARK MACRO — SHARED KEYBOARD SHORTCUTS =====
// Alt + Shift + حرف — يتتبع المفاتيح فعلياً (مش بس e.altKey)

(function () {
  var COOLDOWN_MS = 280;
  var lastFire = 0;
  var pressed = {};
  var altShiftSince = 0;

  function isTypingTarget(el) {
    if (!el || el === document.body || el === document.documentElement) return false;
    var tag = (el.tagName || "").toLowerCase();
    return tag === "input" || tag === "textarea" || tag === "select" || el.isContentEditable;
  }

  function altHeld() {
    return !!(pressed.AltLeft || pressed.AltRight);
  }

  function shiftHeld() {
    return !!(pressed.ShiftLeft || pressed.ShiftRight);
  }

  function altShiftHeld() {
    return altHeld() && shiftHeld();
  }

  function runFont() {
    if (typeof quickFont === "function") quickFont();
    else if (typeof toggleLargeText === "function") toggleLargeText();
    else {
      var saved = parseInt(localStorage.getItem("dm-font")) || 16;
      var next = saved >= 19 ? 16 : 19;
      document.documentElement.style.fontSize = next + "px";
      document.body.style.fontSize = next + "px";
      document.body.classList.toggle("large-text", next >= 19);
      localStorage.setItem("dm-font", next);
      var btn = document.getElementById("font-btn");
      if (btn) btn.classList.toggle("active-acc", next >= 19);
    }
  }

  function runContrast() {
    if (typeof toggleContrast === "function") toggleContrast();
    else {
      var on = !document.body.classList.contains("high-contrast");
      document.body.classList.toggle("high-contrast", on);
      localStorage.setItem("dm-contrast", on);
      var btn = document.getElementById("contrast-btn");
      if (btn) btn.classList.toggle("active-acc", on);
    }
  }

  function runMotion() {
    if (typeof toggleMotion === "function") toggleMotion();
    else {
      var on = !document.body.classList.contains("no-motion");
      document.body.classList.toggle("no-motion", on);
      localStorage.setItem("dm-motion", on);
      var g = document.getElementById("cursor-glow");
      if (g) g.style.opacity = on ? "0" : "";
    }
  }

  function runReading() {
    if (typeof toggleReading === "function") toggleReading();
    else {
      var on = !document.body.classList.contains("reading-mode");
      document.body.classList.toggle("reading-mode", on);
      localStorage.setItem("dm-reading", on);
    }
  }

  function runLang() {
    if (typeof toggleLang === "function") {
      toggleLang();
      return;
    }
    var html = document.getElementById("html-root");
    var current = html ? html.getAttribute("lang") : localStorage.getItem("dm-lang") || "ar";
    var next = current === "ar" ? "en" : "ar";
    localStorage.setItem("dm-lang", next);
    if (html) {
      html.setAttribute("lang", next);
      html.setAttribute("dir", next === "ar" ? "rtl" : "ltr");
    }
    document.body.setAttribute("data-lang", next);
    document.querySelectorAll("[data-ar][data-en]").forEach(function (el) {
      var val = el.getAttribute("data-" + next);
      if (val) el.textContent = val;
    });
    var langBtn = document.getElementById("lang-toggle-text");
    if (langBtn) langBtn.textContent = next === "en" ? "عربي" : "EN";
    var fontBtn = document.getElementById("font-btn");
    var contrastBtn = document.getElementById("contrast-btn");
    if (fontBtn) fontBtn.textContent = next === "en" ? "Large Text" : "تكبير الخط";
    if (contrastBtn) contrastBtn.textContent = next === "en" ? "High Contrast" : "تباين عالٍ";
    var overlay = document.getElementById("lang-overlay");
    if (overlay) overlay.classList.add("hidden");
  }

  var ACTIONS = { f: runFont, c: runContrast, r: runReading, m: runMotion, l: runLang };

  function flash() {
    document.body.classList.add("dm-shortcut-flash");
    setTimeout(function () {
      document.body.classList.remove("dm-shortcut-flash");
    }, 180);
  }

  function fire(key) {
    var action = ACTIONS[key];
    if (!action) return false;
    var now = Date.now();
    if (now - lastFire < COOLDOWN_MS) return true;
    lastFire = now;
    try {
      action();
      flash();
    } catch (err) {
      console.error("DM shortcut:", key, err);
      return false;
    }
    return true;
  }

  function letterFromEvent(e) {
    if (!e.code || e.code.indexOf("Key") !== 0) return null;
    return e.code.slice(3).toLowerCase();
  }

  function comboActive(e) {
    if (e.ctrlKey || e.metaKey) return false;
    if (altShiftHeld()) return true;
    if (e.altKey && e.shiftKey) return true;
    if (altShiftSince && Date.now() - altShiftSince < 1200) return true;
    return false;
  }

  function tryShortcut(e) {
    if (isTypingTarget(e.target)) return;
    if (!comboActive(e)) return;
    var letter = letterFromEvent(e);
    if (!letter || !ACTIONS[letter]) return;
    e.preventDefault();
    e.stopImmediatePropagation();
    fire(letter);
  }

  function onKeyDown(e) {
    pressed[e.code] = true;
    if (altShiftHeld()) altShiftSince = Date.now();
    tryShortcut(e);
  }

  function onKeyUp(e) {
    tryShortcut(e);
    pressed[e.code] = false;
    if (!altShiftHeld()) altShiftSince = 0;
  }

  window.DMShortcuts = { run: fire };

  if (!document.getElementById("dm-shortcut-style")) {
    var style = document.createElement("style");
    style.id = "dm-shortcut-style";
    style.textContent = "body.dm-shortcut-flash{outline:2px solid #b47aff;outline-offset:-2px}";
    document.head.appendChild(style);
  }

  window.addEventListener("keydown", onKeyDown, true);
  window.addEventListener("keyup", onKeyUp, true);
  document.addEventListener("keydown", onKeyDown, true);
  document.addEventListener("keyup", onKeyUp, true);
})();
