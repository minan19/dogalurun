import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

interface Section {
  title: string;
  content: string;
}

interface StaticPageProps {
  title: string;
  subtitle?: string;
  sections: Section[];
}

export function StaticPage({ title, subtitle, sections }: StaticPageProps) {
  return (
    <div className="min-h-screen bg-cream-50">
      <Header />
      <main className="py-10 sm:py-14">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-green-800">{title}</h1>
            {subtitle && <p className="mt-2 text-text-secondary text-sm">{subtitle}</p>}
          </div>
          <div className="flex flex-col gap-6">
            {sections.map((s, i) => (
              <div key={i} className="bg-white rounded-2xl border border-olive-border/30 p-6">
                <h2 className="text-base font-bold text-green-900 mb-3">{s.title}</h2>
                <p className="text-sm text-text-secondary leading-relaxed whitespace-pre-line">{s.content}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
