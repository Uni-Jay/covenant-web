import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaCamera, FaCheckCircle } from 'react-icons/fa';
import { cms, errText, MONTHS } from './lib';
import { Btn, Field, inp } from './ui';

const TITLES = ['', 'Apostle', 'Pastor', 'Pastor (Mrs.)', 'Rev.', 'Bishop', 'Prophet', 'Prophetess', 'Evang.', 'Min.', 'Elder', 'Deacon', 'Deaconess', 'Bro.', 'Sis.', 'Mr.', 'Mrs.', 'Miss', 'Dr.', 'Engr.', 'Chief', 'Prof.', 'Master'];
const DEPTS = ['Choir', 'Ushering', 'Media', 'Protocol', 'Sanctuary', 'Children', 'Youth', 'Women', 'Men', 'Prayer', 'Evangelism', 'Welfare', 'Technical', 'Drama', 'Hospitality'];
const days = Array.from({ length: 31 }, (_, i) => i + 1);

/** Shrink a photo on the phone before sending (900 px, like Church Studio’s form) */
function shrink(file: File): Promise<string> {
  return new Promise((res, rej) => {
    const url = URL.createObjectURL(file), img = new Image();
    img.onload = () => {
      const sc = Math.min(1, 900 / Math.max(img.width, img.height)), c = document.createElement('canvas');
      c.width = Math.round(img.width * sc); c.height = Math.round(img.height * sc);
      c.getContext('2d')!.drawImage(img, 0, 0, c.width, c.height); URL.revokeObjectURL(url);
      res(c.toDataURL('image/jpeg', 0.82));
    };
    img.onerror = () => rej(new Error('That picture couldn’t be opened. Please choose another one.'));
    img.src = url;
  });
}

function PhotoPick({ value, onChange, label }: { value: string; onChange: (v: string) => void; label: string }) {
  const [err, setErr] = useState('');
  return (
    <div className="flex items-center gap-4">
      <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-dashed border-primary-200 bg-primary-50">
        {value ? <img src={value} alt="" className="h-full w-full object-cover" /> : <FaCamera className="text-2xl text-primary-300" />}
      </div>
      <div>
        <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-secondary-500 px-4 py-2.5 font-semibold text-white hover:bg-secondary-600">
          <FaCamera /> {value ? 'Change photo' : label}
          <input type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; e.target.value = ''; if (f) shrink(f).then((v) => { setErr(''); onChange(v); }).catch((x) => setErr(x.message)); }} />
        </label>
        <p className="mt-1 text-xs text-gray-500">A clear, recent photo of your face. It is used on your birthday card.</p>
        {err && <p className="mt-1 text-sm text-red-600">{err}</p>}
      </div>
    </div>
  );
}

export default function Birthday() {
  const [mode, setMode] = useState<'new' | 'update'>('new');
  const [done, setDone] = useState('');
  return (
    <div className="min-h-screen bg-[#f6f3ee]">
      <header className="bg-gradient-to-br from-primary-900 via-primary-800 to-accent-800 px-4 pb-16 pt-8 text-center text-white">
        <img src="/image/logo-trimmed.png" alt="Household Of Covenant And Faith Apostolic Ministry" className="mx-auto mb-3 h-36 w-auto drop-shadow-xl" />
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-secondary-200">Household Of Covenant And Faith Apostolic Ministry</p>
        <h1 className="mt-2 font-heading text-3xl font-extrabold">Birthday register 🎂</h1>
        <p className="mx-auto mt-2 max-w-md text-primary-100">Fill this once so the church can celebrate you on your birthday.</p>
      </header>
      <main className="mx-auto -mt-10 max-w-lg px-4 pb-12">
        <div className="rounded-2xl bg-white p-5 shadow-xl md:p-7">
          {done ? (
            <div className="py-8 text-center">
              <FaCheckCircle className="mx-auto mb-4 text-6xl text-emerald-500" />
              <h2 className="mb-2 font-heading text-2xl font-extrabold">Thank you! 🎉</h2>
              <p className="text-gray-700">{done}</p>
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <Btn kind="ghost" onClick={() => { setDone(''); setMode('new'); }}>Register someone else</Btn>
                <Link to="/"><Btn kind="soft">Visit our website</Btn></Link>
              </div>
            </div>
          ) : (
            <>
              <div className="mb-5 grid grid-cols-2 gap-1 rounded-xl bg-gray-100 p-1">
                {(['new', 'update'] as const).map((m) => (
                  <button key={m} onClick={() => setMode(m)} className={`rounded-lg py-2.5 text-[15px] font-semibold ${mode === m ? 'bg-white text-primary-800 shadow-sm' : 'text-gray-600'}`}>
                    {m === 'new' ? 'New: register' : 'Update my photo'}
                  </button>
                ))}
              </div>
              {mode === 'new' ? <NewForm onDone={setDone} /> : <UpdateForm onDone={setDone} />}
            </>
          )}
        </div>
        <p className="mt-4 text-center text-xs text-gray-500">Your details are only used by the church to celebrate you.</p>
      </main>
    </div>
  );
}

