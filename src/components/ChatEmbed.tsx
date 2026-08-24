const CHATBOT_URL =
  'https://studio.pickaxe.co/_embed/0AUNQO85L6?d=deployment-e40fb89d-e930-4f6c-8fdb-037e10df36b4';

export default function ChatEmbed() {
  return (
    <section aria-labelledby="chatbot-heading">
      <h2 id="chatbot-heading" className="sr-only">
        College Success chatbot
      </h2>
      <div className="mx-auto w-full max-w-[1200px] overflow-hidden rounded-[4px] border border-line bg-surface">
        <iframe
          id="pickaxe-embed-deployment-e40fb89d-e930-4f6c-8fdb-037e10df36b4"
          src={CHATBOT_URL}
          title="College Success chatbot"
          frameBorder="0"
          allow="microphone"
          loading="lazy"
          referrerPolicy="strict-origin-when-cross-origin"
          className="block h-[800px] w-full max-w-[1200px] rounded-[4px] border-0"
        />
      </div>
      <p className="mt-3 text-xs leading-relaxed text-body">
        Questions you enter are anonymous, but are recorded, so leave out private or
        sensitive information.
      </p>
    </section>
  );
}
