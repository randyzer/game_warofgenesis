import { cloneElement, isValidElement, type ReactNode, type ReactElement } from "react";
import ko from "./messages/ko.json";
import ja from "./messages/ja.json";
import pt from "./messages/pt-br.json";
import zh from "./messages/zh-hant.json";
import sourceStrings from "./source-strings.json";
import { localePath, type Locale } from "./locales";
const messages: Record<Exclude<Locale, "en">, Record<string, string>> = {ko, ja, "pt-br": pt, "zh-hant": zh};
const connectors: Record<Exclude<Locale, "en">, Record<string, string>> = {
 ko: { at: "연락처:", and: "및" },
 ja: { at: "連絡先：", and: "と" },
 "pt-br": { at: "em", and: "e" },
 "zh-hant": { at: "聯絡信箱：", and: "及" },
};
for (const [locale, dictionary] of Object.entries(messages)) {
 for (const key of sourceStrings) if (!dictionary[key]?.trim()) throw new Error(locale + ": missing translation: " + key);
}
export function text(value: string, locale: Locale): string {
 if (locale === "en") return value;
 const key = value.replace(/\s+/g, " ").trim();
 const translated = messages[locale][key] ?? connectors[locale][key];
 return translated ? (value.match(/^\s*/)?.[0] || "") + translated + (value.match(/\s*$/)?.[0] || "") : value;
}
const unchanged = new Set(["className", "id", "key", "src", "dateTime", "htmlFor", "aria-controls", "aria-labelledby", "aria-describedby", "locale", "name", "slug", "publishedAt", "lastVerified", "cover"]);
function property(value: unknown, key: string, locale: Locale): unknown {
 if (unchanged.has(key) || key.startsWith("data-")) return value;
 if (typeof value === "string") return key === "href" ? localePath(value, locale) : text(value, locale);
 if (Array.isArray(value)) return value.map(item => property(item, key, locale));
 if (isValidElement(value)) return localize(value, locale);
 if (value && typeof value === "object" && Object.getPrototypeOf(value) === Object.prototype) return Object.fromEntries(Object.entries(value).map(([k,v]) => [k,property(v,k,locale)]));
 return value;
}
// Localize server-rendered interface trees; MDX bodies use independent translated files.
export function localize(node: ReactNode, locale: Locale): ReactNode {
 if (typeof node === "string") return text(node, locale);
 if (Array.isArray(node)) return node.map(child => localize(child, locale));
 if (!isValidElement(node)) return node;
 const element = node as ReactElement<Record<string, unknown>>;
 const props = Object.fromEntries(Object.entries(element.props).map(([k,v]) => [k,k === "children" ? localize(v as ReactNode,locale) : property(v,k,locale)]));
 return cloneElement(element,props);
}
