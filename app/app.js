"use strict";
function load(key, fallback) {
  try {
    const v = localStorage.getItem(key);
    return v === null ? fallback : JSON.parse(v);
  } catch { return fallback; }
}
function save(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* private mode: works until reload */ }
}

const $ = (id) => document.getElementById(id);
const STOP = new Set("the a an and or but of to in on at for with is are was were be been it its this that as by from i you he she we they not no so if then than".split(" "));
const minutes = (n, wpm) => { const m = n / wpm; return m < 1 ? `${Math.max(0, Math.round(m * 60))} sec` : `${Math.round(m)} min`; };

function run() {
  const t = $("text").value;
  save("word-counter", t);
  const words = t.match(/[\p{L}\p{N}][\p{L}\p{N}'’-]*/gu) ?? [];
  $("words").textContent = words.length.toLocaleString();
  $("chars").textContent = [...t].length.toLocaleString();
  $("nospace").textContent = [...t.replace(/\s/g, "")].length.toLocaleString();
  $("sentences").textContent = (t.match(/[^.!?]*[\p{L}\p{N}][^.!?]*([.!?]+|$)/gu) ?? []).filter((s) => s.trim()).length;
  $("paras").textContent = t.split(/\n\s*\n/).filter((p) => p.trim()).length;
  $("read").textContent = minutes(words.length, 238);
  $("speak").textContent = minutes(words.length, 150);
  const counts = new Map();
  for (const w of words) {
    const k = w.toLowerCase();
    if (k.length > 2 && !STOP.has(k)) counts.set(k, (counts.get(k) || 0) + 1);
  }
  const top = [...counts].sort((a, b) => b[1] - a[1]).slice(0, 10);
  $("top").innerHTML = top.length ? top.map(([, n]) => `<li><b></b> ×${n}</li>`).join("") : "<li>Nothing yet.</li>";
  $("top").querySelectorAll("b").forEach((b, i) => { b.textContent = top[i][0]; });
}
$("text").value = load("word-counter", "AI Index lists apps that people built with AI tools. Each listing shows how the app was made, what it costs, and what other people think of it.\n\nSome apps even run right in your browser, so you can try them without installing anything.");
$("text").addEventListener("input", run);
run();
