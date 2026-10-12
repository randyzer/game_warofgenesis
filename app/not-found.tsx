import { ButtonLink } from "@/components/button-link";

export default function NotFound() {
  return <section className="not-found page-shell" aria-labelledby="not-found-title">
    <p className="section-eyebrow">Page not found</p>
    <h1 id="not-found-title">This reference is not available.</h1>
    <p>The requested page is not part of the published War of Genesis: Idle Loot guide hub.</p>
    <div className="not-found__actions"><ButtonLink href="/">Return home</ButtonLink><ButtonLink href="/guides/" variant="secondary">Game overview</ButtonLink></div>
  </section>;
}
