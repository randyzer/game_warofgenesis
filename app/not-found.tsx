import { ButtonLink } from "@/components/button-link";

export default function NotFound() {
  return (
    <section className="not-found page-shell" aria-labelledby="not-found-title">
      <p className="section-eyebrow">Route not found</p>
      <h1 id="not-found-title">This tunnel doesn’t exist.</h1>
      <p>
        The marked passage may have collapsed, or the route was never added to
        the Codex.
      </p>
      <div className="not-found__actions">
        <ButtonLink href="/">Return home</ButtonLink>
        <ButtonLink href="/guides/" variant="secondary">
          Browse guides
        </ButtonLink>
      </div>
    </section>
  );
}
