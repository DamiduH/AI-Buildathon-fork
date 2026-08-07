import Head from 'next/head';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { signInWithEmailAndPassword, signInWithPopup, signOut } from 'firebase/auth';
import { getAdminFromRequest } from '../../lib/adminAuth.js';
import { createGoogleProvider, getFirebaseAuth } from '../../lib/firebaseClient.js';

export async function getServerSideProps({ req }) {
  // Already signed in? Skip straight to the dashboard.
  const admin = await getAdminFromRequest(req);
  if (admin) {
    return { redirect: { destination: '/admin', permanent: false } };
  }
  return { props: {} };
}

// Firebase's error codes are technical; show admins something readable.
function friendlyAuthError(err) {
  switch (err?.code) {
    case 'auth/popup-closed-by-user':
      return 'Sign-in was cancelled.';
    case 'auth/invalid-credential':
    case 'auth/wrong-password':
    case 'auth/user-not-found':
      return 'Incorrect email or password.';
    case 'auth/invalid-email':
      return 'Please enter a valid email address.';
    case 'auth/too-many-requests':
      return 'Too many failed attempts. Please wait a bit and try again.';
    case 'auth/operation-not-allowed':
      return 'Email/password sign-in is not enabled in Firebase yet.';
    default:
      return err?.message || 'Sign-in failed. Please try again.';
  }
}

export default function AdminLogin() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Shared final step for both sign-in methods: exchange the Firebase ID
  // token for the httpOnly session cookie (which is where the ADMIN_EMAILS
  // allowlist is enforced server-side).
  const exchangeForSession = async (user) => {
    const idToken = await user.getIdToken();
    const res = await fetch('/api/admin/session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ idToken })
    });
    const body = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(body.error || 'Sign-in failed.');
    }
    await router.replace('/admin');
  };

  const handleGoogleSignIn = async () => {
    setError('');
    setLoading(true);

    let auth;
    try {
      auth = getFirebaseAuth();
      const result = await signInWithPopup(auth, createGoogleProvider());
      await exchangeForSession(result.user);
    } catch (err) {
      // Never leave an unapproved Google session lingering client-side.
      await signOut(auth || getFirebaseAuth()).catch(() => {});
      setError(friendlyAuthError(err));
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSignIn = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      setError('Please enter your email and password.');
      return;
    }

    setError('');
    setLoading(true);

    let auth;
    try {
      auth = getFirebaseAuth();
      const result = await signInWithEmailAndPassword(auth, email.trim(), password);
      await exchangeForSession(result.user);
    } catch (err) {
      // Same hygiene as Google sign-in: if the server rejected the account
      // (e.g. not on the allowlist), don't keep the Firebase session around.
      await signOut(auth || getFirebaseAuth()).catch(() => {});
      setError(friendlyAuthError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Admin Login — AI Buildathon</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      <div className="admin-root min-h-screen flex items-center justify-center bg-slate-950 px-4">
        <div className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl">
          <div className="mx-auto mb-5 h-12 w-12 rounded-xl bg-brand-orange/10 border border-brand-orange/30 flex items-center justify-center">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#FF5500" strokeWidth="2">
              <path d="M12 2l8 4v6c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V6l8-4z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-white text-center mb-1">Admin Dashboard</h1>
          <p className="text-slate-400 text-sm text-center mb-8">AI Buildathon registrations</p>

          {error && (
            <div className="mb-6 rounded-lg border border-red-500/30 bg-red-500/10 text-red-400 text-sm px-4 py-3">
              {error}
            </div>
          )}

          <form onSubmit={handlePasswordSignIn} noValidate>
            <label className="block text-slate-300 text-xs font-semibold uppercase tracking-wider mb-1.5" htmlFor="adminEmail">
              Email
            </label>
            <input
              id="adminEmail"
              type="email"
              autoComplete="username"
              placeholder="admin@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full mb-4 bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-brand-orange transition"
            />

            <label className="block text-slate-300 text-xs font-semibold uppercase tracking-wider mb-1.5" htmlFor="adminPassword">
              Password
            </label>
            <input
              id="adminPassword"
              type="password"
              autoComplete="current-password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full mb-5 bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-brand-orange transition"
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-brand-orange text-white font-semibold rounded-lg py-3 hover:brightness-110 transition shadow-lg shadow-brand-orange/20 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing in…' : 'Sign in'}
            </button>
          </form>

          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 border-t border-slate-800"></div>
            <span className="text-slate-500 text-xs uppercase tracking-wider">or</span>
            <div className="flex-1 border-t border-slate-800"></div>
          </div>

          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 bg-white text-slate-900 font-semibold rounded-lg py-3 hover:bg-slate-100 transition disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <svg width="18" height="18" viewBox="0 0 48 48">
              <path
                fill="#FFC107"
                d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.6-6 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.8 1.1 7.9 3l5.7-5.7C34.6 6 29.6 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.2-.1-2.4-.4-3.5z"
              />
              <path
                fill="#FF3D00"
                d="M6.3 14.7l6.6 4.8C14.6 16 18.9 13 24 13c3 0 5.8 1.1 7.9 3l5.7-5.7C34.6 6 29.6 4 24 4 16.2 4 9.4 8.3 6.3 14.7z"
              />
              <path
                fill="#4CAF50"
                d="M24 44c5.5 0 10.4-1.9 14.2-5.1l-6.6-5.5C29.6 35.4 27 36 24 36c-5.2 0-9.6-3.3-11.2-8l-6.6 5.1C9.3 39.6 16.1 44 24 44z"
              />
              <path
                fill="#1976D2"
                d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.3 4.3-4.2 5.7l6.6 5.5C41.5 36.2 44 30.6 44 24c0-1.2-.1-2.4-.4-3.5z"
              />
            </svg>
            Sign in with Google
          </button>

          <p className="text-slate-500 text-xs text-center mt-6">Access is restricted to authorized admin accounts only.</p>
        </div>
      </div>
    </>
  );
}
