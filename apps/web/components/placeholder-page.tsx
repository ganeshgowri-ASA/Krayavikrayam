type PlaceholderPageProps = {
  title: string;
  description?: string;
};

export function PlaceholderPage({ title, description }: PlaceholderPageProps) {
  return (
    <section aria-labelledby="page-title" className="mx-auto max-w-5xl">
      <header className="mb-6">
        <h1
          id="page-title"
          className="text-2xl font-semibold tracking-tight text-foreground"
        >
          {title}
        </h1>
        {description && (
          <p className="mt-1 text-sm text-muted">{description}</p>
        )}
      </header>
      <div className="rounded-lg border border-dashed border-border bg-surface p-10 text-center">
        <p className="text-sm text-muted">
          This module is part of the buyer portal shell. Functionality lands in
          a follow-up session.
        </p>
      </div>
    </section>
  );
}
