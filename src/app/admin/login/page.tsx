'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { UtensilsCrossed, Lock, Sparkles } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();

      if (res.ok) {
        router.push('/admin/dashboard');
      } else {
        setError(data.error || 'Invalid password');
      }
    } catch {
      setError('Connection failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-charcoal andean-pattern">
      <div
        className="pointer-events-none absolute -left-32 top-1/4 h-96 w-96 rounded-full bg-bolivian-red/25 blur-[100px]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-24 bottom-0 h-80 w-80 rounded-full bg-bolivian-yellow/15 blur-[90px]"
        aria-hidden
      />

      <div className="relative flex min-h-screen items-center justify-center p-4 sm:p-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-md"
        >
          <div className="rounded-3xl border border-white/10 bg-white/[0.97] p-8 shadow-2xl shadow-black/40 ring-1 ring-black/5 backdrop-blur-xl sm:p-10">
            <div className="mb-8 text-center">
              <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-bolivian-red via-bolivian-red to-terracotta shadow-lg shadow-bolivian-red/40">
                <UtensilsCrossed className="h-8 w-8 text-white" aria-hidden />
              </div>
              <div className="mb-1 inline-flex items-center gap-1.5 rounded-full border border-bolivian-red/15 bg-bolivian-red/5 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-bolivian-red">
                <Sparkles className="h-3.5 w-3.5" aria-hidden />
                Staff only
              </div>
              <h1 className="mt-4 text-2xl font-bold tracking-tight text-charcoal sm:text-3xl">
                Sabor Boliviano
              </h1>
              <p className="mt-1 text-sm text-earth-brown">Sign in to manage your site</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label
                  htmlFor="admin-password"
                  className="mb-2 block text-xs font-semibold uppercase tracking-wide text-earth-brown"
                >
                  Password
                </label>
                <div className="relative">
                  <Lock
                    className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400"
                    aria-hidden
                  />
                  <input
                    id="admin-password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-xl border border-charcoal/10 bg-off-white/70 py-3.5 pl-11 pr-4 text-charcoal shadow-inner shadow-black/[0.02] transition placeholder:text-gray-400 focus:border-bolivian-red focus:bg-white focus:outline-none focus:ring-2 focus:ring-bolivian-red/20"
                    placeholder="Enter admin password"
                    autoFocus
                    autoComplete="current-password"
                  />
                </div>
                {error ? (
                  <p className="mt-2 text-sm font-medium text-red-600" role="alert">
                    {error}
                  </p>
                ) : null}
              </div>

              <motion.button
                type="submit"
                disabled={isLoading}
                className="w-full rounded-xl bg-bolivian-red py-3.5 text-sm font-semibold text-white shadow-lg shadow-bolivian-red/35 transition hover:brightness-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-bolivian-red/50 disabled:cursor-not-allowed disabled:opacity-50"
                whileHover={{ scale: isLoading ? 1 : 1.01 }}
                whileTap={{ scale: isLoading ? 1 : 0.99 }}
              >
                {isLoading ? 'Signing in…' : 'Sign in'}
              </motion.button>
            </form>

            <div className="mt-8 rounded-2xl border border-cream-dark/40 bg-cream/50 p-4">
              <p className="text-center text-xs leading-relaxed text-earth-brown">
                <span className="font-semibold text-charcoal">Default:</span> <code className="rounded bg-white/80 px-1.5 py-0.5 font-mono text-[0.7rem] text-charcoal">admin123</code>
                <br />
                <span className="mt-1 inline-block text-[0.7rem] text-earth-brown/90">
                  Set <code className="font-mono">ADMIN_PASSWORD_HASH</code> in production.
                </span>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
