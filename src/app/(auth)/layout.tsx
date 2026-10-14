import Link from "next/link";
import { ShieldCheck } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background flex flex-col justify-between p-4 sm:p-6 lg:p-8">
      {/* Top Header */}
      <header className="w-full max-w-md mx-auto flex items-center justify-between py-2">
        <Link href="/" className="flex items-center gap-2 group">
          <span className="w-2.5 h-2.5 rounded-full bg-brand-action inline-block group-hover:scale-125 transition-transform" />
          <span className="font-bold text-lg tracking-tight text-text-main">
            e-potiguá
          </span>
        </Link>
        <span className="text-xs font-medium text-text-muted flex items-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5 text-status-success" />
          Ambiente Seguro
        </span>
      </header>

      {/* Main Form Center */}
      <main className="w-full max-w-md mx-auto my-auto py-6">
        {children}
      </main>

      {/* Footer */}
      <footer className="w-full max-w-md mx-auto text-center py-4">
        <p className="text-xs text-text-muted">
          &copy; 2026 e-potiguá. Gestão & Operação Automotiva Premium.
        </p>
      </footer>
    </div>
  );
}
