import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { authAPI } from '../utils/api';
import { errText } from './lib';
import { Btn, Field, inp } from './ui';

/** Sign-in for the church office (/cms/login) and the member portal (/my/login) */
export default function SignIn({ portal }: { portal?: boolean }) {
  const [email, setEmail] = useState('');
  const [pw, setPw] = useState('');
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  const nav = useNavigate();
  const loc = useLocation() as any;
  const home = portal ? '/my' : '/cms';

  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setErr(''); setBusy(true);
    try {
      const r = await authAPI.login(email.trim(), pw);
      localStorage.setItem('token', r.data.token);
      nav(loc.state?.back || home, { replace: true });
    } catch (x: any) {
      setErr(x?.response?.status === 401 || x?.response?.status === 400 ? 'The email or password is not right.' : errText(x));
    } finally { setBusy(false); }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary-900 via-primary-800 to-accent-800 px-4 py-10">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl md:p-8">
        <div className="mb-6 flex items-center gap-3">
          <img src="/image/New_Logo.png" alt="" className="h-12 w-12" />
          <div>
            <h1 className="font-heading text-xl font-extrabold text-gray-900">{portal ? 'Member portal' : 'Church office'}</h1>
            <p className="text-sm text-gray-600">Household Of Covenant And Faith Apostolic Ministry</p>
          </div>
        </div>
        <form onSubmit={submit} className="space-y-4">
          <Field label="Email"><input className={inp} type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} required /></Field>
          <Field label="Password"><input className={inp} type="password" autoComplete="current-password" value={pw} onChange={(e) => setPw(e.target.value)} required /></Field>
          {err && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{err}</p>}
          <Btn type="submit" disabled={busy} className="w-full">{busy ? 'Signing in…' : 'Sign in'}</Btn>
        </form>
        <div className="mt-5 flex flex-wrap justify-between gap-2 text-sm">
          <Link to="/forgot-password" className="font-semibold text-primary-700 hover:underline">Forgot password?</Link>
          {portal ? <Link to="/my/register" state={loc.state} className="font-semibold text-primary-700 hover:underline">New here? Create an account</Link>
            : <Link to="/my/login" className="text-gray-600 hover:underline">Member? Go to the member portal</Link>}
        </div>
        <p className="mt-6 text-center text-xs text-gray-500"><Link to="/" className="hover:underline">← Back to the church website</Link></p>
      </div>
    </div>
  );
}
