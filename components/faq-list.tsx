import type { ArticleFaq } from "@/lib/articles";

interface FaqListProps {
  faqs: readonly ArticleFaq[];
  idPrefix?: string;
}

export function FaqList({ faqs, idPrefix = "faq" }: FaqListProps) {
  const headingId = `${idPrefix}-heading`;

  return (
    <section className="article-faq" aria-labelledby={headingId}>
      <header className="section-heading">
        <p className="section-eyebrow">FAQ</p>
        <h2 id={headingId}>Questions & answers</h2>
        <p className="section-description">
          Short answers based on the documented material for this page.
        </p>
      </header>

      <div className="faq-list">
        {faqs.map((faq) => (
          <details className="faq-item" key={faq.question}>
            <summary>{faq.question}</summary>
            <div className="faq-answer">
              <p>{faq.answer}</p>
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}
