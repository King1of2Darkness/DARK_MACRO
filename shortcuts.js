// ===== DARK MACRO — SHARED KEYBOARD SHORTCUTS =====
// يشتغل على كل الصفحات

document.addEventListener("keydown", function(e) {
  if (!e.altKey) return;
  const k = e.key.toLowerCase();

  // Alt+F — تكبير الخط
  if (k === "f") {
    e.preventDefault();
    if (typeof quickFont === "function") {
      quickFont();
    } else if (typeof toggleLargeText === "function") {
      toggleLargeText();
    } else {
      // fallback مباشر
      const saved = parseInt(localStorage.getItem("dm-font")) || 16;
      const next = saved >= 19 ? 16 : 19;
      document.documentElement.style.fontSize = next + "px";
      document.body.style.fontSize = next + "px";
      document.body.classList.toggle("large-text", next >= 19);
      localStorage.setItem("dm-font", next);
    }
  }

  // Alt+C — تباين عالٍ
  if (k === "c") {
    e.preventDefault();
    if (typeof toggleContrast === "function") {
      toggleContrast();
    } else {
      const on = !document.body.classList.contains("high-contrast");
      document.body.classList.toggle("high-contrast", on);
      localStorage.setItem("dm-contrast", on);
    }
  }

  // Alt+M — إيقاف الحركة
  if (k === "m") {
    e.preventDefault();
    if (typeof toggleMotion === "function") {
      toggleMotion();
    } else {
      const on = !document.body.classList.contains("no-motion");
      document.body.classList.toggle("no-motion", on);
      localStorage.setItem("dm-motion", on);
      const g = document.getElementById("cursor-glow");
      if (g) g.style.opacity = on ? "0" : "";
    }
  }

  // Alt+R — وضع القراءة
  if (k === "r") {
    e.preventDefault();
    if (typeof toggleReading === "function") {
      toggleReading();
    } else {
      const on = !document.body.classList.contains("reading-mode");
      document.body.classList.toggle("reading-mode", on);
      localStorage.setItem("dm-reading", on);
    }
  }

  // Alt+L — تبديل اللغة
  if (k === "l") {
    e.preventDefault();
    if (typeof toggleLang === "function") {
      toggleLang();
    } else {
      // fallback — بيشتغل على أي صفحة حتى لو ما عندها toggleLang
      const html = document.getElementById("html-root");
      const current = html ? html.getAttribute("lang") : (localStorage.getItem("dm-lang") || "ar");
      const next = current === "ar" ? "en" : "ar";
      localStorage.setItem("dm-lang", next);
      if (html) {
        html.setAttribute("lang", next);
        html.setAttribute("dir", next === "ar" ? "rtl" : "ltr");
      }
      document.body.setAttribute("data-lang", next);
      document.querySelectorAll("[data-ar][data-en]").forEach(el => {
        const val = el.getAttribute("data-" + next);
        if (val) el.textContent = val;
      });
      const langBtn = document.getElementById("lang-toggle-text");
      if (langBtn) langBtn.textContent = next === "en" ? "عربي" : "EN";
      const fontBtn = document.getElementById("font-btn");
      const contrastBtn = document.getElementById("contrast-btn");
      if (fontBtn) fontBtn.textContent = next === "en" ? "Large Text" : "تكبير الخط";
      if (contrastBtn) contrastBtn.textContent = next === "en" ? "High Contrast" : "تباين عالٍ";
      // أخفي الـ overlay لو موجود
      const overlay = document.getElementById("lang-overlay");
      if (overlay) overlay.classList.add("hidden");
    }
  }
});
