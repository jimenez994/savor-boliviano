'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Type,
  UtensilsCrossed,
  Image,
  Calendar,
  Link as LinkIcon,
  LogOut,
  Menu,
  ExternalLink,
  Phone,
} from 'lucide-react';
import { routing } from '@/i18n/routing';

const navItems = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/content', label: 'Text Content', icon: Type },
  { href: '/admin/menu', label: 'Menu Items', icon: UtensilsCrossed },
  { href: '/admin/gallery', label: 'Gallery', icon: Image },
  { href: '/admin/schedule', label: 'Schedule', icon: Calendar },
  { href: '/admin/social', label: 'Social Links', icon: LinkIcon },
  { href: '/admin/contact', label: 'Contact', icon: Phone },
];

const publicSiteHref = `/${routing.defaultLocale}`;

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const isLoginPage = pathname === '/admin/login';
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [panelAuth, setPanelAuth] = useState<'pending' | 'ok'>('pending');

  useEffect(() => {
    if (isLoginPage) {
      return;
    }

    let cancelled = false;
    setPanelAuth('pending');

    fetch('/api/admin/verify')
      .then((res) => {
        if (cancelled) return;
        if (!res.ok) {
          router.replace('/admin/login');
          return;
        }
        setPanelAuth('ok');
      })
      .catch(() => {
        if (!cancelled) router.replace('/admin/login');
      });

    return () => {
      cancelled = true;
    };
  }, [router, isLoginPage]);

  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' });
    router.push('/admin/login');
  };

  if (isLoginPage) {
    return <>{children}</>;
  }

  if (panelAuth !== 'ok') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-charcoal andean-pattern px-4">
        <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-charcoal/80 p-10 text-center shadow-xl backdrop-blur-md">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-bolivian-red to-terracotta shadow-lg shadow-bolivian-red/30">
            <UtensilsCrossed className="h-7 w-7 text-white" aria-hidden />
          </div>
          <div
            className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-bolivian-yellow border-t-transparent"
            aria-hidden
          />
          <p className="mt-5 text-sm font-medium text-white/80">Verifying session…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-off-white andean-pattern">
      {isSidebarOpen && (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-charcoal/50 backdrop-blur-sm lg:hidden"
          aria-label="Close menu"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 flex w-[17.5rem] flex-col border-r border-white/10 bg-charcoal shadow-2xl shadow-black/40 transition-transform duration-300 ease-out lg:shadow-none ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="border-b border-white/10 bg-gradient-to-br from-charcoal via-charcoal to-bolivian-red/20 px-5 py-6">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-bolivian-red to-terracotta shadow-md shadow-black/30">
              <UtensilsCrossed className="h-5 w-5 text-white" aria-hidden />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight text-white">Sabor Admin</h1>
              <p className="text-xs text-white/55">Content &amp; media</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto p-3">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setIsSidebarOpen(false)}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                  isActive
                    ? 'bg-bolivian-red text-white shadow-md shadow-bolivian-red/35 ring-1 ring-white/10'
                    : 'text-white/70 hover:bg-white/10 hover:text-white'
                }`}
              >
                <span
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
                    isActive ? 'bg-white/15' : 'bg-white/5'
                  }`}
                >
                  <Icon className="h-4 w-4" aria-hidden />
                </span>
                {item.label}
              </a>
            );
          })}
        </nav>

        <div className="space-y-1 border-t border-white/10 p-3">
          <a
            href={publicSiteHref}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setIsSidebarOpen(false)}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-bolivian-yellow/90 transition hover:bg-white/10 hover:text-bolivian-yellow"
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/5">
              <ExternalLink className="h-4 w-4" aria-hidden />
            </span>
            View live site
          </a>
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-red-300/90 transition hover:bg-red-950/40 hover:text-red-200"
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-red-950/30">
              <LogOut className="h-4 w-4" aria-hidden />
            </span>
            Log out
          </button>
        </div>
      </aside>

      <div className="flex min-h-screen flex-1 flex-col">
        <header className="sticky top-0 z-30 flex items-center justify-between border-b border-earth-brown/10 bg-white/85 px-4 py-3 backdrop-blur-md lg:hidden">
          <button
            type="button"
            onClick={() => setIsSidebarOpen(true)}
            className="rounded-xl p-2.5 text-charcoal transition hover:bg-off-white"
            aria-label="Open menu"
          >
            <Menu className="h-6 w-6" />
          </button>
          <span className="text-sm font-semibold text-charcoal">Sabor Admin</span>
          <div className="w-11" />
        </header>

        <main className="flex-1 px-4 py-6 sm:px-6 sm:py-8 lg:px-10 lg:py-10">{children}</main>
      </div>
    </div>
  );
}
