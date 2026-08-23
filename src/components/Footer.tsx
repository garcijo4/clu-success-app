import SupportNote from './SupportNote';

export default function Footer() {
  return (
    <footer className="mt-10 border-t border-line pt-5 text-xs leading-relaxed text-body">
      <p>
        Content adapted from{' '}
        <a
          href="https://openstax.org/books/college-success"
          className="underline underline-offset-2"
          target="_blank"
          rel="noreferrer"
        >
          <em>College Success</em>
        </a>{' '}
        by Amy Baldwin et al., OpenStax (Rice University), licensed under{' '}
        <a
          href="https://creativecommons.org/licenses/by/4.0/"
          className="underline underline-offset-2"
          target="_blank"
          rel="noreferrer"
        >
          CC BY 4.0
        </a>
        . Access for free at openstax.org.
      </p>
      <div className="mt-2">
        <SupportNote variant="line" />
      </div>
      <p className="mt-2">Built for CLU First Year Seminar.</p>
    </footer>
  );
}
