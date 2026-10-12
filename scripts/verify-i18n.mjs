import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";
import ts from "typescript";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = (name) => fs.readFileSync(path.join(root, name), "utf8");
const compiled = ts.transpileModule(read("lib/i18n/locales.ts"), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
}).outputText;
const moduleExports = {};
vm.runInNewContext(compiled, { exports: moduleExports });
const { locales, translatedLocales, localePath, languageInfo, isLocale } = moduleExports;
assert.equal(isLocale("fr"), false);
assert.equal(isLocale("pt-br"), true);
assert.equal(localePath("/ja/guides/classes/?ref=nav#names", "ko"), "/ko/guides/classes/?ref=nav#names");
assert.equal(localePath("/zh-hant/", "en"), "/");
assert.equal(localePath("/#classes", "ja"), "/ja/#classes");
for (const resource of ["/favicon.ico", "/favicon-32x32.png", "/apple-touch-icon.png", "/site.webmanifest", "/robots.txt", "/sitemap.xml", "/_next/static/test.js"]) {
  for (const locale of locales) assert.equal(localePath(resource, locale), resource);
}
for (const destination of ["https://steamcommunity.com/", "mailto:test@example.com", "#classes", "//example.com/"]) {
  assert.equal(localePath(destination, "ja"), destination);
}

const manifest = JSON.parse(read("lib/i18n/source-strings.json"));
const sources = fs.readdirSync(path.join(root, "content/guides")).filter((name) => name.endsWith(".mdx"));
const metadata = (source) => JSON.parse(source.match(/^export const metadata = (\{[\s\S]*?^\});/m)[1]);
const ids = (source) => [...source.matchAll(/<h2 id="([^"]+)"/g)].map((match) => match[1]);
const links = (source) => [...source.matchAll(/\]\(([^)]+)\)/g)].map((match) => match[1]);
let translatedArticles = 0;
for (const locale of translatedLocales) {
  const dictionary = JSON.parse(read(`lib/i18n/messages/${locale}.json`));
  assert.deepEqual(Object.keys(dictionary).sort(), [...manifest].sort(), `${locale}: dictionary keys`);
  for (const key of manifest) assert.ok(dictionary[key]?.trim(), `${locale}: empty ${key}`);
  for (const name of sources) {
    const english = read(`content/guides/${name}`);
    const translated = read(`content/locales/${locale}/guides/${name}`);
    const original = metadata(english);
    const current = metadata(translated);
    for (const field of ["slug", "publishedAt", "lastVerified", "cover"]) assert.equal(current[field], original[field], `${locale}/${name}: ${field}`);
    assert.deepEqual(Object.keys(current).sort(), Object.keys(original).sort());
    assert.deepEqual(current.sections.map((section) => section.id), original.sections.map((section) => section.id));
    assert.deepEqual(ids(translated), ids(english), `${locale}/${name}: heading anchors`);
    assert.deepEqual(links(translated), links(english), `${locale}/${name}: source links`);
    assert.equal(current.faqs.length, original.faqs.length);
    for (const field of [current.title, current.description, current.category, current.coverAlt, ...current.sections.map((section) => section.label), ...current.faqs.flatMap((faq) => [faq.question, faq.answer])]) assert.ok(field.trim());
    assert.notEqual(current.description, original.description, `${locale}/${name}: untranslated description`);
    translatedArticles++;
  }
}
console.log(`Source checks passed: ${translatedArticles} translated articles, ${manifest.length} interface keys per language.`);

if (process.argv[2]) {
  const preview = new URL(process.argv[2]);
  assert.ok(["127.0.0.1", "localhost"].includes(preview.hostname), "HTTP verification must use a local preview");
  const canonicalOrigin = "https://war-of-genesis.wiki";
  const paths = ["/", "/guides", ...sources.filter((name) => name !== "overview.mdx").map((name) => `/guides/${name.slice(0, -4)}`), "/privacy", "/cookies", "/terms"];
  const attr = (tag, name) => tag?.match(new RegExp(`\\b${name}="([^"]*)"`, "i"))?.[1];
  const sameUrl = (actual, expected) => assert.equal(new URL(actual).href, new URL(expected).href);
  const report = [];
  for (const locale of locales) for (const page of paths) {
    const currentPath = localePath(page, locale);
    const response = await fetch(new URL(currentPath, preview));
    assert.equal(response.status, 200, currentPath);
    const html = await response.text();
    assert.equal(html.match(/<html[^>]*\blang="([^"]+)"/)?.[1], languageInfo[locale].language, currentPath);
    assert.ok(html.match(/<title>[^<]+<\/title>/), `${currentPath}: title`);
    assert.equal([...html.matchAll(/<h1\b/g)].length, 1, `${currentPath}: H1 count`);
    const tags = [...html.matchAll(/<link\b[^>]+>/g)].map((match) => match[0]);
    sameUrl(attr(tags.find((tag) => attr(tag, "rel") === "canonical"), "href"), canonicalOrigin + currentPath);
    const alternates = tags.filter((tag) => attr(tag, "hreflang"));
    assert.equal(alternates.length, 6, `${currentPath}: hreflang count`);
    for (const other of locales) sameUrl(attr(alternates.find((tag) => attr(tag, "hreflang") === languageInfo[other].language), "href"), canonicalOrigin + localePath(page, other));
    sameUrl(attr(alternates.find((tag) => attr(tag, "hreflang") === "x-default"), "href"), canonicalOrigin + page);
    assert.ok(html.match(/<meta name="description" content="[^"]+"/));
    if (locale !== "en") for (const match of html.matchAll(/<a\b[^>]*\bhref="([^"#]+)"/g)) {
      const href = match[1];
      if (href.startsWith("/") && !href.startsWith("//")) assert.ok(href === `/${locale}` || href.startsWith(`/${locale}/`) || localePath(href, locale) === href, `${currentPath}: language-losing link ${href}`);
    }
    const policy = ["/privacy", "/cookies", "/terms"].includes(page);
    assert.equal(html.includes("data-ad-slot-host"), !policy, `${currentPath}: advertising scope`);
    report.push({ path: currentPath, status: response.status, language: languageInfo[locale].language, passed: true });
  }
  for (const pathname of ["/fr", "/ko/not-published", "/ja/guides/not-published", "/en/guides/classes"]) assert.equal((await fetch(new URL(pathname, preview))).status, 404, pathname);
  for (const pathname of ["/guides/farming", "/guides/gear"]) assert.equal((await fetch(new URL(pathname, preview))).status, 410, pathname);
  assert.equal((await fetch(new URL("/favicon.ico", preview))).status, 200);
  const sitemap = await (await fetch(new URL("/sitemap.xml", preview))).text();
  assert.equal([...sitemap.matchAll(/<loc>/g)].length, 70);
  for (const locale of locales) for (const page of paths) assert.ok(sitemap.includes(`<loc>${canonicalOrigin + localePath(page, locale)}</loc>`));
  fs.writeFileSync(path.join(root, "docs/i18n/HTTP_CHECK.json"), JSON.stringify({ checkedAt: new Date().toISOString(), sourceArticles: translatedArticles, pages: report, sitemapUrls: 70, invalidRoutes: 4, retiredRoutes: 2, passed: true }, null, 2));
  console.log("HTTP checks passed: 70 pages, reciprocal hreflang, internal links, sitemap, 404, 410 and root favicon.");
}
