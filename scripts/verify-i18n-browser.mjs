import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const output = path.join(root, "docs/i18n/browser");
fs.mkdirSync(output, { recursive: true });
const profile = fs.mkdtempSync(path.join(os.tmpdir(), "wog-i18n-browser-"));
const chrome = spawn("/Applications/Google Chrome.app/Contents/MacOS/Google Chrome", [
  "--headless=new", `--user-data-dir=${profile}`, "--remote-debugging-port=0",
  "--no-first-run", "--no-default-browser-check", "--disable-background-networking",
  "--disable-component-update", "--disable-sync", "--disable-default-apps", "--disable-extensions", "about:blank",
], { stdio: ["ignore", "ignore", "pipe"] });
let socket;
let sequence = 0;
const pending = new Map();
const errors = [];
const checks = [];
const blockedHosts = new Set();
const pause = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
function send(method, params = {}, sessionId) {
  return new Promise((resolve, reject) => {
    const id = ++sequence;
    const timer = setTimeout(() => { pending.delete(id); reject(new Error(`CDP timeout: ${method}`)); }, 15000);
    pending.set(id, { resolve, reject, timer });
    socket.send(JSON.stringify({ id, method, params, ...(sessionId ? { sessionId } : {}) }));
  });
}
const languages = { en: "en", ko: "ko", ja: "ja", "pt-br": "pt-BR", "zh-hant": "zh-Hant" };
const prefix = (locale) => locale === "en" ? "" : `/${locale}`;
try {
  const endpoint = await new Promise((resolve, reject) => {
    let log = "";
    const timer = setTimeout(() => reject(new Error("Temporary Chrome startup timeout")), 25000);
    chrome.stderr.on("data", (chunk) => {
      log += chunk;
      const match = log.match(/DevTools listening on (ws:\/\/127\.0\.0\.1:\d+\/[^\s]+)/);
      if (match) { clearTimeout(timer); resolve(match[1]); }
    });
    chrome.once("error", (error) => { clearTimeout(timer); reject(error); });
  });
  socket = new WebSocket(endpoint);
  await new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error("Temporary Chrome handshake timeout")), 10000);
    socket.addEventListener("open", () => { clearTimeout(timer); resolve(); }, { once: true });
  });
  socket.addEventListener("message", (event) => {
    const message = JSON.parse(event.data);
    if (message.id) {
      const task = pending.get(message.id);
      if (task) {
        pending.delete(message.id); clearTimeout(task.timer);
        if (message.error) task.reject(new Error(message.error.message));
        else task.resolve(message.result);
      }
    }
    if (message.method === "Runtime.exceptionThrown") errors.push(message.params.exceptionDetails.exception?.description || message.params.exceptionDetails.text);
    if (message.method === "Fetch.requestPaused") {
      const url = new URL(message.params.request.url);
      const local = url.origin === "http://127.0.0.1:3217";
      if (!local) blockedHosts.add(url.hostname);
      send(local ? "Fetch.continueRequest" : "Fetch.failRequest", { requestId: message.params.requestId, ...(!local ? { errorReason: "BlockedByClient" } : {}) }, message.sessionId).catch((error) => errors.push(error.message));
    }
  });
  const browser = await send("Browser.getVersion");
  for (const width of [1440, 390]) for (const locale of Object.keys(languages)) {
    const { targetId } = await send("Target.createTarget", { url: "about:blank" });
    const { sessionId } = await send("Target.attachToTarget", { targetId, flatten: true });
    try {
      await send("Page.enable", {}, sessionId);
      await send("Runtime.enable", {}, sessionId);
      await send("Fetch.enable", { patterns: [{ urlPattern: "*", requestStage: "Request" }] }, sessionId);
      await send("Emulation.setDeviceMetricsOverride", { width, height: 900, deviceScaleFactor: 1, mobile: width === 390 }, sessionId);
      const evaluate = async (expression) => {
        const result = await send("Runtime.evaluate", { expression, awaitPromise: true, returnByValue: true }, sessionId);
        if (result.exceptionDetails) throw new Error(result.exceptionDetails.exception?.description || result.exceptionDetails.text);
        return result.result.value;
      };
      async function ready(route) {
        for (let attempt = 0; attempt < 100; attempt++) {
          const state = await evaluate("({path:location.pathname.replace(/\\/$/, '')||'/', ready:document.readyState, fonts:document.fonts.status, heading:document.querySelector('h1')?.innerText})");
          if (state.path === route && state.ready === "complete" && state.fonts === "loaded" && state.heading) { await pause(350); return; }
          await pause(100);
        }
        throw new Error(`Page readiness timeout: ${route}`);
      }
      async function state(route, currentLocale) {
        const value = await evaluate(`(()=>{
          const visible = e => !!e.getClientRects().length && getComputedStyle(e).visibility !== 'hidden';
          const rect = e => {const r=e.getBoundingClientRect();return {left:r.left,right:r.right,top:r.top,bottom:r.bottom};};
          const header=document.querySelector('.site-header__inner');
          const controls=[...header.children,document.querySelector('.mobile-menu-button')].filter(e=>e&&visible(e)&&!e.classList.contains('mobile-nav')).map(rect);
          return {language:document.documentElement.lang, overflow:document.documentElement.scrollWidth>innerWidth+1,
            headerOverflow:controls.some(r=>r.left<-1||r.right>innerWidth+1),
            headerOverlap:controls.some((r,i)=>controls.slice(i+1).some(s=>r.right>s.left+1&&s.right>r.left+1&&r.bottom>s.top+1&&s.bottom>r.top+1)),
            selects:[...document.querySelectorAll('.language-switcher select')].filter(visible).map(e=>({value:e.value,label:e.getAttribute('aria-label'),options:e.options.length,minHeight:e.getBoundingClientRect().height})),
            heading:document.querySelector('h1')?.innerText, adSlots:document.querySelectorAll('[data-ad-slot-host]').length,
            realScripts:[...document.scripts].filter(e=>e.src.includes('invoke.js')||e.src.includes('googletagmanager')).length};
        })()`);
        assert.equal(value.language, languages[currentLocale], route);
        assert.equal(value.overflow, false, `${width} ${route}: horizontal overflow`);
        assert.equal(value.headerOverflow, false, `${width} ${route}: header overflow`);
        assert.equal(value.headerOverlap, false, `${width} ${route}: header overlap`);
        assert.equal(value.selects.length, 1, `${route}: visible switchers`);
        assert.equal(value.selects[0].value, currentLocale);
        assert.equal(value.selects[0].options, 5);
        assert.ok(value.selects[0].label && value.selects[0].minHeight >= 44);
        assert.equal(value.realScripts, 0, `${route}: local service isolation`);
        checks.push({ width, locale: currentLocale, route, state: value, passed: true });
      }
      const home = prefix(locale) || "/";
      await send("Page.navigate", { url: `http://127.0.0.1:3217${home}` }, sessionId);
      await ready(home); await state(home, locale);
      const screenshot = await send("Page.captureScreenshot", { format: "png" }, sessionId);
      fs.writeFileSync(path.join(output, `home-${locale}-${width}.png`), Buffer.from(screenshot.data, "base64"));
      if (width === 390) {
        await evaluate("document.querySelector('.mobile-menu-button').click()");
        assert.equal(await evaluate("document.querySelector('.mobile-menu-button').getAttribute('aria-expanded')"), "true");
        await evaluate("document.dispatchEvent(new KeyboardEvent('keydown',{key:'Escape',bubbles:true}))");
        await pause(50);
        assert.equal(await evaluate("document.querySelector('.mobile-menu-button').getAttribute('aria-expanded')"), "false");
        assert.equal(await evaluate("document.activeElement===document.querySelector('.mobile-menu-button')"), true);
      }
      const guide = `${prefix(locale)}/guides/classes`;
      await evaluate(`Array.from(document.querySelectorAll('a[href]')).find(a=>[${JSON.stringify(guide)},${JSON.stringify(guide + "/")}].includes(a.pathname)).click()`);
      await ready(guide); await state(guide, locale);
      await evaluate("document.querySelector('.faq-item summary').click()");
      assert.equal(await evaluate("document.querySelector('.faq-item').open"), true);
      const destination = locale === "ja" ? "en" : "ja";
      await evaluate(`history.replaceState(null,'',location.pathname+'?check=language#names');const select=Array.from(document.querySelectorAll('.language-switcher select')).find(e=>e.getClientRects().length);select.value=${JSON.stringify(destination)};select.dispatchEvent(new Event('change',{bubbles:true}));`);
      const switched = `${prefix(destination)}/guides/classes`;
      await ready(switched); await state(switched, destination);
      assert.equal(await evaluate("location.search+location.hash"), "?check=language#names");
      const policy = `${prefix(destination)}/privacy`;
      await evaluate(`Array.from(document.querySelectorAll('a[href]')).find(a=>[${JSON.stringify(policy)},${JSON.stringify(policy + "/")}].includes(a.pathname)).click()`);
      await ready(policy); await state(policy, destination);
      assert.equal(await evaluate("document.querySelectorAll('[data-ad-slot-host]').length"), 0);
      assert.equal(await evaluate("document.querySelectorAll('.legal-links [aria-current=page]').length"), 1);
      const unknown = `${prefix(locale)}/guides/not-published`;
      await send("Page.navigate", { url: `http://127.0.0.1:3217${unknown}` }, sessionId);
      await ready(unknown);
      const errorPage = await evaluate("({language:document.documentElement.lang,links:[...document.querySelectorAll('.not-found__actions a')].map(a=>a.getAttribute('href'))})");
      assert.equal(errorPage.language, languages[locale], `${unknown}: 404 language`);
      assert.deepEqual(errorPage.links.map(href=>href.replace(/\/$/, '')||'/'), [prefix(locale)||"/", `${prefix(locale)}/guides`]);
      checks.push({ width, locale, route: unknown, state: errorPage, passed: true });
      console.log(`Verified ${width}px ${locale}: home, guide, language switch and policy.`);
    } finally { await send("Target.closeTarget", { targetId }); }
  }
  assert.deepEqual(errors, [], "Browser exceptions");
  fs.writeFileSync(path.join(output, "BROWSER_CHECK.json"), JSON.stringify({ checkedAt: new Date().toISOString(), browser: browser.product, checks, blockedHosts: [...blockedHosts], errors, realAdvertisingRequests: false, passed: true }, null, 2));
  console.log(`Browser checks passed: ${checks.length} route/viewports, 10 screenshots, language switching and keyboard menu.`);
} finally {
  if (socket?.readyState === 1) { try { await send("Browser.close"); } catch { /* Process cleanup below handles an already closed browser. */ } socket.close(); }
  await pause(300);
  if (chrome.exitCode === null) chrome.kill("SIGTERM");
  await pause(300);
  fs.rmSync(profile, { recursive: true, force: true });
}