function NewForm({ onDone }: { onDone: (t: string) => void }) {
  const [x, setX] = useState({ title: '', name: '', day: '', month: '', year: '', phone: '', dept: '', married: false, annDay: '', annMonth: '', spouse: '', consent: true });
  const [photo, setPhoto] = useState('');
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  const set = (k: string, v: any) => setX({ ...x, [k]: v });
  const send = async (e: React.FormEvent) => {
    e.preventDefault(); setErr('');
    if (!x.name.trim() || !x.day || !x.month) { setErr('Please type your name and choose your birthday.'); return; }
    setBusy(true);
    try {
      await cms.post('/public/birthday', { ...x, annDay: x.married ? x.annDay : '', annMonth: x.married ? x.annMonth : '', spouse: x.married ? x.spouse : '', photo });
      onDone(`We have your birthday, ${x.name.trim().split(' ')[0]}. The church will celebrate you on ${x.day} ${MONTHS[Number(x.month) - 1]}. God bless you!`);
    } catch (er) { setErr(errText(er)); } finally { setBusy(false); }
  };
  return (
    <form onSubmit={send} className="space-y-4">
      <PhotoPick value={photo} onChange={setPhoto} label="Add your photo" />
      <div className="grid grid-cols-[130px_1fr] gap-3">
        <Field label="Title"><select className={inp} value={x.title} onChange={(e) => set('title', e.target.value)}>{TITLES.map((t) => <option key={t} value={t}>{t || '—'}</option>)}</select></Field>
        <Field label="Full name"><input className={inp} value={x.name} onChange={(e) => set('name', e.target.value)} maxLength={60} autoComplete="name" placeholder="e.g. Funke Adeyemi" required /></Field>
      </div>
      <div>
        <span className="mb-1 block text-sm font-semibold text-gray-700">Birthday <span className="font-normal text-gray-500">(the year is optional)</span></span>
        <div className="grid grid-cols-[1fr_1.5fr_1fr] gap-2">
          <select className={inp} value={x.day} onChange={(e) => set('day', e.target.value)} aria-label="Day" required><option value="">Day</option>{days.map((d) => <option key={d}>{d}</option>)}</select>
          <select className={inp} value={x.month} onChange={(e) => set('month', e.target.value)} aria-label="Month" required><option value="">Month</option>{MONTHS.map((m, i) => <option key={m} value={i + 1}>{m}</option>)}</select>
          <input className={inp} value={x.year} onChange={(e) => set('year', e.target.value.replace(/\D/g, '').slice(0, 4))} inputMode="numeric" placeholder="Year" aria-label="Year" />
        </div>
      </div>
      <Field label="Phone number (WhatsApp)"><input className={inp} type="tel" value={x.phone} onChange={(e) => set('phone', e.target.value)} maxLength={30} placeholder="e.g. 0803 123 4567" /></Field>
      <Field label="Department or unit (optional)">
        <input className={inp} value={x.dept} onChange={(e) => set('dept', e.target.value)} maxLength={60} list="bday-depts" placeholder="e.g. Choir, Ushering, Youth" />
        <datalist id="bday-depts">{DEPTS.map((d) => <option key={d} value={d} />)}</datalist>
      </Field>
      <label className="flex items-center gap-2 text-[15px]"><input type="checkbox" className="h-4 w-4" checked={x.married} onChange={(e) => set('married', e.target.checked)} /> I am married (add our wedding anniversary)</label>
      {x.married && (
        <div className="space-y-3 rounded-xl bg-secondary-50 p-3">
          <div className="grid grid-cols-2 gap-2">
            <select className={inp} value={x.annDay} onChange={(e) => set('annDay', e.target.value)} aria-label="Anniversary day"><option value="">Day</option>{days.map((d) => <option key={d}>{d}</option>)}</select>
            <select className={inp} value={x.annMonth} onChange={(e) => set('annMonth', e.target.value)} aria-label="Anniversary month"><option value="">Month</option>{MONTHS.map((m, i) => <option key={m} value={i + 1}>{m}</option>)}</select>
          </div>
          <Field label="Spouse’s name"><input className={inp} value={x.spouse} onChange={(e) => set('spouse', e.target.value)} maxLength={60} /></Field>
        </div>
      )}
      <label className="flex items-start gap-2 text-sm text-gray-700"><input type="checkbox" className="mt-0.5 h-4 w-4" checked={x.consent} onChange={(e) => set('consent', e.target.checked)} /> The church may show my name and photo on the screen, in the bulletin and on the live stream on my birthday.</label>
      {err && <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{err}</p>}
      <Btn type="submit" kind="gold" disabled={busy} className="w-full py-3.5 text-base">{busy ? 'Sending…' : 'Send my birthday'}</Btn>
    </form>
  );
}

