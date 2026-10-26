import { useState } from 'react';
import { FaCheckCircle, FaPray, FaStar, FaUserPlus, FaChevronLeft } from 'react-icons/fa';
import { cms, errText } from './lib';
import { Btn, Field, inp } from './ui';

type Kind = 'prayer' | 'testimony' | 'visitor';
const CHOICES: { k: Kind; icon: any; title: string; text: string }[] = [
  { k: 'prayer', icon: FaPray, title: 'Prayer request', text: 'Tell us what to pray about' },
  { k: 'testimony', icon: FaStar, title: 'Testimony', text: 'Share what God has done' },
  { k: 'visitor', icon: FaUserPlus, title: 'I’m visiting', text: 'Let us welcome you' },
];

/** What the church screen’s QR code opens: prayer requests, testimonies and visitor cards, sent to the media desk */
export default function Message() {
  const [kind, setKind] = useState<Kind | null>(null);
  const [done, setDone] = useState(false);
  return (
    <div className="min-h-screen bg-[#f6f3ee]">
      <header className="bg-gradient-to-br from-primary-900 via-primary-800 to-accent-800 px-4 pb-16 pt-8 text-center text-white">
        <img src="/image/logo-trimmed.png" alt="Household Of Covenant And Faith Apostolic Ministry" className="mx-auto mb-3 h-32 w-auto drop-shadow-xl" />
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-secondary-200">Household Of Covenant And Faith Apostolic Ministry</p>
        <h1 className="mt-2 font-heading text-3xl font-extrabold">Welcome! 🙏</h1>
        <p className="mx-auto mt-2 max-w-md text-primary-100">Send a prayer request, a testimony, or tell us you’re visiting.</p>
      </header>
      <main className="mx-auto -mt-10 max-w-lg px-4 pb-12">
        <div className="rounded-2xl bg-white p-5 shadow-xl md:p-7">
          {done ? (
            <div className="py-8 text-center">
              <FaCheckCircle className="mx-auto mb-4 text-6xl text-emerald-500" />
              <h2 className="mb-2 font-heading text-2xl font-extrabold">Thank you! 🙏</h2>
              <p className="text-gray-700">God bless you. You can send another one any time.</p>
              <Btn kind="ghost" className="mt-6" onClick={() => { setDone(false); setKind(null); }}>Send another</Btn>
            </div>
          ) : !kind ? (
            <div className="grid gap-3">
              {CHOICES.map((c) => (
                <button key={c.k} onClick={() => setKind(c.k)} className="flex items-center gap-4 rounded-2xl border border-gray-200 p-4 text-left transition hover:border-primary-300 hover:bg-primary-50">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-secondary-100 text-xl text-secondary-700"><c.icon /></span>
                  <span><b className="block text-lg text-gray-900">{c.title}</b><span className="text-gray-600">{c.text}</span></span>
                </button>
              ))}
            </div>
          ) : (
            <MessageForm kind={kind} onBack={() => setKind(null)} onDone={() => setDone(true)} />
          )}
        </div>
      </main>
    </div>
  );
}

function MessageForm({ kind, onBack, onDone }: { kind: Kind; onBack: () => void; onDone: () => void }) {
  const [x, setX] = useState({ name: '', from: '', phone: '', text: '', first: true, private: true });
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  const send = async (e: React.FormEvent) => {
    e.preventDefault(); setErr(''); setBusy(true);
    try { await cms.post('/public/message', { type: kind, ...x }); onDone(); } catch (er) { setErr(errText(er)); } finally { setBusy(false); }
  };
  return (
    <form onSubmit={send} className="space-y-4">
      <button type="button" onClick={onBack} className="inline-flex items-center gap-1 text-sm font-semibold text-primary-700"><FaChevronLeft /> Back</button>
      {kind === 'prayer' && <>
        <h2 className="font-heading text-xl font-extrabold">Prayer request</h2>
        <Field label="Your name (optional)"><input className={inp} value={x.name} onChange={(e) => setX({ ...x, name: e.target.value })} maxLength={60} autoComplete="name" /></Field>
        <Field label="What should we pray about?"><textarea className={`${inp} min-h-[120px]`} value={x.text} onChange={(e) => setX({ ...x, text: e.target.value })} maxLength={1200} required /></Field>
        <Field label="Phone number (optional, so the prayer team can reach you)"><input className={inp} type="tel" value={x.phone} onChange={(e) => setX({ ...x, phone: e.target.value })} maxLength={30} /></Field>
        <label className="flex items-start gap-2 text-sm text-gray-700"><input type="checkbox" className="mt-0.5 h-4 w-4" checked={x.private} onChange={(e) => setX({ ...x, private: e.target.checked })} /> Keep it private (only the pastors see it, not on the screen)</label>
      </>}
      {kind === 'testimony' && <>
        <h2 className="font-heading text-xl font-extrabold">Testimony</h2>
        <Field label="Your name"><input className={inp} value={x.name} onChange={(e) => setX({ ...x, name: e.target.value })} maxLength={60} autoComplete="name" /></Field>
        <Field label="Your testimony"><textarea className={`${inp} min-h-[140px]`} value={x.text} onChange={(e) => setX({ ...x, text: e.target.value })} maxLength={1200} required /></Field>
      </>}
      {kind === 'visitor' && <>
        <h2 className="font-heading text-xl font-extrabold">Welcome! We’re glad you’re here</h2>
        <Field label="Your name"><input className={inp} value={x.name} onChange={(e) => setX({ ...x, name: e.target.value })} maxLength={60} autoComplete="name" placeholder="e.g. Sis. Funke Adeyemi" required /></Field>
        <Field label="Where are you from? (optional)"><input className={inp} value={x.from} onChange={(e) => setX({ ...x, from: e.target.value })} maxLength={60} placeholder="e.g. Ibadan" /></Field>
        <Field label="Phone number (optional, for follow-up)"><input className={inp} type="tel" value={x.phone} onChange={(e) => setX({ ...x, phone: e.target.value })} maxLength={30} /></Field>
        <label className="flex items-center gap-2 text-[15px]"><input type="checkbox" className="h-4 w-4" checked={x.first} onChange={(e) => setX({ ...x, first: e.target.checked })} /> This is my first time here</label>
      </>}
      {err && <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{err}</p>}
      <Btn type="submit" kind="gold" disabled={busy} className="w-full py-3.5 text-base">{busy ? 'Sending…' : kind === 'prayer' ? 'Send prayer request' : kind === 'testimony' ? 'Send testimony' : 'Send'}</Btn>
    </form>
  );
}
