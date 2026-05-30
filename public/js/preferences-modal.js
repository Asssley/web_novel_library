const themeSelect = document.getElementById("themeSelect");
const langSelect = document.getElementById("langSelect");
const fontSizeRange = document.getElementById("fontSizeRange");
const fontSizeValue = document.getElementById("fontSizeValue");

/* -------------------- LOAD SETTINGS -------------------- */
document.addEventListener("DOMContentLoaded", () => {
  const theme = localStorage.getItem("theme") || "light";
  const fontSize = localStorage.getItem("fontSize") || "16";
  const lang = getCookie("lang") || "en";

  themeSelect.value = theme;
  langSelect.value = lang;
  fontSizeRange.value = fontSize;
  fontSizeValue.textContent = fontSize;

  applyFontSize(fontSize);
});

/* -------------------- THEME -------------------- */
themeSelect.addEventListener("change", (e) => {
  const value = e.target.value;
  localStorage.setItem("theme", value);
  applyTheme(value);
});

function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
}

/* -------------------- FONT SIZE -------------------- */
fontSizeRange.addEventListener("input", (e) => {
  const value = e.target.value;
  fontSizeValue.textContent = value;
  localStorage.setItem("fontSize", value);
  applyFontSize(value);
});

function applyFontSize(size) {
  document.getElementById("chapter-content").style.setProperty("font-size", size + "px")
}

/* -------------------- LANGUAGE (COOKIE + RELOAD) -------------------- */
langSelect.addEventListener("change", (e) => {
  const value = e.target.value;
  setCookie("lang", value, 365);
  location.reload();
});

/* -------------------- COOKIE HELPERS -------------------- */
function setCookie(name, value, days) {
  const d = new Date();
  d.setTime(d.getTime() + (days * 24 * 60 * 60 * 1000));
  document.cookie = `${name}=${value}; expires=${d.toUTCString()}; path=/`;
}

function getCookie(name) {
  const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  return match ? match[2] : null;
}
