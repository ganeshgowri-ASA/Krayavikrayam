import Link from "next/link";
import {
  ArrowRight,
  Bot,
  Building2,
  Shield,
  Sparkles,
  Zap,
  Globe,
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-accent/20">
      {/* Navigation */}
      <nav className="border-b border-border/40 backdrop-blur-sm sticky top-0 z-50 bg-background/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">
                  क्र
                </span>
              </div>
              <span className="text-xl font-bold tracking-tight">
                Krayavikrayam
              </span>
            </div>
            <div className="flex items-center gap-4">
              <Link
                href="/auth/signin"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/auth/signin"
                className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm hover:bg-primary/90 transition-colors"
              >
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24 relative">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-muted/50 px-4 py-1.5 text-sm text-muted-foreground mb-8">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              AI-Powered Commerce Platform
            </div>
            <h1 className="text-5xl sm:text-7xl font-bold tracking-tight mb-4">
              <span className="bg-gradient-to-r from-primary via-primary to-primary/60 bg-clip-text text-transparent">
                क्रयविक्रयम्
              </span>
            </h1>
            <p className="text-2xl sm:text-3xl font-semibold text-foreground mb-4">
              Krayavikrayam
            </p>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-4 leading-relaxed">
              The ancient Sanskrit art of commerce, reimagined for the modern
              era. An intelligent platform where{" "}
              <span className="text-foreground font-medium">
                buying and selling
              </span>{" "}
              meets the power of AI.
            </p>
            <p className="text-sm text-muted-foreground/70 italic mb-10">
              क्रय (kraya — to buy) + विक्रय (vikraya — to sell) = क्रयविक्रयम्
              (the act of commerce)
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/auth/signin"
                className="inline-flex items-center justify-center rounded-lg bg-primary px-8 py-3 text-base font-medium text-primary-foreground shadow-lg shadow-primary/25 hover:bg-primary/90 hover:shadow-xl hover:shadow-primary/30 transition-all"
              >
                Start Trading
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link
                href="#features"
                className="inline-flex items-center justify-center rounded-lg border border-border bg-background px-8 py-3 text-base font-medium hover:bg-accent transition-colors"
              >
                Explore Features
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
              Everything you need to{" "}
              <span className="text-primary">trade smarter</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Built with cutting-edge technology and ancient wisdom, our
              platform empowers your commerce journey.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Feature Card 1 */}
            <div className="group rounded-xl border border-border/60 bg-card p-6 hover:shadow-lg hover:border-primary/30 transition-all duration-300">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <Bot className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">AI Agents</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Intelligent agents that analyze markets, predict trends, and
                automate your trading workflows with precision.
              </p>
            </div>

            {/* Feature Card 2 */}
            <div className="group rounded-xl border border-border/60 bg-card p-6 hover:shadow-lg hover:border-primary/30 transition-all duration-300">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <Building2 className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Multi-Tenancy</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Manage multiple organizations seamlessly. Role-based access
                control ensures the right people see the right data.
              </p>
            </div>

            {/* Feature Card 3 */}
            <div className="group rounded-xl border border-border/60 bg-card p-6 hover:shadow-lg hover:border-primary/30 transition-all duration-300">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">
                Enterprise Security
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Bank-grade security with OAuth providers, encrypted sessions,
                and comprehensive audit trails.
              </p>
            </div>

            {/* Feature Card 4 */}
            <div className="group rounded-xl border border-border/60 bg-card p-6 hover:shadow-lg hover:border-primary/30 transition-all duration-300">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <Zap className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">
                Real-time Analytics
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Live dashboards and analytics powered by type-safe APIs. Make
                decisions backed by real-time data.
              </p>
            </div>

            {/* Feature Card 5 */}
            <div className="group rounded-xl border border-border/60 bg-card p-6 hover:shadow-lg hover:border-primary/30 transition-all duration-300">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <Globe className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Global Reach</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Deploy anywhere with edge-optimized infrastructure. Reach
                customers across the globe with minimal latency.
              </p>
            </div>

            {/* Feature Card 6 */}
            <div className="group rounded-xl border border-border/60 bg-card p-6 hover:shadow-lg hover:border-primary/30 transition-all duration-300">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <Sparkles className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">
                Smart Automation
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Automate repetitive tasks with intelligent workflows. From
                invoicing to inventory, let AI handle the rest.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative">
        <div className="absolute inset-0 bg-gradient-to-t from-primary/5 via-transparent to-transparent" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
            Ready to transform your commerce?
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of businesses already using Krayavikrayam to
            streamline their operations and boost revenue.
          </p>
          <Link
            href="/auth/signin"
            className="inline-flex items-center justify-center rounded-lg bg-primary px-8 py-3 text-base font-medium text-primary-foreground shadow-lg shadow-primary/25 hover:bg-primary/90 hover:shadow-xl transition-all"
          >
            Get Started for Free
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/40 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 rounded bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-xs">
                  क्र
                </span>
              </div>
              <span className="text-sm font-semibold">Krayavikrayam</span>
            </div>
            <p className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} Krayavikrayam. All rights
              reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