function UpdateForm({ onDone }: { onDone: (t: string) => void }) {
  const [x, setX] = useState({ phone: '', day: '', month: '', consent: true });
  const [who, setWho] = useState<{ id: number; name: string }[] | null>(null);
  const [pick, setPick] = useState<number | null>(null);
  const [found, setFound] = useState<string>('');
  const [photo, setPhoto] = useState('');
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  const call = async (extra: any) => cms.post('/public/birthday/update', { ...x, who: pick, ...extra });
  const find = async () => {
    setErr(''); setBusy(true);
    try {
      const r = await call({ check: true });
      if (r.choose) { setWho(r.choose); return; }
      setFound(r.name);
    } catch (er) { setErr(errText(er)); } finally { setBusy(false); }
  };
  const send = async () => {
    if (!photo) { setErr('Please choose your new photo.'); return; }
    setErr(''); setBusy(true);
    try { const r = await call({ photo }); onDone(`Your new photo is saved, ${r.name}. It will be on your next birthday card. God bless you!`); }
    catch (er) { setErr(errText(er)); } finally { setBusy(false); }
  };
  return (
    <div className="space-y-4">
      {!found ? (
        <>
          <p className="text-[15px] text-gray-600">Type the phone number and birthday you registered with, so we can find you.</p>
          <Field label="Phone number you registered with"><input className={inp} type="tel" value={x.phone} onChange={(e) => setX({ ...x, phone: e.target.value })} placeholder="e.g. 0803 123 4567" /></Field>
          <div className="grid grid-cols-2 gap-2">
            <select className={inp} value={x.day} onChange={(e) => setX({ ...x, day: e.target.value })} aria-label="Day"><option value="">Day</option>{days.map((d) => <option key={d}>{d}</option>)}</select>
            <select className={inp} value={x.month} onChange={(e) => setX({ ...x, month: e.target.value })} aria-label="Month"><option value="">Month</option>{MONTHS.map((m, i) => <option key={m} value={i + 1}>{m}</option>)}</select>
          </div>
          {who && (
            <div className="space-y-2">
              <p className="text-sm font-semibold text-gray-700">More than one person has these details. Which one are you?</p>
              {who.map((w) => <button key={w.id} onClick={() => setPick(w.id)} className={`block w-full rounded-xl border px-3 py-2.5 text-left ${pick === w.id ? 'border-primary-600 bg-primary-50' : 'border-gray-200'}`}>{w.name}</button>)}
            </div>
          )}
          {err && <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{err}</p>}
          <Btn kind="primary" className="w-full py-3.5" disabled={busy || (!!who && !pick)} onClick={find}>{busy ? 'Looking…' : 'Find me'}</Btn>
        </>
      ) : (
        <>
          <p className="rounded-xl bg-emerald-50 p-3 text-[15px] text-emerald-900">Hello <b>{found}</b>! Choose your new photo.</p>
          <PhotoPick value={photo} onChange={setPhoto} label="Choose new photo" />
          <label className="flex items-start gap-2 text-sm text-gray-700"><input type="checkbox" className="mt-0.5 h-4 w-4" checked={x.consent} onChange={(e) => setX({ ...x, consent: e.target.checked })} /> The church may show my name and photo on the screen, in the bulletin and on the live stream on my birthday.</label>
          {err && <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{err}</p>}
          <Btn kind="gold" className="w-full py-3.5" disabled={busy} onClick={send}>{busy ? 'Saving…' : 'Save my new photo'}</Btn>
        </>
      )}
    </div>
  );
}
