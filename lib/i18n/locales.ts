export const locales = ["en", "ko", "ja", "pt-br", "zh-hant"] as const;
export type Locale = typeof locales[number];
export const translatedLocales = ["ko", "ja", "pt-br", "zh-hant"] as const;
export const languageInfo: Record<Locale, { label: string; language: string; og: string }> = {
 en: { label: "English", language: "en", og: "en_US" },
 ko: { label: "한국어", language: "ko", og: "ko_KR" },
 ja: { label: "日本語", language: "ja", og: "ja_JP" },
 "pt-br": { label: "Português (Brasil)", language: "pt-BR", og: "pt_BR" },
 "zh-hant": { label: "繁體中文", language: "zh-Hant", og: "zh_TW" },
};
export function isLocale(value: string): value is Locale { return locales.some(locale => locale === value); }
export function basePath(path: string): string {
 const match = path.match(/^\/(ko|ja|pt-br|zh-hant)(?=\/|$)/);
 return match ? path.slice(match[0].length) || "/" : path;
}
export function localePath(path: string, locale: Locale): string {
 if (!path.startsWith("/") || path.startsWith("//")) return path;
 const base = basePath(path);
 if (/^\/(?:_next|favicon|android-chrome|apple-touch-icon|site\.webmanifest|robots\.txt|sitemap\.xml)(?:[/.?-]|$)/.test(base)) return base;
 return locale === "en" ? base : "/" + locale + (base === "/" ? "/" : base);
}
