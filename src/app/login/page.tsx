'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    const res = await fetch('/api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });

    if (res.ok) {
      router.push('/viagens');
    } else {
      setError('Senha incorreta');
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-navy)] px-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="text-4xl mb-2">✈️</div>
          <h1 className="text-2xl font-bold text-[var(--color-navy)]">Janér Viagens</h1>
          <p className="text-gray-500 text-sm mt-1">Portal da família</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Senha"
              className="w-full px-4 py-3 pr-12 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] text-center text-lg"
              autoFocus
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              tabIndex={-1}
            >
              {showPassword ? '🙈' : '👁️'}
            </button>
          </div>
          {error && (
            <p className="text-red-500 text-sm text-center mt-2">{error}</p>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-4 bg-[var(--color-accent)] hover:bg-[var(--color-accent-light)] text-[var(--color-navy-dark)] font-semibold py-3 rounded-xl transition-colors disabled:opacity-50"
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  );
}
