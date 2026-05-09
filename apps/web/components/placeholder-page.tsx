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
          className="text-2xl font-semibold tracking-tight text-slate-900"
        >
          {title}
        </h1>
        {description && (
          <p className="mt-1 text-sm text-slate-600">{description}</p>
        )}
      </header>
      <div className="rounded-lg border border-dashed border-slate-300 bg-white p-10 text-center">
        <p className="text-sm text-slate-500">
          This module is part of the buyer portal shell. Functionality lands in
          a follow-up session.
        </p>
      </div>
    </section>
  );
}
