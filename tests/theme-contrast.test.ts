import { readFileSync } from "node:fs";

import { describe, expect, it } from "vitest";

const theme = readFileSync(new URL("../src/styles/theme.css", import.meta.url), "utf8");

function readColor(token: string): number[] {
  const hex = theme.match(new RegExp(`${token}:\\s*#([0-9a-f]{6});`, "i"))?.[1];
  if (!hex) throw new Error(`Missing hex theme token: ${token}`);
  return [0, 2, 4].map((offset) => Number.parseInt(hex.slice(offset, offset + 2), 16));
}

function luminance(color: number[]): number {
  const linear = color.map((channel) => {
    const value = channel / 255;
    return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
  });
  return linear[0]! * 0.2126 + linear[1]! * 0.7152 + linear[2]! * 0.0722;
}

function contrast(foreground: number[], background: number[]): number {
  const values = [luminance(foreground), luminance(background)].sort((a, b) => b - a);
  return (values[0]! + 0.05) / (values[1]! + 0.05);
}

describe("normal-size muted text contrast", () => {
  const muted = readColor("--color-text-muted");
  const background = readColor("--color-background");
  const surface = readColor("--color-surface");

  it("meets 4.5:1 on the page background", () => {
    expect(contrast(muted, background)).toBeGreaterThanOrEqual(4.5);
  });

  it("meets 4.5:1 on calculator result surfaces", () => {
    expect(contrast(muted, surface)).toBeGreaterThanOrEqual(4.5);
  });

  it("meets 4.5:1 on the configured footer background", () => {
    const mix = theme.match(/--color-footer-background:\s*color-mix\(in srgb, var\(--color-surface\) (\d+)%?, var\(--color-background\)\);/);
    if (!mix) throw new Error("Missing footer background mix");
    const weight = Number(mix[1]) / 100;
    const footer = surface.map((channel, index) => channel * weight + background[index]! * (1 - weight));
    expect(theme).toMatch(/--color-footer-muted:\s*var\(--color-text-muted\);/);
    expect(contrast(muted, footer)).toBeGreaterThanOrEqual(4.5);
  });
});
