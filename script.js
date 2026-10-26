// ===== НАСТРОЙКИ: замените ссылки на настоящие. Пока пусто — кнопки показывают пояснение. =====
const CONFIG = {
  telegramUrl: "", // например "https://t.me/ваш_ник"
  maxUrl: "",      // ссылка на профиль MAX
  policyUrl: ""    // страница политики конфиденциальности
};
document.documentElement.classList.add("js");

// Меню
const burger = document.querySelector(".burger"), nav = document.getElementById("nav");
const setMenu = open => { nav.classList.toggle("open", open); burger.setAttribute("aria-expanded", open); burger.setAttribute("aria-label", open ? "Закрыть меню" : "Открыть меню"); };
burger.addEventListener("click", () => setMenu(!nav.classList.contains("open")));
nav.addEventListener("click", e => e.target.closest("a") && setMenu(false));
document.addEventListener("keydown", e => e.key === "Escape" && setMenu(false));

// Появление блоков
const rv = document.querySelectorAll(".rv");
if ("IntersectionObserver" in window) {
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { threshold: .12 });
  rv.forEach(el => io.observe(el));
} else rv.forEach(el => el.classList.add("in"));

// Ссылки-заглушки
const urls = { telegram: CONFIG.telegramUrl, max: CONFIG.maxUrl, policy: CONFIG.policyUrl };
const names = { telegram: "Telegram", max: "MAX", policy: "Политика конфиденциальности" };
const msg = document.getElementById("link-msg");
document.querySelectorAll("[data-link]").forEach(a => {
  const k = a.dataset.link, u = urls[k];
  if (u) { a.href = u; a.target = "_blank"; a.rel = "noopener"; return; }
  a.addEventListener("click", e => { e.preventDefault(); msg.textContent = `${names[k]}: ссылка пока не настроена. Укажите её в script.js (CONFIG).`; });
});

// «Подробнее»
document.querySelectorAll("[data-more]").forEach(b => b.addEventListener("click", () => {
  document.getElementById("more-out").textContent = b.closest("article").querySelector("h3").textContent + ". " + b.dataset.more;
}));

// Форма
const form = document.getElementById("form");
const rules = { name: v => v.trim().length >= 2 || "Введите имя", grade: v => !!v || "Выберите класс", goal: v => !!v || "Выберите цель", via: v => !!v || "Выберите способ связи",
  contact: v => /^(\+?[\d\s()-]{10,18}|@[\w]{4,32})$/.test(v.trim()) || "Телефон в формате +7 900 000-00-00 или ник вида @name" };
const show = (field, text) => { const err = field.closest("label")?.querySelector(".err") || field.parentElement.nextElementSibling; if (err) err.textContent = text || ""; field.classList.toggle("invalid", !!text); field.setAttribute("aria-invalid", !!text); };
form.addEventListener("submit", e => {
  e.preventDefault(); let first = null;
  for (const [n, fn] of Object.entries(rules)) { const f = form.elements[n], r = fn(f.value); show(f, r === true ? "" : r); if (r !== true && !first) first = f; }
  const c = form.elements.consent; show(c, c.checked ? "" : "Нужно согласие на обработку данных"); if (!c.checked && !first) first = c;
  const ok = document.getElementById("form-ok");
  if (first) { first.focus(); ok.textContent = ""; return; }
  ok.textContent = "Демо-режим: заявка проверена, но никуда не отправлена. Подключите отправку на сервер или в мессенджер.";
  ok.focus(); form.reset();
});
form.addEventListener("input", e => e.target.name && rules[e.target.name] && show(e.target, ""));
